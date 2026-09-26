'use client';

import { telGezichten } from './kledingDetectie';

/**
 * Privacycontrole vóór een foto geüpload mag worden.
 *
 * Het echte gezicht van een kind mag nooit in een advertentie komen. Deze
 * controle draait in de browser, vóór het uploaden, en weigert bij twijfel:
 * lukt de gezichtsdetectie niet, dan gaat de foto niet online.
 *
 * - Eigen foto (geen Noah/Emma): geen enkel gezicht toegestaan.
 * - Met Noah/Emma: hooguit één gezicht — dat wordt vervangen door het
 *   hoofd van de avatar. Bij meerdere gezichten zou er een onvervangen
 *   gezicht (bv. een broertje of zusje) zichtbaar blijven.
 *
 * Gezichtsdetectie is nooit 100% zeker; de moderatiewachtrij blijft de
 * tweede controle.
 */

export type FotoControle =
  | { ok: true; aantalGezichten: number }
  | { ok: false; reden: string };

function laadAfbeelding(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function controleerFoto(
  dataUrl: string,
  model: 'none' | 'noah' | 'emma',
): Promise<FotoControle> {
  let aantal: number;
  try {
    aantal = await telGezichten(await laadAfbeelding(dataUrl));
  } catch {
    return {
      ok: false,
      reden: "We konden deze foto niet controleren op gezichten. Check je internetverbinding en probeer het opnieuw.",
    };
  }

  if (model === 'none' && aantal > 0) {
    return {
      ok: false,
      reden: "Er staat een gezicht op deze foto. Om kinderen te beschermen plaatsen we geen foto's met gezichten. Maak een foto zonder gezicht in beeld, bijvoorbeeld platgelegd of op een hanger.",
    };
  }
  if (model !== 'none' && aantal > 1) {
    return {
      ok: false,
      reden: "Er staan meerdere gezichten op deze foto. Gebruik een foto met maar één kind, of een foto zonder gezicht.",
    };
  }
  return { ok: true, aantalGezichten: aantal };
}
