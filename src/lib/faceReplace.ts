'use client';

import { getNoahSvgString, getEmmaSvgString } from './avatarSvgStrings';

/**
 * Berekent de geschatte positie van het gezicht in een kinderfoto.
 * Werkt voor portret- én landscape-opnames.
 *
 * Aanname: de fotograaf richt op het gezicht van het kind.
 * - Horizontaal: gecentreerd (50%)
 * - Verticaal: bovenste derde van de foto (28%)
 * - Straal: 20% van de kortste kant
 */
function estimateFaceBox(
  imgW: number,
  imgH: number,
): { x: number; y: number; w: number; h: number } {
  const shortSide = Math.min(imgW, imgH);
  const radius = shortSide * 0.22;
  const cx = imgW * 0.5;
  // Bij portret (H > W): gezicht op ~28% van boven
  // Bij landscape/vierkant: gezicht op ~33% van boven
  const cyRatio = imgH > imgW ? 0.28 : 0.33;
  const cy = imgH * cyRatio;
  return { x: cx - radius, y: cy - radius, w: radius * 2, h: radius * 2 };
}

/**
 * Laad een SVG string als afbeelding via Blob URL.
 */
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
 * Laad een dataUrl als HTMLImageElement.
 */
function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Teken een Noah/Emma gezicht over een gezichtsgebied op canvas.
 * Cirkelvormig, met zachte schaduwrand aan de buitenkant.
 */
async function drawAvatarOnFace(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  avatarType: 'noah' | 'emma',
) {
  // Vergroot het gebied lichtjes voor betere dekking (haar, oren vallen buiten gezicht)
  const padding = box.w * 0.38;
  const x = box.x - padding;
  const y = box.y - padding * 0.75;
  const size = box.w + padding * 2;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2;

  const uid = Math.random().toString(36).slice(2);
  const svgString = avatarType === 'noah'
    ? getNoahSvgString(Math.round(size), uid)
    : getEmmaSvgString(Math.round(size), uid);

  const avatarImg = await loadSvgAsImage(svgString);

  // Clip naar cirkel en teken het avatar-gezicht
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(avatarImg, x, y, size, size);
  ctx.restore();

  // Zachte schaduw-rand: overgang tussen avatar en foto
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  const shadowGrad = ctx.createRadialGradient(cx, cy, radius * 0.80, cx, cy, radius);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = shadowGrad;
  ctx.fill();
  ctx.restore();
}

/**
 * Vervang het gezicht in een foto door de Noah of Emma illustratie.
 *
 * De functie gebruikt een heuristiek: het gezicht van een kind in een
 * kleding-productfoto bevindt zich typisch in het bovenste derde,
 * horizontaal gecentreerd.
 *
 * @param dataUrl - De originele foto als dataUrl
 * @param avatarType - 'noah' of 'emma'
 * @returns De verwerkte foto als dataUrl
 */
export async function replaceFacesWithAvatar(
  dataUrl: string,
  avatarType: 'noah' | 'emma',
): Promise<{ result: string; facesFound: number }> {
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const box = estimateFaceBox(canvas.width, canvas.height);
  await drawAvatarOnFace(ctx, box, avatarType);

  return {
    result: canvas.toDataURL('image/jpeg', 0.92),
    facesFound: 1,
  };
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
