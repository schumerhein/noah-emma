'use client';

/**
 * Noah & Emma — meegroeiende full-body avatars (SVG-string, één bron).
 *
 * Ontwerpprincipes voor "schattig":
 * - Groot voorhoofd, gezichtselementen laag in het gezicht
 * - Grote ogen met dubbele lichtpuntjes
 * - Zachte rondingen, geen scherpe hoeken, mollige handjes
 * - Warme kleuren, subtiele gradients
 *
 * De verhoudingen groeien mee met de kledingmaat (50 → 158/164).
 */

export const MAATLIJST_AVATAR = ["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"];

export function leeftijdBijMaat(maat: string): string {
  const labels: Record<string, string> = {
    "50": "0-1 mnd", "56": "1-2 mnd", "62": "2-4 mnd", "68": "4-6 mnd",
    "74": "6-9 mnd", "80": "9-12 mnd", "86": "1-1,5 jaar", "92": "1,5-2 jaar",
    "98": "2-3 jaar", "104": "3-4 jaar", "110": "4-5 jaar", "116": "5-6 jaar",
    "122": "6-7 jaar", "128": "7-8 jaar", "134": "8-9 jaar", "140": "9-10 jaar",
    "146": "10-11 jaar", "152": "11-12 jaar", "158/164": "12+ jaar",
  };
  return labels[maat] || "";
}

function groeiFactor(maat: string): number {
  const idx = MAATLIJST_AVATAR.indexOf(maat);
  if (idx < 0) return 0.4;
  return idx / (MAATLIJST_AVATAR.length - 1);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const r1 = (n: number) => Math.round(n * 10) / 10;

export interface LichaamMaten {
  W: number; H: number; cx: number; t: number;
  grondY: number; schoenH: number;
  beenL: number; torsoL: number; hoofdRx: number; hoofdRy: number;
  schouderB: number; heupB: number;
  armL: number; armDikte: number; beenDikte: number; nekH: number;
  heupY: number; schouderY: number; hoofdCy: number;
}

/** Alle maatafhankelijke verhoudingen van het lijfje */
export function berekenLichaam(maat: string): LichaamMaten {
  const t = groeiFactor(maat);
  const W = 300, H = 460, grondY = 444, schoenH = 16;
  const beenL = lerp(50, 148, t);
  const torsoL = lerp(78, 120, t);
  const hoofdRx = lerp(50, 44, t);
  const hoofdRy = lerp(47, 45, t);
  const schouderB = lerp(92, 112, t);
  const heupB = lerp(88, 84, t);
  const armL = lerp(50, 100, t);
  const armDikte = lerp(18, 13, t);
  const beenDikte = lerp(20, 14, t);
  const nekH = lerp(4, 10, t);
  const heupY = grondY - schoenH - beenL;
  const schouderY = heupY - torsoL;
  const hoofdCy = schouderY - nekH - hoofdRy + 6;
  return { W, H, cx: W / 2, t, grondY, schoenH, beenL, torsoL, hoofdRx, hoofdRy, schouderB, heupB, armL, armDikte, beenDikte, nekH, heupY, schouderY, hoofdCy };
}

interface SvgOpties {
  /** 'voor' toont het gezicht, 'achter' de achterkant (haar) */
  aanzicht?: 'voor' | 'achter';
  /** 'alles' = hele avatar; 'voorgrond' = alleen armen+hoofd+nek (voor over kleding heen) */
  laag?: 'alles' | 'voorgrond';
  uid?: string;
}

export function getFullBodySvg(naam: 'noah' | 'emma', maat: string, opties: SvgOpties = {}): string {
  const { aanzicht = 'voor', laag = 'alles', uid = 'c' } = opties;
  const m = berekenLichaam(maat);
  const isNoah = naam === 'noah';
  const { W, H, cx, t, grondY, schoenH, hoofdRx, hoofdRy, schouderB, heupB, armL, armDikte, beenDikte, nekH, heupY, schouderY, hoofdCy, beenL } = m;

  // ---- Kleurenpalet ----
  const huidLicht = isNoah ? '#EFB07C' : '#FFEBD6';
  const huid = isNoah ? '#DE9A62' : '#FCDFBC';
  const huidDonker = isNoah ? '#C58350' : '#F2C89E';
  const haar = isNoah ? '#2A1808' : '#B07B42';
  const haarLicht = isNoah ? '#45280E' : '#CE9A5C';
  const blos = isNoah ? '#D97C50' : '#FFAFA0';
  const shirt = '#FFFFFF';
  const shirtSchaduw = '#E9EDF3';
  const accent = isNoah ? '#7FB5E8' : '#FFB8C4';
  const accentDonker = isNoah ? '#5B94CF' : '#F793AB';
  const oogKleur = isNoah ? '#5A3416' : '#4A88C0';

  const beenOffset = heupB / 4 + 2;
  // Armen duidelijk náást het lijfje
  const armStartX = schouderB / 2 + 1;
  const armRot = lerp(20, 11, t);

  // Gezicht laag geplaatst = schattig
  const oogY = hoofdCy + hoofdRy * 0.16;
  const oogDX = hoofdRx * 0.42;
  const oogR = lerp(9.5, 8.4, t);
  const mondY = hoofdCy + hoofdRy * 0.55;

  const defs = `<defs>
    <radialGradient id="huid-${uid}" cx="40%" cy="32%" r="72%">
      <stop offset="0%" stop-color="${huidLicht}"/>
      <stop offset="100%" stop-color="${huid}"/>
    </radialGradient>
    <linearGradient id="shirt-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${shirt}"/>
      <stop offset="100%" stop-color="${shirtSchaduw}"/>
    </linearGradient>
    <linearGradient id="accent-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accentDonker}"/>
    </linearGradient>
    <radialGradient id="haar-${uid}" cx="50%" cy="28%" r="78%">
      <stop offset="0%" stop-color="${haarLicht}"/>
      <stop offset="100%" stop-color="${haar}"/>
    </radialGradient>
  </defs>`;

  // ============ ONDERLIJF (alleen laag 'alles') ============
  let onderlijf = '';
  if (laag === 'alles') {
    for (const kant of [-1, 1]) {
      const bx = cx + kant * beenOffset;
      // Beentje (zachte capsule)
      onderlijf += `<rect x="${r1(bx - beenDikte / 2)}" y="${r1(heupY + 2)}" width="${r1(beenDikte)}" height="${r1(beenL + 4)}" rx="${r1(beenDikte / 2)}" fill="${huid}"/>`;
      // Sneaker: wit met gekleurde neus en dikke zool
      const sw = beenDikte + 16;
      const sx = bx - sw / 2 + kant * 2;
      const sy = grondY - schoenH;
      onderlijf += `<g>
        <path d="M ${r1(sx)} ${r1(grondY - 4)} L ${r1(sx)} ${r1(sy + 5)} Q ${r1(sx)} ${r1(sy)} ${r1(sx + 6)} ${r1(sy)} L ${r1(sx + sw - 8)} ${r1(sy)} Q ${r1(sx + sw)} ${r1(sy)} ${r1(sx + sw)} ${r1(sy + 8)} L ${r1(sx + sw)} ${r1(grondY - 4)} Z" fill="#FBFCFE"/>
        <path d="M ${r1(sx + sw * 0.55)} ${r1(sy + 1)} Q ${r1(sx + sw)} ${r1(sy + 2)} ${r1(sx + sw)} ${r1(sy + 9)} L ${r1(sx + sw)} ${r1(grondY - 4)} L ${r1(sx + sw * 0.6)} ${r1(grondY - 4)} Q ${r1(sx + sw * 0.52)} ${r1(sy + 6)} ${r1(sx + sw * 0.55)} ${r1(sy + 1)} Z" fill="url(#accent-${uid})" opacity="0.85"/>
        <path d="M ${r1(sx + 4)} ${r1(sy + 6)} q ${r1(sw * 0.22)} 4 ${r1(sw * 0.44)} 0" stroke="#D5DBE3" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <rect x="${r1(sx - 1)}" y="${r1(grondY - 5)}" width="${r1(sw + 2)}" height="6" rx="3" fill="#E2E7ED"/>
      </g>`;
    }
    if (isNoah) {
      // Kort broekje met omslag
      const bh = lerp(24, 36, t);
      onderlijf += `<path d="M ${r1(cx - heupB / 2 + 5)} ${r1(heupY - 10)} L ${r1(cx + heupB / 2 - 5)} ${r1(heupY - 10)} Q ${r1(cx + heupB / 2 - 1)} ${r1(heupY + bh * 0.6)} ${r1(cx + heupB / 2 - 4)} ${r1(heupY + bh)} L ${r1(cx + 4)} ${r1(heupY + bh)} L ${r1(cx)} ${r1(heupY + 14)} L ${r1(cx - 4)} ${r1(heupY + bh)} L ${r1(cx - heupB / 2 + 4)} ${r1(heupY + bh)} Q ${r1(cx - heupB / 2 + 1)} ${r1(heupY + bh * 0.6)} ${r1(cx - heupB / 2 + 5)} ${r1(heupY - 10)} Z" fill="url(#accent-${uid})"/>
      <rect x="${r1(cx - heupB / 2 + 4)}" y="${r1(heupY + bh - 5)}" width="${r1(heupB / 2 - 8)}" height="5" rx="2.5" fill="${accentDonker}"/>
      <rect x="${r1(cx + 4)}" y="${r1(heupY + bh - 5)}" width="${r1(heupB / 2 - 8)}" height="5" rx="2.5" fill="${accentDonker}"/>`;
    } else {
      // Rokje met schulprandje
      const rh = lerp(26, 36, t);
      const rb = heupB / 2 + 8;
      onderlijf += `<path d="M ${r1(cx - heupB / 2 + 7)} ${r1(heupY - 12)} L ${r1(cx + heupB / 2 - 7)} ${r1(heupY - 12)} L ${r1(cx + rb)} ${r1(heupY + rh)} Q ${r1(cx + rb * 0.62)} ${r1(heupY + rh + 8)} ${r1(cx + rb * 0.33)} ${r1(heupY + rh)} Q ${r1(cx)} ${r1(heupY + rh + 8)} ${r1(cx - rb * 0.33)} ${r1(heupY + rh)} Q ${r1(cx - rb * 0.62)} ${r1(heupY + rh + 8)} ${r1(cx - rb)} ${r1(heupY + rh)} Z" fill="url(#accent-${uid})"/>`;
    }
  }

  // ============ ARMEN + HANDJES ============
  let armen = '';
  for (const kant of [-1, 1]) {
    const px = cx + kant * armStartX;
    armen += `<g transform="rotate(${r1(kant * armRot)} ${r1(px)} ${r1(schouderY + 8)})">
      <rect x="${r1(px - armDikte / 2)}" y="${r1(schouderY + 6)}" width="${r1(armDikte)}" height="${r1(armL)}" rx="${r1(armDikte / 2)}" fill="${huid}"/>
      <circle cx="${r1(px)}" cy="${r1(schouderY + 6 + armL)}" r="${r1(armDikte * 0.62)}" fill="${huidLicht}"/>
      <rect x="${r1(px - armDikte / 2 - 2.5)}" y="${r1(schouderY + 4)}" width="${r1(armDikte + 5)}" height="${r1(lerp(22, 28, t))}" rx="${r1((armDikte + 5) / 2)}" fill="url(#shirt-${uid})" stroke="#E2E8F0" stroke-width="0.8"/>
    </g>`;
  }

  // ============ ROMP (shirt met buikje) ============
  const buik = lerp(7, 0, t);
  const romp = laag === 'alles' ? `<path d="M ${r1(cx - schouderB / 2)} ${r1(schouderY + 12)}
      Q ${r1(cx - schouderB / 2)} ${r1(schouderY)} ${r1(cx - schouderB / 2 + 14)} ${r1(schouderY - 2)}
      L ${r1(cx + schouderB / 2 - 14)} ${r1(schouderY - 2)}
      Q ${r1(cx + schouderB / 2)} ${r1(schouderY)} ${r1(cx + schouderB / 2)} ${r1(schouderY + 12)}
      Q ${r1(cx + heupB / 2 + buik)} ${r1((schouderY + heupY) / 2 + 10)} ${r1(cx + heupB / 2 - 3)} ${r1(heupY + 4)}
      Q ${r1(cx)} ${r1(heupY + lerp(14, 9, t))} ${r1(cx - heupB / 2 + 3)} ${r1(heupY + 4)}
      Q ${r1(cx - heupB / 2 - buik)} ${r1((schouderY + heupY) / 2 + 10)} ${r1(cx - schouderB / 2)} ${r1(schouderY + 12)} Z"
      fill="url(#shirt-${uid})" stroke="#E2E8F0" stroke-width="1"/>
    ${aanzicht === 'voor' ? `<path d="M ${r1(cx - 15)} ${r1(schouderY - 1)} Q ${r1(cx)} ${r1(schouderY + 9)} ${r1(cx + 15)} ${r1(schouderY - 1)}" fill="none" stroke="#DFE5EC" stroke-width="2.5" stroke-linecap="round"/>` : ''}` : '';

  // ============ NEK ============
  const nek = `<path d="M ${r1(cx - 10)} ${r1(schouderY - nekH - 8)} L ${r1(cx + 10)} ${r1(schouderY - nekH - 8)} L ${r1(cx + 9)} ${r1(schouderY + 2)} Q ${r1(cx)} ${r1(schouderY + 6)} ${r1(cx - 9)} ${r1(schouderY + 2)} Z" fill="${huidDonker}"/>`;

  // ============ HOOFD ============
  let hoofd = '';

  // Emma: haardos achter + staartjes (beide aanzichten)
  if (!isNoah) {
    hoofd += `<ellipse cx="${r1(cx)}" cy="${r1(hoofdCy + hoofdRy * 0.18)}" rx="${r1(hoofdRx * 1.1)}" ry="${r1(hoofdRy * 1.08)}" fill="url(#haar-${uid})"/>`;
    for (const kant of [-1, 1]) {
      const sx = cx + kant * hoofdRx * 1.16;
      const sy = hoofdCy + hoofdRy * 0.28;
      hoofd += `
      <ellipse cx="${r1(sx)}" cy="${r1(sy)}" rx="${r1(lerp(12, 15, t))}" ry="${r1(lerp(17, 27, t))}" fill="url(#haar-${uid})"/>
      <ellipse cx="${r1(sx + kant * 3)}" cy="${r1(sy + lerp(10, 18, t))}" rx="${r1(lerp(9, 11, t))}" ry="${r1(lerp(12, 18, t))}" fill="${haar}"/>
      <path d="M ${r1(sx - 4)} ${r1(sy - lerp(12, 20, t))} q ${r1(kant * 6)} ${r1(lerp(14, 24, t))} ${r1(kant * 2)} ${r1(lerp(26, 44, t))}" stroke="${haarLicht}" stroke-width="1.6" fill="none" opacity="0.7" stroke-linecap="round"/>
      <g transform="translate(${r1(cx + kant * hoofdRx * 1.02)}, ${r1(hoofdCy - hoofdRy * 0.12)})">
        <path d="M0 0 C-8 -7 -14 2 -6 6 C-9 10 -2 14 1 7 Z" fill="#FF7A96"/>
        <path d="M0 0 C8 -7 14 2 6 6 C9 10 2 14 -1 7 Z" fill="#FF7A96"/>
        <path d="M-6 6 C-10 3 -11 -2 -7 -4" stroke="#E85C7C" stroke-width="1.2" fill="none" opacity="0.7"/>
        <path d="M6 6 C10 3 11 -2 7 -4" stroke="#E85C7C" stroke-width="1.2" fill="none" opacity="0.7"/>
        <circle cx="0" cy="3.5" r="3.6" fill="#FF4070"/>
      </g>`;
    }
  }

  if (aanzicht === 'achter') {
    hoofd += `<ellipse cx="${r1(cx)}" cy="${r1(hoofdCy)}" rx="${r1(hoofdRx)}" ry="${r1(hoofdRy)}" fill="url(#huid-${uid})"/>
      <ellipse cx="${r1(cx)}" cy="${r1(hoofdCy - hoofdRy * 0.03)}" rx="${r1(hoofdRx * 1.02)}" ry="${r1(hoofdRy * 1.04)}" fill="url(#haar-${uid})"/>`;
    if (isNoah) {
      // Krultextuur op de achterkant
      for (const [fx, fy, fr] of [[-0.5, -0.6, 0.16], [0.1, -0.85, 0.14], [0.55, -0.5, 0.15], [-0.15, -0.25, 0.17], [0.35, -0.05, 0.14], [-0.55, 0.05, 0.13]]) {
        hoofd += `<circle cx="${r1(cx + hoofdRx * fx)}" cy="${r1(hoofdCy + hoofdRy * fy)}" r="${r1(hoofdRx * fr)}" fill="${haarLicht}" opacity="0.45"/>`;
      }
    } else {
      hoofd += `<path d="M ${r1(cx)} ${r1(hoofdCy - hoofdRy)} L ${r1(cx)} ${r1(hoofdCy + hoofdRy * 0.7)}" stroke="${haar}" stroke-width="1.5" opacity="0.6"/>`;
    }
  } else {
    // ---- Gezicht ----
    hoofd += `<ellipse cx="${r1(cx)}" cy="${r1(hoofdCy)}" rx="${r1(hoofdRx)}" ry="${r1(hoofdRy)}" fill="url(#huid-${uid})"/>`;

    // Oortjes
    for (const kant of [-1, 1]) {
      hoofd += `<ellipse cx="${r1(cx + kant * hoofdRx * 0.99)}" cy="${r1(hoofdCy + hoofdRy * 0.12)}" rx="7.5" ry="10" fill="${huid}"/>
      <ellipse cx="${r1(cx + kant * hoofdRx * 0.94)}" cy="${r1(hoofdCy + hoofdRy * 0.12)}" rx="4" ry="6" fill="${huidDonker}" opacity="0.5"/>`;
    }

    // ---- Haar voorkant ----
    if (isNoah) {
      // Zachte krullenbol: basis + schuimige krullen langs de rand
      hoofd += `<path d="M ${r1(cx - hoofdRx * 0.99)} ${r1(hoofdCy - hoofdRy * 0.02)}
        C ${r1(cx - hoofdRx * 1.08)} ${r1(hoofdCy - hoofdRy * 0.95)} ${r1(cx - hoofdRx * 0.45)} ${r1(hoofdCy - hoofdRy * 1.28)} ${r1(cx)} ${r1(hoofdCy - hoofdRy * 1.24)}
        C ${r1(cx + hoofdRx * 0.45)} ${r1(hoofdCy - hoofdRy * 1.28)} ${r1(cx + hoofdRx * 1.08)} ${r1(hoofdCy - hoofdRy * 0.95)} ${r1(cx + hoofdRx * 0.99)} ${r1(hoofdCy - hoofdRy * 0.02)}
        C ${r1(cx + hoofdRx * 0.92)} ${r1(hoofdCy - hoofdRy * 0.42)} ${r1(cx + hoofdRx * 0.55)} ${r1(hoofdCy - hoofdRy * 0.58)} ${r1(cx)} ${r1(hoofdCy - hoofdRy * 0.56)}
        C ${r1(cx - hoofdRx * 0.55)} ${r1(hoofdCy - hoofdRy * 0.58)} ${r1(cx - hoofdRx * 0.92)} ${r1(hoofdCy - hoofdRy * 0.42)} ${r1(cx - hoofdRx * 0.99)} ${r1(hoofdCy - hoofdRy * 0.02)} Z"
        fill="url(#haar-${uid})"/>`;
      // Krulletjes langs de haarlijn
      for (const [fx, fy, fr] of [[-0.82, -0.55, 0.2], [-0.45, -0.88, 0.21], [0, -1.0, 0.22], [0.45, -0.88, 0.21], [0.82, -0.55, 0.2]]) {
        hoofd += `<circle cx="${r1(cx + hoofdRx * fx)}" cy="${r1(hoofdCy + hoofdRy * fy)}" r="${r1(hoofdRx * fr)}" fill="url(#haar-${uid})"/>`;
      }
      for (const [fx, fy, fr] of [[-0.6, -0.75, 0.1], [-0.2, -0.95, 0.09], [0.25, -0.92, 0.1], [0.65, -0.68, 0.09]]) {
        hoofd += `<circle cx="${r1(cx + hoofdRx * fx)}" cy="${r1(hoofdCy + hoofdRy * fy)}" r="${r1(hoofdRx * fr)}" fill="${haarLicht}" opacity="0.6"/>`;
      }
    } else {
      // Emma: zachte pony met middenscheiding en zijlokken
      hoofd += `<path d="M ${r1(cx - hoofdRx * 1.0)} ${r1(hoofdCy + hoofdRy * 0.16)}
        C ${r1(cx - hoofdRx * 1.06)} ${r1(hoofdCy - hoofdRy * 0.9)} ${r1(cx - hoofdRx * 0.4)} ${r1(hoofdCy - hoofdRy * 1.22)} ${r1(cx)} ${r1(hoofdCy - hoofdRy * 1.18)}
        C ${r1(cx + hoofdRx * 0.4)} ${r1(hoofdCy - hoofdRy * 1.22)} ${r1(cx + hoofdRx * 1.06)} ${r1(hoofdCy - hoofdRy * 0.9)} ${r1(cx + hoofdRx * 1.0)} ${r1(hoofdCy + hoofdRy * 0.16)}
        C ${r1(cx + hoofdRx * 0.95)} ${r1(hoofdCy - hoofdRy * 0.25)} ${r1(cx + hoofdRx * 0.72)} ${r1(hoofdCy - hoofdRy * 0.55)} ${r1(cx + hoofdRx * 0.4)} ${r1(hoofdCy - hoofdRy * 0.62)}
        Q ${r1(cx + hoofdRx * 0.12)} ${r1(hoofdCy - hoofdRy * 0.68)} ${r1(cx + hoofdRx * 0.04)} ${r1(hoofdCy - hoofdRy * 0.88)}
        Q ${r1(cx - hoofdRx * 0.04)} ${r1(hoofdCy - hoofdRy * 0.68)} ${r1(cx - hoofdRx * 0.3)} ${r1(hoofdCy - hoofdRy * 0.64)}
        C ${r1(cx - hoofdRx * 0.66)} ${r1(hoofdCy - hoofdRy * 0.58)} ${r1(cx - hoofdRx * 0.94)} ${r1(hoofdCy - hoofdRy * 0.28)} ${r1(cx - hoofdRx * 1.0)} ${r1(hoofdCy + hoofdRy * 0.16)} Z"
        fill="url(#haar-${uid})"/>
      <path d="M ${r1(cx + hoofdRx * 0.02)} ${r1(hoofdCy - hoofdRy * 1.1)} Q ${r1(cx + hoofdRx * 0.05)} ${r1(hoofdCy - hoofdRy * 0.9)} ${r1(cx + hoofdRx * 0.03)} ${r1(hoofdCy - hoofdRy * 0.86)}" stroke="${haarLicht}" stroke-width="1.4" fill="none" opacity="0.8"/>`;
    }

    // ---- Wenkbrauwen (zacht, hoog = onschuldig) ----
    hoofd += `<path d="M ${r1(cx - oogDX - 8)} ${r1(oogY - oogR - 7)} q 8 -4.5 15.5 -1" stroke="${haar}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.85"/>
      <path d="M ${r1(cx + oogDX - 7.5)} ${r1(oogY - oogR - 8)} q 8 -3.5 15.5 1" stroke="${haar}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.85"/>`;

    // ---- Grote glanzende ogen ----
    for (const kant of [-1, 1]) {
      const ox = cx + kant * oogDX;
      hoofd += `<ellipse cx="${r1(ox)}" cy="${r1(oogY)}" rx="${r1(oogR)}" ry="${r1(oogR * 1.12)}" fill="#FFFFFF"/>
        <circle cx="${r1(ox)}" cy="${r1(oogY + 1.5)}" r="${r1(oogR * 0.62)}" fill="${oogKleur}"/>
        <circle cx="${r1(ox)}" cy="${r1(oogY + 1.5)}" r="${r1(oogR * 0.34)}" fill="#170B02"/>
        <circle cx="${r1(ox - oogR * 0.22)}" cy="${r1(oogY - oogR * 0.18)}" r="${r1(oogR * 0.21)}" fill="#FFFFFF"/>
        <circle cx="${r1(ox + oogR * 0.25)}" cy="${r1(oogY + oogR * 0.32)}" r="${r1(oogR * 0.1)}" fill="#FFFFFF" opacity="0.85"/>
        <path d="M ${r1(ox - oogR)} ${r1(oogY - oogR * 0.55)} Q ${r1(ox)} ${r1(oogY - oogR * 1.18)} ${r1(ox + oogR)} ${r1(oogY - oogR * 0.55)}" stroke="${huidDonker}" stroke-width="1.4" fill="none" opacity="0.35"/>`;
      // Emma: wimpertjes
      if (!isNoah) {
        hoofd += `<path d="M ${r1(ox + kant * oogR * 0.95)} ${r1(oogY - oogR * 0.5)} q ${r1(kant * 4)} -1.5 ${r1(kant * 5.5)} -3.5" stroke="#3A2410" stroke-width="1.6" fill="none" stroke-linecap="round"/>
          <path d="M ${r1(ox + kant * oogR * 0.75)} ${r1(oogY - oogR * 0.85)} q ${r1(kant * 3.5)} -2 ${r1(kant * 4.5)} -4.5" stroke="#3A2410" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
      }
    }

    // ---- Neusje ----
    hoofd += `<path d="M ${r1(cx - 2.5)} ${r1(oogY + oogR * 1.35)} q 2.5 3.5 5 0" stroke="${huidDonker}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>`;

    // ---- Vrolijke open lach (Emma: zachtroze lipjes) ----
    hoofd += `<path d="M ${r1(cx - 8.5)} ${r1(mondY)} Q ${r1(cx)} ${r1(mondY + lerp(11, 8.5, t))} ${r1(cx + 8.5)} ${r1(mondY)} Q ${r1(cx)} ${r1(mondY + 2.5)} ${r1(cx - 8.5)} ${r1(mondY)} Z" fill="${isNoah ? '#9C4433' : '#D65C74'}"/>
      <path d="M ${r1(cx - 4)} ${r1(mondY + lerp(6.5, 5, t))} Q ${r1(cx)} ${r1(mondY + lerp(9.5, 7.5, t))} ${r1(cx + 4)} ${r1(mondY + lerp(6.5, 5, t))}" fill="${isNoah ? '#E8837A' : '#F58CA0'}"/>`;
    // Emma: klein strikje in de pony
    if (!isNoah) {
      hoofd += `<g transform="translate(${r1(cx + hoofdRx * 0.42)}, ${r1(hoofdCy - hoofdRy * 0.92)}) scale(0.8)">
        <path d="M0 0 C-7 -6 -12 2 -5 5 C-8 8 -2 12 1 6 Z" fill="#FF7A96"/>
        <path d="M0 0 C7 -6 12 2 5 5 C8 8 2 12 -1 6 Z" fill="#FF7A96"/>
        <circle cx="0" cy="3" r="3" fill="#FF4070"/>
      </g>`;
    }

    // ---- Blosjes (Emma iets rozer) ----
    const blosOp = (isNoah ? 0.3 : 0.4) + lerp(0.15, 0, t);
    hoofd += `<ellipse cx="${r1(cx - hoofdRx * 0.6)}" cy="${r1(mondY - 7)}" rx="9" ry="5.5" fill="${blos}" opacity="${r1(blosOp)}"/>
      <ellipse cx="${r1(cx + hoofdRx * 0.6)}" cy="${r1(mondY - 7)}" rx="9" ry="5.5" fill="${blos}" opacity="${r1(blosOp)}"/>`;
  }

  const schaduw = laag === 'alles' ? `<ellipse cx="${r1(cx)}" cy="${r1(grondY + 5)}" rx="${r1(lerp(54, 68, t))}" ry="9" fill="#0F172A" opacity="0.08"/>` : '';

  // Armen NA de romp: zo blijven ze duidelijk zichtbaar naast het lijfje
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${defs}${schaduw}${onderlijf}${romp}${armen}${nek}${hoofd}</svg>`;
}
