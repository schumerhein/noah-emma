'use client';

import { getNoahHeadSvg, getEmmaHeadSvg, getNoahBackSvg, getEmmaBackSvg } from './avatarHeadSvg';

/**
 * Canvas-afmetingen voor de avatar+kleding compositie.
 * Portret formaat: 400×520px
 */
const CANVAS_W = 400;
const CANVAS_H = 520;

/** De avatar-hoofd SVG is 400×220 (viewBox), maar we renderen hem groter. */
const AVATAR_H = 260;

/**
 * Vanaf welk Y-punt begint de kleding-foto op het canvas.
 * Overlapping met avatar-schouders zorgt voor vloeiende overgang.
 */
const CLOTHING_START_Y = 205;

/**
 * Hoeveel van de bovenkant van de kledingfoto we overslaan.
 * Dit verbergt het gezicht/hoofd van het kind in de foto.
 * Gezichten zitten doorgaans in de bovenste 40% van portretfoto's.
 */
const PHOTO_SKIP_FRACTION = 0.42;

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
 * Teken de kledingfoto in het onderste deel van het canvas.
 * Slaat de bovenste PHOTO_SKIP_FRACTION van de foto over zodat
 * het gezicht van het kind niet zichtbaar is.
 */
function drawClothingPhoto(
  ctx: CanvasRenderingContext2D,
  clothingImg: HTMLImageElement,
  mirrored = false,
) {
  const clothingZoneH = CANVAS_H - CLOTHING_START_Y;

  // Sla de bovenste 42% van de foto over (waar het gezicht zit)
  const srcY = Math.floor(clothingImg.height * PHOTO_SKIP_FRACTION);
  const srcH = clothingImg.height - srcY;
  const srcW = clothingImg.width;

  // Schaal de gecropte sectie zodat deze de clothingZone vult
  const scaleX = CANVAS_W / srcW;
  const scaleY = clothingZoneH / srcH;
  const scale = Math.max(scaleX, scaleY);

  const destW = srcW * scale;
  const destH = srcH * scale;
  const destX = (CANVAS_W - destW) / 2;
  const destY = CLOTHING_START_Y; // plak boven aan de clothingZone

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, CLOTHING_START_Y, CANVAS_W, clothingZoneH);
  ctx.clip();

  if (mirrored) {
    ctx.translate(CANVAS_W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      clothingImg,
      0, srcY, srcW, srcH,
      CANVAS_W - destX - destW, destY, destW, destH,
    );
  } else {
    ctx.drawImage(
      clothingImg,
      0, srcY, srcW, srcH,
      destX, destY, destW, destH,
    );
  }

  ctx.restore();
}

/**
 * Maak een 3D-avatar compositie: het kledingstuk wordt getoond in het
 * onderste deel van het canvas, met de Noah of Emma avatar bovenin.
 *
 * @param clothingDataUrl - De originele kledingfoto als dataUrl
 * @param avatarType     - 'noah' of 'emma'
 * @returns De gecomponeerde afbeelding als dataUrl (400×520 JPEG)
 */
export async function compositeClothingOnAvatar(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
): Promise<{ result: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d')!;

  // 1. Achtergrond: lichte gradient
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bg.addColorStop(0, '#f0f4ff');
  bg.addColorStop(0.4, '#f5f8ff');
  bg.addColorStop(1, '#eef2fb');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 2. Kledingfoto in het onderste deel (gezicht overgeslagen)
  const clothingImg = await loadImage(clothingDataUrl);
  drawClothingPhoto(ctx, clothingImg, false);

  // 3. Gradient overgang boven kleding (naadloze blend met achtergrond)
  const fadeIn = ctx.createLinearGradient(0, CLOTHING_START_Y, 0, CLOTHING_START_Y + 80);
  fadeIn.addColorStop(0, 'rgba(245,248,255,1)');
  fadeIn.addColorStop(1, 'rgba(245,248,255,0)');
  ctx.fillStyle = fadeIn;
  ctx.fillRect(0, CLOTHING_START_Y, CANVAS_W, 80);

  // 4. Avatar hoofd+schouders bovenop (groter dan voorheen)
  const uid = Math.random().toString(36).slice(2);
  const avatarSvg = avatarType === 'noah'
    ? getNoahHeadSvg(CANVAS_W, AVATAR_H, uid)
    : getEmmaHeadSvg(CANVAS_W, AVATAR_H, uid);

  const avatarImg = await loadSvgAsImage(avatarSvg);
  ctx.drawImage(avatarImg, 0, 0, CANVAS_W, AVATAR_H);

  // 5. Subtiele schaduw onder avatar schouders → geeft diepte
  const shadowGrad = ctx.createLinearGradient(0, AVATAR_H - 10, 0, AVATAR_H + 35);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
  shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.07)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(30, AVATAR_H - 10, CANVAS_W - 60, 45);

  return { result: canvas.toDataURL('image/jpeg', 0.92) };
}

/**
 * Maak de achterkant-compositie:
 * - Kleding gespiegeld + licht donkerder (simulate rug-belichting)
 * - Achterkant avatar (haar, nek, schouders) bovenop
 */
async function compositeBackView(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d')!;

  // Achtergrond
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bg.addColorStop(0, '#eef2ff');
  bg.addColorStop(1, '#e8ecf8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Kleding: horizontaal gespiegeld + gezicht overgeslagen
  const clothingImg = await loadImage(clothingDataUrl);
  drawClothingPhoto(ctx, clothingImg, true);

  // Donkere overlay voor "rug-licht" gevoel
  const clothingZoneH = CANVAS_H - CLOTHING_START_Y;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, CLOTHING_START_Y, CANVAS_W, clothingZoneH);
  ctx.clip();
  ctx.fillStyle = 'rgba(20,30,60,0.18)';
  ctx.fillRect(0, CLOTHING_START_Y, CANVAS_W, clothingZoneH);
  ctx.restore();

  // Gradient overgang
  const fadeIn = ctx.createLinearGradient(0, CLOTHING_START_Y, 0, CLOTHING_START_Y + 80);
  fadeIn.addColorStop(0, 'rgba(238,242,255,1)');
  fadeIn.addColorStop(1, 'rgba(238,242,255,0)');
  ctx.fillStyle = fadeIn;
  ctx.fillRect(0, CLOTHING_START_Y, CANVAS_W, 80);

  // Avatar achterkant
  const uid = Math.random().toString(36).slice(2);
  const backSvg = avatarType === 'noah'
    ? getNoahBackSvg(CANVAS_W, AVATAR_H, uid)
    : getEmmaBackSvg(CANVAS_W, AVATAR_H, uid);

  const avatarImg = await loadSvgAsImage(backSvg);
  ctx.drawImage(avatarImg, 0, 0, CANVAS_W, AVATAR_H);

  // Schaduw
  const shadowGrad = ctx.createLinearGradient(0, AVATAR_H - 10, 0, AVATAR_H + 35);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
  shadowGrad.addColorStop(0.5, 'rgba(0,0,0,0.07)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(30, AVATAR_H - 10, CANVAS_W - 60, 45);

  return canvas.toDataURL('image/jpeg', 0.92);
}

/**
 * Genereer zowel de voorkant- als achterkant-compositie.
 * Retourneert beide als dataUrl strings.
 */
export async function compositeAllAngles(
  clothingDataUrl: string,
  avatarType: 'noah' | 'emma',
): Promise<{ front: string; back: string }> {
  const [front, back] = await Promise.all([
    compositeClothingOnAvatar(clothingDataUrl, avatarType).then(r => r.result),
    compositeBackView(clothingDataUrl, avatarType),
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
