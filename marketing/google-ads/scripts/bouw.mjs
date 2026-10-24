/**
 * Bouwt alle Google Ads HTML5-banners (+ zip per formaat) en de bronpagina's voor de video's.
 * Draaien vanuit de projectroot: node marketing/google-ads/scripts/bouw.mjs
 *
 * Uitvoer:
 *   marketing/google-ads/dist/banners/<WxH>/index.html
 *   marketing/google-ads/dist/banners/noah-emma-<WxH>.zip   ← deze upload je in Google Ads
 *   marketing/google-ads/dist/video-bron/<WxH>.html          ← input voor render-video.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const map = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(map, "dist");
const URL = process.env.CLICK_URL || "https://www.noah-emma.nl";

// Formaten: layout + maten (px) per formaat; logo = diameter van de gezichtjes op het eindbeeld
export const BANNERS = [
  { w: 300, h: 250, layout: "blok",  h1: 24, p: 13, cta: 14, vis: 104, pad: 16, logo: 64 },
  { w: 336, h: 280, layout: "blok",  h1: 27, p: 14, cta: 15, vis: 120, pad: 18, logo: 74 },
  { w: 300, h: 600, layout: "hoog",  h1: 34, p: 16, cta: 18, vis: 250, pad: 24, logo: 120 },
  { w: 160, h: 600, layout: "hoog",  h1: 22, p: 13, cta: 14, vis: 190, pad: 12, logo: 72 },
  { w: 728, h: 90,  layout: "breed", h1: 24, p: 13, cta: 15, vis: 72,  pad: 10, logo: 44 },
  { w: 970, h: 250, layout: "breed", h1: 40, p: 18, cta: 20, vis: 200, pad: 26, logo: 120 },
  { w: 320, h: 100, layout: "breed", h1: 18, p: 11, cta: 12, vis: 80,  pad: 9, logo: 40 },
  { w: 320, h: 50,  layout: "mini",  h1: 15, p: 0,  cta: 11, vis: 40,  pad: 5, logo: 28 },
];

export const VIDEOS = [
  { w: 1920, h: 1080, layout: "breed", h1: 104, p: 48, cta: 52, vis: 620, pad: 130, logo: 280, extra: "eind-gestapeld" },
  { w: 1080, h: 1080, layout: "blok",  h1: 84,  p: 40, cta: 44, vis: 470, pad: 70, logo: 260 },
  { w: 1080, h: 1920, layout: "hoog",  h1: 128, p: 54, cta: 62, vis: 980, pad: 90, logo: 440 },
];

const template = readFileSync(join(map, "template.html"), "utf8");
const svg = (naam, klasse) =>
  readFileSync(join(map, "../assets", `${naam}.svg`), "utf8").replace("<svg ", `<svg class="${klasse}" `);

function vul(f, { border }) {
  const waarden = {
    W: f.w, H: f.h, LAYOUT: f.layout, URL,
    H1: f.h1, P: f.p, CTA: f.cta, VIS: f.vis, LOGO: f.logo, EXTRA: f.extra ?? "", PAD: f.pad, BORDER: border,
    NOAH_BODY: svg("noah-body", "noah"), EMMA_BODY: svg("emma-body", "emma"),
    NOAH_FACE: svg("noah-face", "gn"),   EMMA_FACE: svg("emma-face", "ge"),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in waarden)) throw new Error(`Onbekende placeholder {{${k}}}`);
    return String(waarden[k]);
  });
}

rmSync(dist, { recursive: true, force: true });

for (const f of BANNERS) {
  const naam = `${f.w}x${f.h}`;
  const dir = join(dist, "banners", naam);
  mkdirSync(dir, { recursive: true });
  // Lichte achtergrond → Google eist een zichtbare rand
  writeFileSync(join(dir, "index.html"), vul(f, { border: 1 }));
  const zip = join(dist, "banners", `noah-emma-${naam}.zip`);
  execFileSync("zip", ["-q", "-j", "-9", zip, join(dir, "index.html")]);
  const kb = statSync(zip).size / 1024;
  if (kb > 150) throw new Error(`${naam}: zip is ${kb.toFixed(0)} KB (max 150 KB voor Google Ads)`);
  console.log(`banner ${naam.padEnd(8)} ${kb.toFixed(1)} KB`);
}

mkdirSync(join(dist, "video-bron"), { recursive: true });
for (const f of VIDEOS) {
  writeFileSync(join(dist, "video-bron", `${f.w}x${f.h}.html`), vul(f, { border: 0 }));
  console.log(`video-bron ${f.w}x${f.h}`);
}
