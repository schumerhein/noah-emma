'use client';

import type { ImageSegmenter, PoseLandmarker } from '@mediapipe/tasks-vision';
import { detecteerGezicht } from './kledingDetectie';
import { tekenHoofd, type ModelNaam } from './noahEmmaHoofd';

/**
 * Kledingstuk uitknippen uit een foto waarop een kind het draagt.
 *
 * Alles draait op het toestel zelf (MediaPipe, WebAssembly): de originele
 * foto met het kind verlaat de telefoon nooit, alleen het uitgeknipte
 * kledingstuk wordt geüpload.
 *
 * Werking:
 * 1. Het segmentatiemodel geeft per pixel de kans op "kleding" (los van
 *    huid, haar, gezicht en achtergrond). Het model kijkt op 256×256 pixels;
 *    daarom zoeken we eerst waar de kleding staat en segmenteren we daarna
 *    alleen die uitsnede opnieuw: staat het kind klein in beeld, dan worden
 *    de randen zo veel scherper.
 * 2. Het houdingsmodel geeft de heuphoogte; rond die hoogte zoeken we de
 *    naad tussen boven- en onderstuk aan de hand van de kleur. Zo kan de
 *    verkoper kiezen: bovenkant, onderkant of alles.
 * 3. Losse snippers (bv. kleding van iemand anders op de achtergrond) gaan
 *    eruit; het kledingstuk komt met zachte randen en een lichte schaduw op
 *    een rustige achtergrond te staan.
 * 4. Desgewenst krijgt het kledingstuk het hoofd van Noah of Emma (passend
 *    bij de maat) op de plek waar het hoofd van het kind zat: de nek achter
 *    de kraag, het gezicht ervoor. Het kledingstuk blijft het grootst in beeld.
 *
 * De gezichtscontrole (fotoVeiligheid.ts) draait daarna nog op het resultaat.
 */

export type Kledingdeel = 'boven' | 'onder' | 'geheel';

export interface KledingAnalyse {
  /** Werkbeeld (verkleind origineel); blijft op het toestel. */
  beeld: HTMLCanvasElement;
  breedte: number;
  hoogte: number;
  /** Kans op kleding per pixel (0..1), op beeldresolutie. */
  kleding: Float32Array;
  /** Rij waar boven- en onderstuk gescheiden worden, of null zonder houding. */
  naadY: number | null;
  /** true als de naad op een duidelijke kleurovergang ligt (shirt ≠ broek). */
  naadOpKleur: boolean;
  /** Aantal pixels met duidelijk kleding (kans > 0,5), voor de minimumgrootte. */
  kledingPixels: number;
  /** Waar het gezicht van het kind zat (werkbeeld-coördinaten), of null. */
  gezicht: Vak | null;
}

interface Vak { x: number; y: number; breedte: number; hoogte: number }

/** Het uitgeknipte kledingstuk, nog zonder achtergrond. */
export interface Uitsnede {
  deel: Kledingdeel;
  /** Transparant, strak om de omlijning van het kledingstuk. */
  knip: HTMLCanvasElement;
  /** Waar het gezicht van het kind zat, in knip-coördinaten (meestal erboven). */
  gezicht: Vak | null;
}

export interface Model { naam: ModelNaam; maat: string }

const WASM_PAD = '/mediapipe/wasm';
const SEGMENTATIE_MODEL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/1/selfie_multiclass_256x256.tflite';
const HOUDING_MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
// Klassen van selfie_multiclass: 0 achtergrond, 1 haar, 2 huid, 3 gezicht, 4 kleding, 5 overig.
const KLASSE_GEZICHT = 3;
const KLASSE_KLEDING = 4;
const MAX_WERKMAAT = 1024;
const ACHTERGROND = '#F6F2EF';

let modellen: Promise<{ segmenter: ImageSegmenter; houding: PoseLandmarker }> | null = null;

function laadModellen() {
  if (!modellen) {
    modellen = (async () => {
      const { FilesetResolver, ImageSegmenter, PoseLandmarker } = await import('@mediapipe/tasks-vision');
      const vision = await FilesetResolver.forVisionTasks(WASM_PAD);
      const [segmenter, houding] = await Promise.all([
        ImageSegmenter.createFromOptions(vision, {
          baseOptions: { modelAssetPath: SEGMENTATIE_MODEL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          outputCategoryMask: false,
          outputConfidenceMasks: true,
        }),
        PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: HOUDING_MODEL, delegate: 'CPU' },
          runningMode: 'IMAGE',
          numPoses: 1,
        }),
      ]);
      return { segmenter, houding };
    })().catch((fout) => {
      // Niet onthouden: anders blijft elke volgende poging falen.
      modellen = null;
      throw fout;
    });
  }
  return modellen;
}

function laadAfbeelding(bron: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = bron;
  });
}

/** Schaal een masker van het model naar beeldresolutie (bilineair). */
function schaalMasker(bron: Float32Array, bw: number, bh: number, w: number, h: number): Float32Array {
  if (bw === w && bh === h) return bron.slice();
  const uit = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const fy = Math.min(bh - 1, Math.max(0, ((y + 0.5) * bh) / h - 0.5));
    const y0 = Math.floor(fy), y1 = Math.min(bh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = Math.min(bw - 1, Math.max(0, ((x + 0.5) * bw) / w - 0.5));
      const x0 = Math.floor(fx), x1 = Math.min(bw - 1, x0 + 1), tx = fx - x0;
      const boven = bron[y0 * bw + x0] * (1 - tx) + bron[y0 * bw + x1] * tx;
      const onder = bron[y1 * bw + x0] * (1 - tx) + bron[y1 * bw + x1] * tx;
      uit[y * w + x] = boven * (1 - ty) + onder * ty;
    }
  }
  return uit;
}

/**
 * Zoek de naad tussen boven- en onderstuk: de rij rond de heup waar de
 * gemiddelde kleur van de kledingpixels het sterkst omslaat.
 */
function zoekNaad(pixels: Uint8ClampedArray, kleding: Float32Array, w: number, h: number, heupY: number) {
  const band = Math.round(h * 0.14);
  const van = Math.max(1, heupY - band), tot = Math.min(h - 2, heupY + band);
  const gem: ([number, number, number] | null)[] = [];
  for (let y = van; y <= tot; y++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (kleding[i] > 0.6) { r += pixels[i * 4]; g += pixels[i * 4 + 1]; b += pixels[i * 4 + 2]; n++; }
    }
    gem.push(n >= Math.max(4, w * 0.01) ? [r / n, g / n, b / n] : null);
  }
  const venster = Math.max(4, Math.round(h * 0.02));
  const gemiddeldeVan = (a: number, z: number) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let k = a; k < z; k++) { const c = gem[k]; if (c) { r += c[0]; g += c[1]; b += c[2]; n++; } }
    return n ? [r / n, g / n, b / n] : null;
  };
  let besteY = heupY, besteVerschil = 0;
  for (let k = venster; k < gem.length - venster; k++) {
    const boven = gemiddeldeVan(k - venster, k), onder = gemiddeldeVan(k, k + venster);
    if (!boven || !onder) continue;
    const verschil = Math.hypot(boven[0] - onder[0], boven[1] - onder[1], boven[2] - onder[2]);
    if (verschil > besteVerschil) { besteVerschil = verschil; besteY = van + k; }
  }
  return besteVerschil > 45 ? { y: besteY, opKleur: true } : { y: heupY, opKleur: false };
}

function tekenOp(img: HTMLImageElement, sx: number, sy: number, sw: number, sh: number, maxMaat: number) {
  const schaal = Math.min(1, maxMaat / Math.max(sw, sh));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sw * schaal));
  canvas.height = Math.max(1, Math.round(sh * schaal));
  canvas.getContext('2d', { willReadFrequently: true })!.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** Kansmaskers voor de gevraagde klassen, op beeldresolutie. */
function segmenteer(segmenter: ImageSegmenter, beeld: HTMLCanvasElement, klassen: number[]): Float32Array[] {
  const segmentatie = segmenter.segment(beeld);
  try {
    return klassen.map((k) => {
      const masker = segmentatie.confidenceMasks?.[k];
      if (!masker) throw new Error('Geen masker');
      return schaalMasker(masker.getAsFloat32Array(), masker.width, masker.height, beeld.width, beeld.height);
    });
  } finally {
    segmentatie.close();
  }
}

/** Omlijning van het grootste aaneengesloten vlak boven de drempel. */
function grootsteVlak(masker: Float32Array, w: number, h: number, drempel: number) {
  const label = new Int32Array(w * h);
  const rij: number[] = [];
  let beste: { minX: number; minY: number; maxX: number; maxY: number; n: number } | null = null;
  for (let start = 0, id = 1; start < masker.length; start++) {
    if (masker[start] <= drempel || label[start]) continue;
    const vlak = { minX: w, minY: h, maxX: -1, maxY: -1, n: 0 };
    label[start] = id;
    rij.push(start);
    while (rij.length) {
      const c = rij.pop()!;
      const x = c % w, y = (c - x) / w;
      vlak.n++;
      if (x < vlak.minX) vlak.minX = x; if (x > vlak.maxX) vlak.maxX = x;
      if (y < vlak.minY) vlak.minY = y; if (y > vlak.maxY) vlak.maxY = y;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (masker[ni] > drempel && !label[ni]) { label[ni] = id; rij.push(ni); }
      }
    }
    if (!beste || vlak.n > beste.n) beste = vlak;
    id++;
  }
  return beste;
}

export async function analyseerKleding(bron: string): Promise<KledingAnalyse> {
  const img = await laadAfbeelding(bron);
  const [{ segmenter, houding }, gezichtOrigineel] = await Promise.all([laadModellen(), detecteerGezicht(img)]);

  // Ronde 1: waar staat de kleding ongeveer?
  const overzicht = tekenOp(img, 0, 0, img.width, img.height, 512);
  const [grof, gezichtKans] = segmenteer(segmenter, overzicht, [KLASSE_KLEDING, KLASSE_GEZICHT]);
  let minX = overzicht.width, minY = overzicht.height, maxX = -1, maxY = -1;
  for (let y = 0; y < overzicht.height; y++) for (let x = 0; x < overzicht.width; x++) {
    if (grof[y * overzicht.width + x] > 0.4) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX) throw new Error('Geen kleding gevonden');

  // Ronde 2: alleen die uitsnede (met ruime marge) op hogere resolutie.
  const f = img.width / overzicht.width;
  const marge = 0.15 * Math.max(maxX - minX, maxY - minY);
  const sx = Math.max(0, (minX - marge) * f), sy = Math.max(0, (minY - marge) * f);
  const sw = Math.min(img.width, (maxX + marge) * f) - sx, sh = Math.min(img.height, (maxY + marge) * f) - sy;
  const beeld = tekenOp(img, sx, sy, sw, sh, MAX_WERKMAAT);
  const w = beeld.width, h = beeld.height;
  const [kleding] = segmenteer(segmenter, beeld, [KLASSE_KLEDING]);
  let kledingPixels = 0;
  for (let i = 0; i < kleding.length; i++) if (kleding[i] > 0.5) kledingPixels++;

  // Heuphoogte voor boven/onder. Alleen als de heupen echt in beeld zijn:
  // op een portret zonder benen bestaat er geen "onderkant".
  const pose = houding.detect(beeld);
  const punten = pose.landmarks[0];
  pose.close();
  let naadY: number | null = null;
  let naadOpKleur = false;
  const heupL = punten?.[23], heupR = punten?.[24];
  if (heupL && heupR && (heupL.visibility ?? 1) > 0.5 && (heupR.visibility ?? 1) > 0.5) {
    const heupY = Math.round(((heupL.y + heupR.y) / 2) * h);
    if (heupY > h * 0.15 && heupY < h * 0.88) {
      const naad = zoekNaad(beeld.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, w, h).data, kleding, w, h, heupY);
      naadY = naad.y;
      naadOpKleur = naad.opKleur;
    }
  }
  // Waar zat het gezicht? Het segmentatiemodel geeft de huid van het gezicht
  // (zonder haar en oren) veel strakker dan de gezichtsdetector, wiens kader
  // vaak haar en schouders meeneemt. Die is alleen het vangnet.
  const s = w / sw;
  const vlak = grootsteVlak(gezichtKans, overzicht.width, overzicht.height, 0.5);
  const gezicht = vlak && vlak.n >= 12
    ? {
        x: (vlak.minX * f - sx) * s,
        y: (vlak.minY * f - sy) * s,
        breedte: (vlak.maxX - vlak.minX + 1) * f * s,
        hoogte: (vlak.maxY - vlak.minY + 1) * f * s,
      }
    : gezichtOrigineel && {
        x: (gezichtOrigineel.x + gezichtOrigineel.width * 0.08 - sx) * s,
        y: (gezichtOrigineel.y - sy) * s,
        breedte: gezichtOrigineel.width * 0.84 * s,
        hoogte: gezichtOrigineel.height * 0.95 * s,
      };
  return { beeld, breedte: w, hoogte: h, kleding, naadY, naadOpKleur, kledingPixels, gezicht };
}

/** Welk deel staat standaard geselecteerd: afgeleid van de subcategorie. */
export function standaardDeel(subcategorie: string, analyse: KledingAnalyse | null): Kledingdeel {
  const s = subcategorie.toLowerCase();
  if (/jas|vest|trui|sweater|t-shirt|top|polo|overhemd/.test(s)) return 'boven';
  if (/broek|short|legging/.test(s)) return 'onder';
  if (s) return 'geheel';
  // Nog geen categorie: één kleur van boven tot onder (jurk, pakje) → alles.
  return analyse?.naadOpKleur ? 'boven' : 'geheel';
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Knip het gekozen deel uit (transparant, nog zonder achtergrond).
 * Geeft null als er (vrijwel) geen kleding in dat deel zit.
 */
export function knipUit(a: KledingAnalyse, deel: Kledingdeel): Uitsnede | null {
  const { breedte: w, hoogte: h, kleding } = a;
  if (deel !== 'geheel' && a.naadY == null) return null;
  const naad = a.naadY ?? 0;
  const zacht = Math.max(3, Math.round(h * 0.006));

  // 1. Alfa per pixel: kans op kleding, beperkt tot het gekozen deel.
  const alfa = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const deelFactor = deel === 'boven' ? smooth(-zacht, zacht, naad - y)
      : deel === 'onder' ? smooth(-zacht, zacht, y - naad) : 1;
    if (deelFactor === 0) continue;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      alfa[i] = smooth(0.3, 0.7, kleding[i]) * deelFactor;
    }
  }

  // 2. Losse snippers weg: verbonden vlakken op een grof raster, alleen de
  //    grote houden (≥ 15% van het grootste).
  const stap = Math.max(1, Math.round(Math.max(w, h) / 256));
  const rw = Math.ceil(w / stap), rh = Math.ceil(h / stap);
  const vol = new Uint8Array(rw * rh);
  for (let ry = 0; ry < rh; ry++) for (let rx = 0; rx < rw; rx++) {
    const x = Math.min(w - 1, rx * stap + (stap >> 1)), y = Math.min(h - 1, ry * stap + (stap >> 1));
    vol[ry * rw + rx] = alfa[y * w + x] > 0.5 ? 1 : 0;
  }
  const label = new Int32Array(rw * rh);
  const grootte: number[] = [0];
  const rij: number[] = [];
  for (let start = 0; start < vol.length; start++) {
    if (!vol[start] || label[start]) continue;
    const id = grootte.length;
    let n = 0;
    label[start] = id;
    rij.length = 0;
    rij.push(start);
    while (rij.length) {
      const c = rij.pop()!;
      n++;
      const cx = c % rw, cy = (c - cx) / rw;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= rw || ny >= rh) continue;
        const ni = ny * rw + nx;
        if (vol[ni] && !label[ni]) { label[ni] = id; rij.push(ni); }
      }
    }
    grootte.push(n);
  }
  const grootste = Math.max(0, ...grootte);
  if (grootste === 0) return null;
  const houden = grootte.map((n) => n >= grootste * 0.15);
  const behouden = (rx: number, ry: number) => {
    // Randpixels liggen vaak in een rastercel net onder de drempel: kijk dan
    // naar de buren, anders worden de zachte randen hard afgesneden.
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = rx + dx, ny = ry + dy;
      if (nx < 0 || ny < 0 || nx >= rw || ny >= rh) continue;
      const l = label[ny * rw + nx];
      if (l && houden[l]) return true;
    }
    return false;
  };

  let minX = w, minY = h, maxX = -1, maxY = -1, dekking = 0;
  for (let y = 0; y < h; y++) {
    const ry = Math.floor(y / stap);
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (alfa[i] === 0) continue;
      if (!behouden(Math.floor(x / stap), ry)) { alfa[i] = 0; continue; }
      if (alfa[i] > 0.5) {
        dekking++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }
  // Te weinig over (bv. een strookje onder de naad): dit deel bestaat niet.
  if (maxX < minX || dekking < Math.max(600, a.kledingPixels * 0.12)) return null;

  // 3. Uitknippen op de omlijning, met alfa als transparantie.
  const bw = maxX - minX + 1, bh = maxY - minY + 1;
  const knip = document.createElement('canvas');
  knip.width = bw;
  knip.height = bh;
  const kctx = knip.getContext('2d')!;
  const bronPixels = a.beeld.getContext('2d', { willReadFrequently: true })!.getImageData(minX, minY, bw, bh);
  const d = bronPixels.data;
  for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
    d[(y * bw + x) * 4 + 3] = Math.round(alfa[(y + minY) * w + (x + minX)] * 255);
  }
  kctx.putImageData(bronPixels, 0, 0);

  const gezicht = a.gezicht && { ...a.gezicht, x: a.gezicht.x - minX, y: a.gezicht.y - minY };
  return { deel, knip, gezicht };
}

function laadSvg(svg: string): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  return laadAfbeelding(url).finally(() => URL.revokeObjectURL(url));
}

/**
 * Eerste rij (van boven) waar het kledingstuk begint in een strook rond
 * kolom x: de kraag, of bij een V-hals de schouderlijn ernaast.
 */
function kraagOnder(knip: HTMLCanvasElement, x: number, vanaf: number, breedte: number): number | null {
  const x0 = Math.max(0, Math.round(x - breedte / 2)), x1 = Math.min(knip.width, Math.round(x + breedte / 2));
  if (x1 <= x0) return null;
  const y0 = Math.max(0, Math.round(vanaf));
  if (y0 >= knip.height) return null;
  const d = knip.getContext('2d', { willReadFrequently: true })!.getImageData(x0, y0, x1 - x0, knip.height - y0).data;
  const bw = x1 - x0;
  for (let y = 0; y < knip.height - y0; y++) {
    let n = 0;
    for (let x = 0; x < bw; x++) if (d[(y * bw + x) * 4 + 3] > 128) n++;
    if (n > bw * 0.25) return y0 + y;
  }
  return null;
}

/**
 * Zet de uitsnede op een rustige achtergrond (4:5), eventueel met het hoofd
 * van Noah of Emma erop. Bij alleen een onderkant (broek, rok) komt er geen
 * hoofd bij.
 */
export async function stelSamen(u: Uitsnede, model: Model | null): Promise<HTMLCanvasElement> {
  const { knip } = u;
  const kw = knip.width, kh = knip.height;

  // Hoofd plaatsen: op de plek van het echte gezicht, even breed. Zonder
  // bekend gezicht: midden boven het kledingstuk, in verhouding tot de breedte.
  let hoofd: null | {
    tekening: ReturnType<typeof tekenHoofd>;
    schaal: number; kinX: number; kinY: number;
  } = null;
  if (model && u.deel !== 'onder') {
    const g = u.gezicht;
    // Het kledingstuk is de hoofdzaak: het hoofd wordt nooit breder dan ~60% ervan.
    const gezichtB = Math.min(g ? g.breedte : kw * 0.42, kw * 0.6);
    const kinX = g ? g.x + g.breedte / 2 : kw / 2;
    const schaal = gezichtB / 100;
    // De kin komt een kinderlijk kort nekje boven de kraag (de nek van het
    // echte kind kan langer zijn of door een pose vertekend). Zonder gevonden
    // kraag blijft de kin waar die op de foto zat.
    const kraag = kraagOnder(knip, kinX, g ? g.y + g.hoogte * 0.7 : 0, gezichtB);
    const nekZichtbaar = tekenHoofd(model.naam, model.maat).nekZichtbaar;
    const kinY = kraag != null ? kraag - nekZichtbaar * schaal : g ? g.y + g.hoogte : -gezichtB * 0.04;
    hoofd = { tekening: tekenHoofd(model.naam, model.maat, { nekLengte: nekZichtbaar + 22 }), schaal, kinX, kinY };
  }

  // Omlijning van alles wat in beeld moet: kledingstuk (+ hoofd).
  let x0 = 0, y0 = 0, x1 = kw, y1 = kh;
  if (hoofd) {
    const { tekening: t, schaal, kinX, kinY } = hoofd;
    const naarX = (sx: number) => kinX + (sx - t.kin.x) * schaal;
    x0 = Math.min(x0, naarX(t.omvang.links));
    x1 = Math.max(x1, naarX(t.omvang.rechts));
    y0 = Math.min(y0, kinY + (t.omvang.boven - t.kin.y) * schaal);
  }
  const bw = x1 - x0, bh = y1 - y0;

  const uit = document.createElement('canvas');
  uit.width = 1000;
  uit.height = 1250;
  const ctx = uit.getContext('2d')!;
  ctx.fillStyle = ACHTERGROND;
  ctx.fillRect(0, 0, uit.width, uit.height);
  // Zacht licht achter het kledingstuk: trekt de aandacht naar het midden.
  const licht = ctx.createRadialGradient(500, 700, 60, 500, 700, 720);
  licht.addColorStop(0, 'rgba(255,255,255,0.75)');
  licht.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = licht;
  ctx.fillRect(0, 0, uit.width, uit.height);

  // Hoogte max 80%: zo valt er in vierkante tegels (zoekresultaten) niets van
  // het hoofd af.
  const schaal = Math.min((uit.width * 0.86) / bw, (uit.height * 0.8) / bh);
  const ox = (uit.width - bw * schaal) / 2 - x0 * schaal;
  const oy = (uit.height - bh * schaal) / 2 - y0 * schaal;
  ctx.imageSmoothingQuality = 'high';

  const tekenLaag = async (svg: string) => {
    if (!hoofd) return;
    const { tekening: t, schaal: hs, kinX, kinY } = hoofd;
    const img = await laadSvg(svg);
    const s = hs * schaal;
    ctx.drawImage(img, ox + (kinX + (t.vak.x - t.kin.x) * hs) * schaal, oy + (kinY + (t.vak.y - t.kin.y) * hs) * schaal, t.vak.breedte * s, t.vak.hoogte * s);
  };

  // Nek en lang haar achter het kledingstuk.
  if (hoofd) await tekenLaag(hoofd.tekening.achter);

  ctx.save();
  ctx.shadowColor = 'rgba(36, 26, 46, 0.2)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 16;
  ctx.drawImage(knip, ox, oy, kw * schaal, kh * schaal);
  ctx.restore();

  // Gezicht, haar en strikjes ervoor, met een zachte schaduw op de kraag.
  if (hoofd) {
    ctx.save();
    ctx.shadowColor = 'rgba(36, 26, 46, 0.14)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    await tekenLaag(hoofd.tekening.voor);
    ctx.restore();
  }
  return uit;
}

/** Canvas naar een JPEG-bestand voor de upload. */
export async function alsBestand(canvas: HTMLCanvasElement): Promise<{ file: File; dataUrl: string }> {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  const blob: Blob = await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/jpeg', 0.88));
  // Unieke naam: de upload zet er wel een tijdstempel voor, maar twee
  // uitsneden binnen dezelfde milliseconde zouden elkaar dan overschrijven.
  const naam = `kledingstuk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  return { file: new File([blob], naam, { type: 'image/jpeg' }), dataUrl };
}
