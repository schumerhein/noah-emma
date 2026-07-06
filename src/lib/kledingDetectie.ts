'use client';

/**
 * Automatische kledingdetectie voor foto's waarop een kind de kleding draagt.
 *
 * Werking:
 * 1. Detecteer het gezicht met face-api.js (TinyFaceDetector, draait in de browser).
 * 2. De kledingzone ligt direct onder het gezicht: ~4,4x de gezichtsbreedte,
 *    van net onder de kin tot ± heuphoogte.
 * 3. Die uitsnede wordt op het lijfje van Noah/Emma geplaatst.
 *
 * Geen gezicht gevonden (bijv. platgelegde productfoto)? Dan geeft deze module
 * null terug en gebruikt de compositie de standaard middenband van de foto.
 *
 * Veiligheid: de uitsnede begint ónder de kin — het gezicht van het echte kind
 * komt dus nooit in de advertentie terecht.
 */

let modellenGeladen = false;
let modellenLadenPromise: Promise<void> | null = null;

const WEIGHTS_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';

async function laadModellen(): Promise<void> {
  if (modellenGeladen) return;
  if (!modellenLadenPromise) {
    modellenLadenPromise = (async () => {
      const faceapi = await import('face-api.js');
      await faceapi.nets.tinyFaceDetector.loadFromUri(WEIGHTS_URL);
      modellenGeladen = true;
    })();
  }
  return modellenLadenPromise;
}

export interface GezichtBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface KledingCrop {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  /** true = gezicht gedetecteerd, crop is de kledingzone onder het gezicht */
  viaGezicht: boolean;
}

/**
 * Detecteer het gezicht in een foto. Retourneert null als er geen gezicht is.
 */
export async function detecteerGezicht(img: HTMLImageElement): Promise<GezichtBox | null> {
  try {
    await laadModellen();
    const faceapi = await import('face-api.js');
    const detectie = await faceapi.detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 })
    );
    if (!detectie) return null;
    const f = detectie.box;
    return { x: f.x, y: f.y, width: f.width, height: f.height };
  } catch {
    return null;
  }
}

/**
 * Bereken de kledingzone onder een gedetecteerd gezicht.
 */
export function kledingCropUitGezicht(f: GezichtBox, imgW: number, imgH: number): KledingCrop | null {
  // Kledingzone onder het gezicht — strak om het kledingstuk
  const gewensteBreedte = f.width * 3.4;
  const sw = Math.min(imgW, gewensteBreedte);
  const sx = Math.max(0, Math.min(imgW - sw, f.x + f.width / 2 - sw / 2));
  const sy = Math.min(imgH - 20, f.y + f.height * 1.15);
  const sh = Math.min(imgH - sy, f.height * 2.9);

  // Te weinig ruimte onder het gezicht → onbruikbaar
  if (sh < f.height * 1.2) return null;

  return { sx, sy, sw, sh, viaGezicht: true };
}

/**
 * Bepaal de beste uitsnede van het kledingstuk in de foto.
 * Retourneert null als er geen gezicht gevonden is.
 */
export async function bepaalKledingCrop(img: HTMLImageElement): Promise<KledingCrop | null> {
  const f = await detecteerGezicht(img);
  if (!f) return null;
  return kledingCropUitGezicht(f, img.width, img.height);
}
