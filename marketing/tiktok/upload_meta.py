#!/usr/bin/env python3
"""Plaats een post ook op Instagram en Facebook via de Meta Graph API.

Gebruik:  python3 upload_meta.py posts/<map>
De map bevat video.mp4 en meta.json (zelfde als voor upload_tiktok.py). Een carrousel
(meta.json "vorm": "carrousel") gaat op Instagram als fotocarrousel van slide-*.jpg;
op Facebook als swipe-video (video.mp4).

Nodig in de omgeving (Project settings > Cloud environment):
  META_ACCESS_TOKEN   token van de systeemgebruiker (verloopt niet)
Optioneel:
  META_PAGE_ID, META_IG_USER_ID   anders zoekt het script ze zelf op
  META_GRAPH_VERSION              standaard v23.0
  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   alleen voor Instagram-carrousels: de
                  slides gaan tijdelijk in de openbare bucket "social", omdat Meta
                  foto's alleen van een openbare link ophaalt.

Schrijft per kanaal het resultaat (id, link, status) terug in meta.json.
Mislukt één kanaal, dan gaat het andere gewoon door.
Exitcode 2 = geen META_ACCESS_TOKEN, niets geplaatst. Exitcode 1 = een kanaal mislukt.
"""
import glob, json, os, re, subprocess, sys, tempfile, time, urllib.parse, urllib.request

VERSION = os.environ.get("META_GRAPH_VERSION", "v23.0")
GRAPH = f"https://graph.facebook.com/{VERSION}"
RUPLOAD = "https://rupload.facebook.com"
SITE = "https://www.noah-emma.nl"


def call(method, url, params=None, data=None, headers=None):
    if params:
        url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, data=data, method=method, headers=dict(headers or {}))
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            raw = r.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise RuntimeError(f"Meta API-fout {e.code} op {url.split('?')[0]}: {body}")
    return json.loads(raw) if raw else {}


def graph(method, path, token, **params):
    params["access_token"] = token
    if method == "GET":
        return call("GET", f"{GRAPH}/{path}", params)
    return call("POST", f"{GRAPH}/{path}", data=urllib.parse.urlencode(params).encode(),
                headers={"Content-Type": "application/x-www-form-urlencoded"})


def rupload(url, token, path):
    data = open(path, "rb").read()
    return call("POST", url, data=data, headers={
        "Authorization": f"OAuth {token}", "offset": "0", "file_size": str(len(data)),
        "Content-Type": "application/octet-stream"})


def find_accounts(token):
    page_id, ig_id = os.environ.get("META_PAGE_ID"), os.environ.get("META_IG_USER_ID")
    pages = graph("GET", "me/accounts", token, fields="id,name,access_token,instagram_business_account")["data"]
    if not pages:
        raise RuntimeError("De token heeft geen toegang tot een Facebook-pagina.")
    page = next((p for p in pages if p["id"] == page_id), pages[0])
    ig_id = ig_id or (page.get("instagram_business_account") or {}).get("id")
    return page, ig_id


def split_caption(caption):
    """Geeft (tekst zonder hashtag-regel, lijst hashtags)."""
    lines = caption.rstrip().split("\n")
    tags = []
    while lines and lines[-1].strip().startswith("#"):
        tags = lines.pop().split() + tags
    return "\n".join(lines), tags


def caption_for(meta, kanaal):
    if meta.get(f"caption_{kanaal}"):
        return meta[f"caption_{kanaal}"]
    tekst, tags = split_caption(meta["caption"])
    tags = tags or meta.get("hashtags", [])
    if kanaal == "facebook":
        # Op Facebook is een link wel klikbaar: geen "link in bio", maar de volledige link.
        tekst = re.sub(r"noah-emma\.nl\s*\(link in bio\)", SITE, tekst)
        tags = tags[:2]
    else:
        tags = tags[:5]
    return tekst + ("\n" + " ".join(tags) if tags else "")


def wait_ig(container, token):
    for _ in range(60):
        st = graph("GET", container, token, fields="status_code,status")
        if st.get("status_code") == "FINISHED":
            return
        if st.get("status_code") in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"Instagram verwerkte de media niet: {st.get('status')}")
        time.sleep(5)
    raise RuntimeError("Instagram bleef te lang bezig met verwerken.")


def publish_ig(ig_id, token, container):
    wait_ig(container, token)
    media = graph("POST", f"{ig_id}/media_publish", token, creation_id=container)["id"]
    link = graph("GET", media, token, fields="permalink").get("permalink")
    return {"id": media, "link": link}


def ig_reel(ig_id, token, video, caption, cover_ms):
    c = graph("POST", f"{ig_id}/media", token, media_type="REELS", upload_type="resumable",
              caption=caption, share_to_feed="true", thumb_offset=str(int(cover_ms)))
    rupload(c["uri"], token, video)
    return publish_ig(ig_id, token, c["id"])


def supabase_upload(folder, slides):
    url, key = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not (url and key):
        raise RuntimeError("SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY ontbreken; carrousel kan niet naar Instagram.")
    url = url.rstrip("/")
    prefix = os.path.basename(os.path.normpath(folder))
    links, paths = [], []
    for s in slides:
        path = f"{prefix}/{os.path.basename(s)}"
        call("POST", f"{url}/storage/v1/object/social/{path}", data=open(s, "rb").read(), headers={
            "Authorization": f"Bearer {key}", "apikey": key, "Content-Type": "image/jpeg", "x-upsert": "true"})
        links.append(f"{url}/storage/v1/object/public/social/{path}")
        paths.append(path)

    def opruimen():
        try:
            call("DELETE", f"{url}/storage/v1/object/social", data=json.dumps({"prefixes": paths}).encode(),
                 headers={"Authorization": f"Bearer {key}", "apikey": key, "Content-Type": "application/json"})
        except RuntimeError as e:
            print(f"Opruimen van de slides in Supabase mislukt (niet erg): {e}")
    return links, opruimen


def ig_carrousel(ig_id, token, folder, caption):
    slides = sorted(glob.glob(os.path.join(folder, "slide-*.jpg")),
                    key=lambda p: int(re.search(r"(\d+)", os.path.basename(p)).group(1)))[:10]
    if len(slides) < 2:
        raise RuntimeError("Minder dan 2 slides gevonden voor de carrousel.")
    links, opruimen = supabase_upload(folder, slides)
    try:
        kids = [graph("POST", f"{ig_id}/media", token, image_url=l, is_carousel_item="true")["id"] for l in links]
        for k in kids:
            wait_ig(k, token)
        c = graph("POST", f"{ig_id}/media", token, media_type="CAROUSEL", children=",".join(kids), caption=caption)
        return publish_ig(ig_id, token, c["id"])
    finally:
        opruimen()


def fb_reel(page, video, caption):
    pid, ptoken = page["id"], page["access_token"]
    start = graph("POST", f"{pid}/video_reels", ptoken, upload_phase="start")
    vid = start["video_id"]
    rupload(start.get("upload_url") or f"{RUPLOAD}/video-upload/{VERSION}/{vid}", ptoken, video)
    graph("POST", f"{pid}/video_reels", ptoken, upload_phase="finish", video_id=vid,
          video_state="PUBLISHED", description=caption)
    status = {}
    for _ in range(60):
        status = graph("GET", vid, ptoken, fields="status").get("status", {})
        if status.get("video_status") in ("ready", "error"):
            break
        time.sleep(5)
    if status.get("video_status") == "error":
        raise RuntimeError(f"Facebook verwerkte de video niet: {status}")
    return {"id": vid, "link": f"https://www.facebook.com/reel/{vid}", "video_status": status.get("video_status")}


def meta_video(video):
    """Maak een hoge-bitrate kopie voor Instagram/Facebook.

    Onze animaties zijn vlak en comprimeren tot ~1-2 Mbit/s. TikTok houdt dat netjes, maar
    Meta comprimeert een upload met zo'n lage bitrate nog een keer zwaar (blokjes en strepen
    in de kleurvlakken). Met ~12 Mbit/s, 48 kHz-audio en H.264 High 4.1 (Meta's specs) krijgt
    de video de betere kwaliteitsladder.
    """
    uit = os.path.join(tempfile.mkdtemp(), "meta.mp4")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", video,
                    "-c:v", "libx264", "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p",
                    "-preset", "slow", "-tune", "animation", "-r", "30", "-g", "60",
                    "-b:v", "12M", "-minrate", "12M", "-maxrate", "12M", "-bufsize", "24M",
                    "-x264-params", "nal-hrd=cbr", "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
                    "-movflags", "+faststart", uit], check=True)
    return uit


def main(folder):
    token = os.environ.get("META_ACCESS_TOKEN")
    if not token:
        print("Geen META_ACCESS_TOKEN in de omgeving; niet op Instagram/Facebook geplaatst.")
        sys.exit(2)
    meta_path = os.path.join(folder, "meta.json")
    meta = json.load(open(meta_path))
    video = meta_video(os.path.join(folder, "video.mp4"))
    carrousel = meta.get("vorm") == "carrousel"
    nu = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    fout = False

    try:
        page, ig_id = find_accounts(token)
    except RuntimeError as e:
        print(e)
        sys.exit(1)

    resultaat = {}
    try:
        if not ig_id:
            raise RuntimeError("Geen Instagram-bedrijfsaccount gekoppeld aan de Facebook-pagina.")
        cap = caption_for(meta, "instagram")
        r = ig_carrousel(ig_id, token, folder, cap) if carrousel else ig_reel(ig_id, token, video, cap, meta.get("cover_ms", 1000))
        resultaat["instagram"] = {**r, "status": "geplaatst", "vorm": "carrousel" if carrousel else "reel", "geupload_op": nu}
    except RuntimeError as e:
        fout = True
        resultaat["instagram"] = {"status": "mislukt", "fout": str(e)[:500], "geupload_op": nu}

    try:
        r = fb_reel(page, video, caption_for(meta, "facebook"))
        resultaat["facebook"] = {**r, "status": "geplaatst", "geupload_op": nu}
    except RuntimeError as e:
        fout = True
        resultaat["facebook"] = {"status": "mislukt", "fout": str(e)[:500], "geupload_op": nu}

    meta.update(resultaat)
    json.dump(meta, open(meta_path, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(resultaat, ensure_ascii=False, indent=2))
    sys.exit(1 if fout else 0)


if __name__ == "__main__":
    main(sys.argv[1])
