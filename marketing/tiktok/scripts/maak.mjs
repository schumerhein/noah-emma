/**
 * Bouwt en rendert alle TikTok-posts uit posts.mjs.
 *
 *   node marketing/tiktok/scripts/maak.mjs                 → alles
 *   node marketing/tiktok/scripts/maak.mjs 01-pov 03       → alleen posts waarvan het id zo begint
 *   PREVIEW=1 node marketing/tiktok/scripts/maak.mjs       → alleen één still per scène (snel nakijken)
 *
 * Uitvoer in marketing/tiktok/dist/:
 *   <id>.mp4          video 1080×1920, 30 fps, zonder geluid (geluid kies je in TikTok)
 *   <id>-cover.png    eerste beeld met de hook, als omslagfoto
 *   <id>/01.png ...   carrousel-foto's (TikTok-fotomodus)
 */
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { POSTS } from "../posts.mjs";

// via require, zodat ook een globaal geïnstalleerde Playwright (NODE_PATH) gevonden wordt
const { chromium } = createRequire(import.meta.url)("playwright");

const map = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(map, "../assets");
const dist = join(map, "dist");
const FPS = 30;
const CARROUSEL_DUUR = 2.5; // alleen voor de animatie; we pakken het eindbeeld
const W = 1080, H = 1920;

const template = readFileSync(join(map, "template.html"), "utf8");
const svg = (naam, klasse = "") =>
  readFileSync(join(assets, `${naam}.svg`), "utf8").replace("<svg ", `<svg class="${klasse}" `);

// *accent* en | regelbreuk → woord-spans die één voor één verschijnen
function woorden(tekst = "", start = 0) {
  let i = start;
  const html = tekst
    .split("|")
    .map((regel) =>
      regel
        .split(/(\*[^*]+\*)/)
        .filter(Boolean)
        .map((stuk) => {
          const accent = stuk.startsWith("*");
          const ws = stuk.replace(/\*/g, "").split(" ").filter(Boolean)
            .map((w) => `<span class="w" style="--i:${i++}">${esc(w)}</span>`).join(" ");
          // spaties rond het stuk behouden, zodat "*2 jaar*?" geen losse "?" oplevert
          const voor = /^\s/.test(stuk) ? " " : "", na = /\s$/.test(stuk) ? " " : "";
          return voor + (accent ? `<em>${ws}</em>` : ws) + na;
        })
        .join("")
    )
    .join("<br>");
  return { html, aantal: i - start };
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const regels = (s = "") => s.split("|").map(esc).join("<br>");

const KLEDING = [
  ['<path d="M22 8 12 12 4 24l8 6 4-4v30h32V26l4 4 8-6-8-12-10-4q-10 8-20 0Z" fill="#ffb8c4"/><path d="M22 8q10 8 20 0" stroke="#f793ab" stroke-width="2" fill="none"/>', 20, 30, -12],
  ['<path d="M25 6h4l3 6 3-6h4l-1 14 12 36H14l12-36Z" fill="#7fb5e8"/><path d="M18 46h28" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>', 230, 160, 6],
  ['<path d="M24 6h14v30l12 9q5 6-1 11-4 3-9 0L27 49q-4-2-3-8Z" fill="#ffd58a"/><path d="M24 12h14" stroke="#fff" stroke-width="3" opacity=".8"/>', 470, 10, 16],
  ['<path d="M14 8h36l4 48H38l-6-30-6 30H10Z" fill="#a8dfc9"/><path d="M14 14h36" stroke="#fff" stroke-width="3" opacity=".8"/>', 430, 230, -8],
  ['<path d="M20 10h24l4 10-6 6v28H22V26l-6-6Z" fill="#c9b6f2"/><circle cx="32" cy="34" r="4" fill="#fff" opacity=".8"/>', 60, 250, 10],
];

function scene(s, start, duur, laatste) {
  const bg = s.bg || "roze";
  const vars = `--in:${start}s;--out:${laatste ? 999 : start + duur}s`;
  const kop = (tekst, klein) => {
    const { html, aantal } = woorden(tekst);
    return { h: `<h1 class="${klein ? "klein" : ""}">${html}</h1>`, na: 0.1 + aantal * 0.11 + 0.15 };
  };
  let inhoud = "";
  let na = 0.4;
  const t = s.tekst ? kop(s.tekst, s.type !== "hook") : null;
  if (t) na = t.na;
  const sub = s.sub ? `<p class="sub" style="--na:${na}s">${regels(s.sub)}</p>` : "";

  switch (s.type) {
    case "hook":
      inhoud = `${s.kicker ? `<div class="kicker">${esc(s.kicker)}</div>` : ""}${t.h}${sub}`;
      break;
    case "kleding":
      inhoud = `<div class="kleding">${KLEDING.map(([d, x, y, r], i) =>
        `<svg viewBox="0 0 64 64" style="left:${x}px;top:${y}px;--r:${r}deg;--d:${(i * 0.14).toFixed(2)}s">${d}</svg>`).join("")}</div>${t.h}${sub}`;
      break;
    case "duo":
      inhoud = `<div class="duo">${svg("noah-body", "noah")}${svg("emma-body", "emma")}</div>${t.h}${sub}`;
      break;
    case "solo":
      inhoud = `<div class="solo"><div class="ballon">${esc(s.ballon)}</div>${svg(`${s.wie}-body`)}</div><div class="label">${esc(s.label)}</div>`;
      break;
    case "groei": {
      const maten = ["62", "86", "116", "146"];
      inhoud = `<div class="groei">${maten.map((m, i) =>
        `<div class="stap" style="--i:${i}">${svg(`${s.wie}-groei-${m}`)}<span class="maat">${m}</span></div>`).join("")}</div>${t.h}`;
      break;
    }
    case "schild":
      inhoud = `<div class="schild"><svg viewBox="0 0 64 64"><path d="M32 4 56 12v18c0 16-11 26-24 30C19 56 8 46 8 30V12Z" fill="#ffb8c4"/><path d="M32 9 51 15.5V30c0 13-8.5 21-19 24.5C21.5 51 13 43 13 30V15.5Z" fill="#fff" opacity=".35"/><path class="vink" d="M21 32l8 8 15-16" stroke="#0f172a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>${t.h}${sub}`;
      break;
    case "tip":
      inhoud = `<div class="nummer">${s.nr}</div>${t.h}${sub}`;
      break;
    case "teller":
      inhoud = `<div class="teller" style="--doel:${s.getal}"></div><div class="eenheid">${esc(s.eenheid)}</div>${s.sub ? `<p class="sub" style="--na:1.3s">${regels(s.sub)}</p>` : ""}`;
      break;
    case "eind":
      inhoud = `<div class="gezichten">${svg("noah-face", "gn")}${svg("emma-face", "ge")}</div>
        <div class="tekst-blok"><div class="wordmark">Noah &amp; Emma</div>
        <p class="sub" style="--na:.5s">${esc(s.tekst || "Tweedehands kindermode · 0–12 jaar")}</p></div>
        <div class="pil">Link in bio</div>`;
      break;
    default:
      throw new Error(`Onbekend scènetype: ${s.type}`);
  }
  return `<section class="scene t-${s.type} bg-${bg}" style="${vars}"><div class="blob b1"></div><div class="blob b2"></div>${inhoud}</section>`;
}

function bouw(post) {
  let start = 0;
  const tijden = [];
  const html = post.scenes.map((s, i) => {
    const duur = s.duur ?? CARROUSEL_DUUR;
    tijden.push({ start, duur });
    const out = scene(s, start, duur, i === post.scenes.length - 1);
    start += duur;
    return out;
  }).join("\n");
  const pagina = template.replace("{{TITEL}}", post.id).replace("{{DUUR}}", start).replace("{{SCENES}}", html);
  const pad = join(dist, "bron", `${post.id}.html`);
  writeFileSync(pad, pagina);
  return { pad, tijden, totaal: start };
}

mkdirSync(join(dist, "bron"), { recursive: true });
const filter = process.argv.slice(2);
const posts = POSTS.filter((p) => !filter.length || filter.some((f) => p.id.startsWith(f)));
const preview = !!process.env.PREVIEW;

const browser = await chromium.launch();
for (const post of posts) {
  const { pad, tijden, totaal } = bouw(post);
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(pathToFileURL(pad).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const zet = (ms) => page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), ms);
  // Eindbeeld van een scène: vlak voor de volgende cut, of na 2,4 s bij de laatste
  const eindbeeld = ({ start, duur }) => (start + Math.min(duur - 0.05, 2.4)) * 1000;

  if (post.soort === "carrousel" || preview) {
    const uit = join(dist, preview ? "preview" : "", post.id);
    mkdirSync(uit, { recursive: true });
    for (const [i, t] of tijden.entries()) {
      await zet(eindbeeld(t));
      await page.screenshot({ path: join(uit, `${String(i + 1).padStart(2, "0")}.png`) });
    }
    console.log(`${preview ? "preview" : "carrousel"} ${post.id}: ${tijden.length} beelden`);
    await page.close();
    continue;
  }

  await zet(eindbeeld(tijden[0]));
  await page.screenshot({ path: join(dist, `${post.id}-cover.png`) });

  const mp4 = join(dist, `${post.id}.mp4`);
  const ff = spawn("ffmpeg", [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const klaar = new Promise((ok, fout) => ff.on("close", (c) => (c === 0 ? ok() : fout(new Error(`ffmpeg ${c}`)))));
  for (let i = 0; i < Math.round(totaal * FPS); i++) {
    await zet((i * 1000) / FPS);
    const png = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await klaar;
  console.log(`video ${post.id}: ${totaal.toFixed(1)} s`);
  await page.close();
}
await browser.close();
