'use client';

import { getFullBodySvg, berekenLichaam } from './avatarFullBodySvg';
import { detecteerGezicht, kledingCropUitGezicht, type KledingCrop, type GezichtBox } from './kledingDetectie';

/**
 * Kleding-op-avatar compositie.
 *
 * De geüploade kledingfoto wordt in de shirtzone van de full-body avatar
 * "gestanst" (clip op de rompvorm), waarna armen, nek en hoofd er weer
 * overheen worden getekend. Resultaat: Noah of Emma draagt het kledingstuk —
 * in de gekozen maat, voor- én achterkant. Geen echte kinderfoto's zichtbaar.
 */

const CANVAS_W = 400;
const CANVAS_H = 520;

/** Welk deel van de kledingfoto we gebruiken (band uit het midden). */
const PHOTO_TOP_SKIP = 0.30;   // bovenste 30% overslaan (daar zit vaak een gezicht)
const PHOTO_BOTTOM_SKIP = 0.08;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function loadSvgAsImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG laden mislukt')); };
    img.src = url;
  });
}

/**
 * Schaal + positie van de avatar op het canvas.
 * De avatar vult het beeld altijd ruim (~94% van de hoogte),
 * ongeacht de maat — een baby staat dus even groot in beeld als een kind van 12.
 */
function avatarTransform(maat: string) {
  const m = berekenLichaam(maat);
  // Werkelijke hoogte van de avatar binnen de viewBox (incl. haar)
  const avatarTop = m.hoofdCy - m.hoofdRy * 1.4;
  const avatarBodem = m.grondY + 10;
  const lichaamH = avatarBodem - avatarTop;
  const s = (CANVAS_H * 0.94) / lichaamH;
  const offX = (CANVAS_W - m.W * s) / 2;
  // Grond onderaan het canvas uitlijnen
  const offY = CANVAS_H - avatarBodem * s - CANVAS_H * 0.02;
  return { m, s, offX, offY };
}

/**
 * Bouw het clip-pad van de shirtzone (zelfde vorm als de romp,
 * iets naar binnen zodat de shirtrand zichtbaar blijft).
 */
function shirtClipPath(maat: string): Path2D {
  const { m, s, offX, offY } = avatarTransform(maat);
  const X = (x: number) => offX + x * s;
  const Y = (y: number) => offY + y * s;
  const inzet = 3;

  const cx = m.cx;
  const sb = m.schouderB / 2 - inzet;
  const hb = m.heupB / 2 - inzet;
  const top = m.schouderY + 1;
  const bodem = m.heupY + 3;

  const p = new Path2D();
  p.moveTo(X(cx - sb), Y(top + 12));
  p.quadraticCurveTo(X(cx - sb), Y(top), X(cx - sb + 14), Y(top));
  p.lineTo(X(cx + sb - 14), Y(top));
  p.quadraticCurveTo(X(cx + sb), Y(top), X(cx + sb), Y(top + 12));
  p.quadraticCurveTo(X(cx + hb + 5), Y((top + bodem) / 2 + 10), X(cx + hb - 2), Y(bodem));
  p.quadraticCurveTo(X(cx), Y(bodem + 8), X(cx - hb + 2), Y(bodem));
  p.quadraticCurveTo(X(cx - hb - 5), Y((top + bodem) / 2 + 10), X(cx - sb), Y(top + 12));
  p.closePath();
  return p;
}

/**
 * Teken de kledingfoto passend in de shirtzone.
 * Met een gedetecteerde crop (kind draagt de kleding) wordt exact het
 * kledingstuk gebruikt; anders de middenband van de foto.
 */
function tekenKledingInShirt(
  ctx: CanvasRenderingContext2D,
  clothingImg: HTMLImageElement,
  maat: string,
  gespiegeld: boolean,
  crop: KledingCrop | null,
) {
  const { m, s, offX, offY } = avatarTransform(maat);
  const zoneX = offX + (m.cx - m.schouderB / 2) * s;
  const zoneY = offY + m.schouderY * s;
  const zoneW = m.schouderB * s;
  const zoneH = (m.heupY - m.schouderY + 10) * s;

  const srcX = crop ? Math.floor(crop.sx) : 0;
  const srcY = crop ? Math.floor(crop.sy) : Math.floor(clothingImg.height * PHOTO_TOP_SKIP);
  const srcH = crop ? Math.floor(crop.sh) : Math.floor(clothingImg.height * (1 - PHOTO_TOP_SKIP - PHOTO_BOTTOM_SKIP));
  const srcW = crop ? Math.floor(crop.sw) : clothingImg.width;

  const schaal = Math.max(zoneW / srcW, zoneH / srcH);
  const destW = srcW * schaal;
  const destH = srcH * schaal;
  const destX = zoneX + (zoneW - destW) / 2;
  // Bovenkant van de kleding uitlijnen met de schouders (niet centreren):
  // zo valt de kraag/schouderpartij van het kledingstuk op de juiste plek
  const destY = zoneY;

  ctx.save();
  ctx.clip(shirtClipPath(maat));

  if (gespiegeld) {
    ctx.translate(CANVAS_W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(clothingImg, srcX, srcY, srcW, srcH, CANVAS_W - destX - destW, destY, destW, destH);
  } else {
    ctx.drawImage(clothingImg, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
  }

  // Zachte schaduw langs de randen → stof-op-lijfje gevoel
  const rand = ctx.createLinearGradient(zoneX, 0, zoneX + zoneW, 0);
  rand.addColorStop(0, 'rgba(15,23,42,0.16)');
  rand.addColorStop(0.12, 'rgba(15,23,42,0)');
  rand.addColorStop(0.88, 'rgba(15,23,42,0)');
  rand.addColorStop(1, 'rgba(15,23,42,0.16)');
  ctx.fillStyle = rand;
  ctx.fillRect(zoneX, zoneY, zoneW, zoneH);

  const onder = ctx.createLinearGradient(0, zoneY + zoneH - 24, 0, zoneY + zoneH);
  onder.addColorStop(0, 'rgba(15,23,42,0)');
  onder.addColorStop(1, 'rgba(15,23,42,0.12)');
  ctx.fillStyle = onder;
  ctx.fillRect(zoneX, zoneY + zoneH - 24, zoneW, 24);

  ctx.restore();
}

async function maakCompositie(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
  maat: string,
  aanzicht: 'voor' | 'achter',
  crop: KledingCrop | null,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d')!;
  const { m, s, offX, offY } = avatarTransform(maat);
  const uid = Math.random().toString(36).slice(2);

  // 1. Zachte studio-achtergrond
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  if (aanzicht === 'voor') {
    bg.addColorStop(0, avatarType === 'noah' ? '#eef6ff' : '#fff2f5');
    bg.addColorStop(1, avatarType === 'noah' ? '#e3eefb' : '#fde9ee');
  } else {
    bg.addColorStop(0, avatarType === 'noah' ? '#e6f0fb' : '#fdecf1');
    bg.addColorStop(1, avatarType === 'noah' ? '#dbe8f7' : '#f9e2e9');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Subtiele vloer-ellips
  ctx.fillStyle = 'rgba(15,23,42,0.05)';
  ctx.beginPath();
  ctx.ellipse(CANVAS_W / 2, offY + m.grondY * s + 6, 120, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Volledige avatar (basis)
  const basisSvg = getFullBodySvg(avatarType, maat, { aanzicht, laag: 'alles', uid: `b${uid}` });
  const basisImg = await loadSvgAsImage(basisSvg);
  ctx.drawImage(basisImg, offX, offY, m.W * s, m.H * s);

  // 3. Kledingstuk in de shirtzone
  const clothingImg = await loadImage(clothingDataUrl);
  tekenKledingInShirt(ctx, clothingImg, maat, aanzicht === 'achter', crop);

  // 4. Armen, nek en hoofd er weer overheen
  const voorgrondSvg = getFullBodySvg(avatarType, maat, { aanzicht, laag: 'voorgrond', uid: `f${uid}` });
  const voorgrondImg = await loadSvgAsImage(voorgrondSvg);
  ctx.drawImage(voorgrondImg, offX, offY, m.W * s, m.H * s);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Voorkant-compositie (compatibel met bestaande aanroepen).
 */
/**
 * Vervang het gezicht van het echte kind door het hoofd van Noah/Emma.
 * De rest van de foto (kleding, houding, licht) blijft volledig intact.
 */
async function vervangGezichtOverlay(
  img: HTMLImageElement,
  gezicht: GezichtBox,
  avatarType: 'noah' | 'emma',
  maat: string,
): Promise<string> {
  // Fotogrootte begrenzen voor performance
  const MAX = 1100;
  const fotoSchaal = Math.min(1, MAX / Math.max(img.width, img.height));
  const cw = Math.round(img.width * fotoSchaal);
  const ch = Math.round(img.height * fotoSchaal);

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, cw, ch);

  // Avatar op hoge resolutie rasteren zodat het hoofd scherp blijft
  const RES = 4;
  const m = berekenLichaam(maat);
  const svg = getFullBodySvg(avatarType, maat, { aanzicht: 'voor', laag: 'alles', uid: 'kop' })
    .replace(`width="${m.W}" height="${m.H}"`, `width="${m.W * RES}" height="${m.H * RES}"`);
  const svgImg = await loadSvgAsImage(svg);

  // Hoofdregio binnen de avatar (incl. haar, oren, staartjes/strikjes)
  const kopLinks = (m.cx - m.hoofdRx * 1.55) * RES;
  const kopTop = (m.hoofdCy - m.hoofdRy * 1.45) * RES;
  const kopBreed = (m.hoofdRx * 3.1) * RES;
  const kopHoog = (m.hoofdRy * 2.62) * RES;

  // Plaatsing over het echte gezicht: royaal, zodat haar/oren van het
  // echte kind volledig bedekt zijn. Kin uitlijnen met de kin op de foto.
  const f = {
    x: gezicht.x * fotoSchaal,
    y: gezicht.y * fotoSchaal,
    width: gezicht.width * fotoSchaal,
    height: gezicht.height * fotoSchaal,
  };
  const destW = f.width * 2.05;
  const destH = destW * (kopHoog / kopBreed);
  const destX = f.x + f.width / 2 - destW / 2;
  const destBodem = f.y + f.height * 1.12;
  const destY = destBodem - destH;

  // Zachte schaduw achter het hoofd voor natuurlijke overgang
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = f.width * 0.12;
  ctx.drawImage(svgImg, kopLinks, kopTop, kopBreed, kopHoog, destX, destY, destW, destH);
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.92);
}

export async function compositeClothingOnAvatar(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
  maat: string = '86',
): Promise<{ result: string }> {
  const img = await loadImage(clothingDataUrl);
  const gezicht = await detecteerGezicht(img);
  if (gezicht) {
    const result = await vervangGezichtOverlay(img, gezicht, avatarType, maat);
    return { result };
  }
  const result = await maakCompositie(clothingDataUrl, avatarType, maat, 'voor', null);
  return { result };
}

/**
 * Genereer voor- én achterkant.
 *
 * - Foto van een kind dat de kleding draagt → gezicht wordt vervangen door
 *   het hoofd van Noah/Emma (foto blijft intact); achterkant = kledingstuk
 *   op het avatar-lijfje.
 * - Productfoto zonder gezicht → kledingstuk op het avatar-lijfje, beide kanten.
 */
export async function compositeAllAngles(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
  maat: string = '86',
): Promise<{ front: string; back: string; kledingGedetecteerd: boolean }> {
  const img = await loadImage(clothingDataUrl);
  const gezicht = await detecteerGezicht(img);

  if (gezicht) {
    const crop = kledingCropUitGezicht(gezicht, img.width, img.height);
    const [front, back] = await Promise.all([
      vervangGezichtOverlay(img, gezicht, avatarType, maat),
      maakCompositie(clothingDataUrl, avatarType, maat, 'achter', crop),
    ]);
    return { front, back, kledingGedetecteerd: true };
  }

  const [front, back] = await Promise.all([
    maakCompositie(clothingDataUrl, avatarType, maat, 'voor', null),
    maakCompositie(clothingDataUrl, avatarType, maat, 'achter', null),
  ]);
  return { front, back, kledingGedetecteerd: false };
}

/**
 * Zet een dataUrl om naar een File object.
 */
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}
