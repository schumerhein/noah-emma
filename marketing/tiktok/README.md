# TikTok-automatisering Noah & Emma

Elke twee dagen maakt een geplande taak een nieuwe animatievideo (1080×1920, met geluid),
schrijft titel, omschrijving en hashtags, kiest de thumbnail en plaatst de video op TikTok.
De werkwijze en de regels voor de inhoud staan in [REGELS.md](REGELS.md).

- `bron/`: animatiebibliotheek, renderer (Playwright → ffmpeg), geluid (`audio.py`) en voorbeelden
- `onderwerpen.json`: lijst met onderwerpen, de taak werkt die van boven naar beneden af
- `posts/`: één map per video met `video.mp4`, `meta.json` (caption, thumbnail-moment, uploadstatus)
- `upload_tiktok.py`: plaatst een video via de TikTok Content Posting API

Inloggegevens (TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REFRESH_TOKEN, TIKTOK_PRIVACY)
staan als variabelen in de cloud-omgeving, nooit in deze repo.
