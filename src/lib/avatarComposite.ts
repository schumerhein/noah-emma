'use client';

import { getFullBodySvg, berekenLichaam } from './avatarFullBodySvg';

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

/** Schaal + positie van de avatar op het canvas */
function avatarTransform(maat: string) {
  const m = berekenLichaam(maat);
  const s = (CANVAS_H - 26) / m.H;
  const offX = (CANVAS_W - m.W * s) / 2;
  const offY = 14;
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

/** Teken de kledingfoto passend in de shirtzone (cover, middenband van de foto) */
function tekenKledingInShirt(
  ctx: CanvasRenderingContext2D,
  clothingImg: HTMLImageElement,
  maat: string,
  gespiegeld: boolean,
) {
  const { m, s, offX, offY } = avatarTransform(maat);
  const zoneX = offX + (m.cx - m.schouderB / 2) * s;
  const zoneY = offY + m.schouderY * s;
  const zoneW = m.schouderB * s;
  const zoneH = (m.heupY - m.schouderY + 10) * s;

  const srcY = Math.floor(clothingImg.height * PHOTO_TOP_SKIP);
  const srcH = Math.floor(clothingImg.height * (1 - PHOTO_TOP_SKIP - PHOTO_BOTTOM_SKIP));
  const srcW = clothingImg.width;

  const schaal = Math.max(zoneW / srcW, zoneH / srcH);
  const destW = srcW * schaal;
  const destH = srcH * schaal;
  const destX = zoneX + (zoneW - destW) / 2;
  const destY = zoneY + (zoneH - destH) / 2;

  ctx.save();
  ctx.clip(shirtClipPath(maat));

  if (gespiegeld) {
    ctx.translate(CANVAS_W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(clothingImg, 0, srcY, srcW, srcH, CANVAS_W - destX - destW, destY, destW, destH);
  } else {
    ctx.drawImage(clothingImg, 0, srcY, srcW, srcH, destX, destY, destW, destH);
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
  tekenKledingInShirt(ctx, clothingImg, maat, aanzicht === 'achter');

  // 4. Armen, nek en hoofd er weer overheen
  const voorgrondSvg = getFullBodySvg(avatarType, maat, { aanzicht, laag: 'voorgrond', uid: `f${uid}` });
  const voorgrondImg = await loadSvgAsImage(voorgrondSvg);
  ctx.drawImage(voorgrondImg, offX, offY, m.W * s, m.H * s);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Voorkant-compositie (compatibel met bestaande aanroepen).
 */
export async function compositeClothingOnAvatar(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
  maat: string = '86',
): Promise<{ result: string }> {
  const result = await maakCompositie(clothingDataUrl, avatarType, maat, 'voor');
  return { result };
}

/**
 * Genereer voor- én achterkant.
 */
export async function compositeAllAngles(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
  maat: string = '86',
): Promise<{ front: string; back: string }> {
  const [front, back] = await Promise.all([
    maakCompositie(clothingDataUrl, avatarType, maat, 'voor'),
    maakCompositie(clothingDataUrl, avatarType, maat, 'achter'),
  ]);
  return { front, back };
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
