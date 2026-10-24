# Marketing

Social- en advertentiemateriaal, gemaakt uit dezelfde Noah & Emma-figuren als de app.

- `assets/` bevat de SVG's van Noah & Emma, geëxporteerd uit de app-code met
  `npx tsx marketing/scripts/exporteer-avatars.ts`
- `tiktok/` bevat de organische TikTok-posts (video's + carrousel). Zie `tiktok/POSTS.md` voor
  bijschriften, hashtags en hoe je ze opnieuw maakt.
- `google-ads/` bevat geanimeerde HTML5-banners in 8 Google Ads-formaten plus de bron voor
  video's. Dit staat in de wacht: bouwen met `node marketing/google-ads/scripts/bouw.mjs`.

Benodigd: Node 22, ffmpeg en Playwright/Chromium (voor het renderen van video's).
