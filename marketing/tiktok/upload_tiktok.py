#!/usr/bin/env python3
"""Upload een video naar TikTok via de Content Posting API (Direct Post).

Gebruik:  python3 upload_tiktok.py posts/<map>
De map bevat video.mp4 en meta.json met {"caption": "...", "cover_ms": 1900}.

Nodig in de omgeving (Project settings > Cloud environment):
  TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN
Optioneel:
  TIKTOK_PRIVACY  standaard SELF_ONLY. Zet op PUBLIC_TO_EVERYONE zodra TikTok
                  de app heeft goedgekeurd (een niet-goedgekeurde app mag alleen
                  privé posten).

Schrijft het resultaat (publish_id en status) terug in meta.json.
Exitcode 2 = geen inloggegevens ingesteld, video is niet geüpload.
"""
import json, math, os, sys, time, urllib.parse, urllib.request

API = "https://open.tiktokapis.com"
CHUNK = 10 * 1024 * 1024


def call(method, url, body=None, headers=None, data=None):
    headers = dict(headers or {})
    if body is not None:
        data = json.dumps(body).encode()
        headers.setdefault("Content-Type", "application/json; charset=UTF-8")
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            raw = r.read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"TikTok API-fout {e.code} op {url}: {e.read().decode(errors='replace')}")
    return json.loads(raw) if raw else {}


def access_token():
    key, secret, refresh = (os.environ.get(k) for k in ("TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"))
    if not (key and secret and refresh):
        print("Geen TikTok-inloggegevens in de omgeving; video niet geüpload.")
        sys.exit(2)
    data = urllib.parse.urlencode({"client_key": key, "client_secret": secret,
                                   "grant_type": "refresh_token", "refresh_token": refresh}).encode()
    tok = call("POST", f"{API}/v2/oauth/token/", data=data,
               headers={"Content-Type": "application/x-www-form-urlencoded"})
    if "access_token" not in tok:
        raise SystemExit(f"Token vernieuwen mislukt: {tok}")
    if tok.get("refresh_token") and tok["refresh_token"] != refresh:
        print("Let op: TikTok gaf een nieuwe refresh token terug. Werk TIKTOK_REFRESH_TOKEN bij in de omgeving.")
    return tok["access_token"]


def main(folder):
    meta_path = os.path.join(folder, "meta.json")
    meta = json.load(open(meta_path))
    video = os.path.join(folder, "video.mp4")
    size = os.path.getsize(video)
    token = access_token()
    auth = {"Authorization": f"Bearer {token}"}

    info = call("POST", f"{API}/v2/post/publish/creator_info/query/", body={}, headers=auth)["data"]
    privacy = os.environ.get("TIKTOK_PRIVACY", "SELF_ONLY")
    if privacy not in info.get("privacy_level_options", []):
        print(f"Privacy {privacy} niet toegestaan voor dit account, terugval op SELF_ONLY.")
        privacy = "SELF_ONLY"

    chunk = size if size <= CHUNK else CHUNK
    count = max(1, size // chunk)
    init = call("POST", f"{API}/v2/post/publish/video/init/", headers=auth, body={
        "post_info": {
            "title": meta["caption"][:2200],
            "privacy_level": privacy,
            "disable_comment": False,
            "disable_duet": False,
            "disable_stitch": False,
            "video_cover_timestamp_ms": int(meta.get("cover_ms", 1000)),
        },
        "source_info": {"source": "FILE_UPLOAD", "video_size": size, "chunk_size": chunk, "total_chunk_count": count},
    })["data"]

    with open(video, "rb") as f:
        for i in range(count):
            start = i * chunk
            end = size if i == count - 1 else start + chunk
            f.seek(start)
            part = f.read(end - start)
            call("PUT", init["upload_url"], data=part, headers={
                "Content-Type": "video/mp4", "Content-Length": str(len(part)),
                "Content-Range": f"bytes {start}-{end - 1}/{size}"})

    status = {}
    for _ in range(40):
        time.sleep(6)
        status = call("POST", f"{API}/v2/post/publish/status/fetch/", headers=auth,
                      body={"publish_id": init["publish_id"]}).get("data", {})
        if status.get("status") in ("PUBLISH_COMPLETE", "FAILED"):
            break
    meta["tiktok"] = {"publish_id": init["publish_id"], "privacy": privacy, "status": status.get("status"),
                      "fail_reason": status.get("fail_reason"), "geupload_op": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
    json.dump(meta, open(meta_path, "w"), ensure_ascii=False, indent=2)
    print(json.dumps(meta["tiktok"], ensure_ascii=False))
    if status.get("status") != "PUBLISH_COMPLETE":
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1])
