/**
 * Rendert de video's frame-voor-frame uit dist/video-bron/*.html naar MP4 (H.264, 30 fps).
 * Eerst `node marketing/google-ads/scripts/bouw.mjs` draaien.
 *
 *   node marketing/google-ads/scripts/render-video.mjs            → alle formaten
 *   node marketing/google-ads/scripts/render-video.mjs 1920x1080  → één formaat
 *   STILLS=1,4,9,14 node ... render-video.mjs                     → alleen PNG-stills op die seconden
 *
 * Werkt ook voor banners: BRON=banners ... render-video.mjs 300x250 (handig voor previews).
 */
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// via require, zodat ook een globaal geïnstalleerde Playwright (NODE_PATH) gevonden wordt
const { chromium } = createRequire(import.meta.url)("playwright");

const map = join(dirname(fileURLToPath(import.meta.url)), "..");
const FPS = 30;
const DUUR = 15; // seconden, gelijk aan de tijdlijn in template.html
const bron = process.env.BRON === "banners" ? "banners" : "video-bron";
const uit = join(map, "dist", bron === "banners" ? "previews" : "video");
mkdirSync(uit, { recursive: true });

const pad = (naam) =>
  bron === "banners" ? join(map, "dist/banners", naam, "index.html") : join(map, "dist/video-bron", `${naam}.html`);
const alle =
  bron === "banners"
    ? readdirSync(join(map, "dist/banners")).filter((n) => !n.endsWith(".zip"))
    : readdirSync(join(map, "dist/video-bron")).map((n) => n.replace(".html", ""));
const formaten = process.argv.slice(2).length ? process.argv.slice(2) : alle;
const stills = process.env.STILLS?.split(",").map(Number);

const browser = await chromium.launch();
for (const naam of formaten) {
  const [w, h] = naam.split("x").map(Number);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(pathToFileURL(pad(naam)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Alle CSS-animaties stilzetten; daarna per frame de tijd zelf instellen
  const zet = (ms) =>
    page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), ms);

  if (stills) {
    for (const s of stills) {
      await zet(s * 1000);
      await page.screenshot({ path: join(uit, `${naam}-${s}s.png`) });
    }
    console.log(`stills ${naam}`);
    await page.close();
    continue;
  }

  const mp4 = join(uit, `noah-emma-${naam}.mp4`);
  const ff = spawn("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", mp4,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const klaar = new Promise((ok, fout) => ff.on("close", (c) => (c === 0 ? ok() : fout(new Error(`ffmpeg ${c}`)))));

  for (let i = 0; i < FPS * DUUR; i++) {
    await zet((i * 1000) / FPS);
    const png = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await klaar;
  console.log(`video ${mp4}`);
  await page.close();
}
await browser.close();
