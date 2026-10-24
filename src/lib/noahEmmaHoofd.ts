/**
 * Het hoofd van Noah of Emma, in de stijl van het logo, dat meegroeit met de
 * kledingmaat: van baby (maat 50) tot kind van 12 (maat 158/164).
 *
 * Wat er verandert met de leeftijd (zoals illustratoren een kind laten groeien):
 * - Gezicht: baby rond en breed met bolle wangen, ouder kind langer en ovaler
 *   met een smallere kin.
 * - Ogen staan bij een baby laag in het gezicht en zijn groter; bij een ouder
 *   kind hoger en kleiner. Neus en mond groeien mee, de blosjes worden zachter.
 * - Haar in vier fases: baby (plukje/haarbandje), dreumes, peuter/kleuter
 *   (zoals het logo) en schoolkind (meer volume; Emma lang haar).
 * - De nek wordt langer en slanker.
 *
 * Het hoofd komt in twee lagen, zodat het kledingstuk ertussen kan:
 * - 'achter': nek en lang haar op de rug (achter het kledingstuk)
 * - 'voor': gezicht, oren, haar en strikjes (voor het kledingstuk)
 *
 * Maten in het SVG: het gezicht is 100 breed (x 0..100), de kin ligt op
 * (50, gezichtHoogte).
 */

export type ModelNaam = 'noah' | 'emma';

export interface HoofdTekening {
  achter: string;
  voor: string;
  /** viewBox van beide lagen */
  vak: { x: number; y: number; breedte: number; hoogte: number };
  kin: { x: number; y: number };
  /** Breedte van het gezicht (zonder oren en haar) in SVG-eenheden. */
  gezichtBreedte: number;
  /** Zichtbare buitenkant van het hoofd (haar, oren, strikjes) in SVG-eenheden. */
  omvang: { links: number; rechts: number; boven: number };
  /** Hoeveel nek er tussen kin en kraag hoort te zitten (kort bij een baby). */
  nekZichtbaar: number;
}

const MAAT_LEEFTIJD: Record<string, number> = {
  '50': 0, '56': 0.12, '62': 0.25, '68': 0.42, '74': 0.62, '80': 0.85,
  '86': 1.25, '92': 1.75, '98': 2.5, '104': 3.5, '110': 4.5, '116': 5.5,
  '122': 6.5, '128': 7.5, '134': 8.5, '140': 9.5, '146': 10.5, '152': 11.5,
  '158/164': 12.5,
};

/** Leeftijd in jaren die bij een kledingmaat hoort (maat ≈ lichaamslengte). */
export function leeftijdBijMaatJaren(maat: string): number {
  if (maat in MAAT_LEEFTIJD) return MAAT_LEEFTIJD[maat];
  const n = parseInt(maat, 10);
  if (!Number.isFinite(n)) return 3;
  // Tussenmaten (bv. "98/104"): dichtstbijzijnde maat
  const dichtst = Object.keys(MAAT_LEEFTIJD).reduce((a, b) =>
    Math.abs(parseInt(b, 10) - n) < Math.abs(parseInt(a, 10) - n) ? b : a);
  return MAAT_LEEFTIJD[dichtst];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const g = (n: number) => Math.round(n * 10) / 10;

const HUID = '#FDCC9B';
const HUID_SCHADUW = '#F4B882';
const HUID_DIEP = '#E9A877';

const NOAH_HAAR = '#2D2C2B';
const NOAH_HAAR_LICHT = '#4B4542';
const EMMA_HAAR = '#8C5438';
const EMMA_HAAR_DONKER = '#6E4029';
const EMMA_HAAR_LICHT = '#A96E4E';
const STRIK = '#FF7A96';
const STRIK_KNOOP = '#F24F79';

function strik(x: number, y: number, s: number, draai = 0) {
  return `<g transform="translate(${g(x)} ${g(y)}) rotate(${draai}) scale(${g(s)})">
    <path d="M0 0 C-6 -8 -15 -6 -14 1 C-13 8 -5 7 0 0 Z" fill="${STRIK}"/>
    <path d="M0 0 C6 -8 15 -6 14 1 C13 8 5 7 0 0 Z" fill="${STRIK}"/>
    <path d="M-1 1 L-5 10 L-2 9 Z M1 1 L5 10 L2 9 Z" fill="${STRIK_KNOOP}"/>
    <path d="M-10 -1 Q-7 -3 -4 -1" stroke="#FFFFFF" stroke-width="1.2" fill="none" opacity="0.5" stroke-linecap="round"/>
    <circle r="2.8" fill="${STRIK_KNOOP}"/>
  </g>`;
}

/**
 * Dun babyhaar: een zachte waas over de bovenkant die naar de rand vervaagt,
 * met een paar haartjes. Blijft binnen de vorm van het gezicht.
 */
function babyDons(kleur: string, H: number, gezicht: string) {
  return `<defs><clipPath id="schedel"><path d="${gezicht}"/></clipPath><radialGradient id="dons" cx="50%" cy="0%" r="75%">
      <stop offset="0" stop-color="${kleur}" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="${kleur}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${kleur}" stop-opacity="0"/>
    </radialGradient></defs>
    <path d="M 0 ${g(H * 0.38)} L 0 -2 L 100 -2 L 100 ${g(H * 0.38)} C 80 ${g(H * 0.18)} 20 ${g(H * 0.18)} 0 ${g(H * 0.38)} Z" fill="url(#dons)" clip-path="url(#schedel)"/>
    <path d="M 36 ${g(H * 0.06)} q 4 4 3 9 M 44 ${g(H * 0.04)} q 3 5 1 10 M 60 ${g(H * 0.05)} q -3 5 -1 9" stroke="${kleur}" stroke-width="1.3" fill="none" opacity="0.45" stroke-linecap="round"/>`;
}

/**
 * @param opties.nekLengte hoe ver de nek onder de kin doorloopt (achter het
 *   kledingstuk, zodat een halsopening mooi gevuld is).
 */
export function tekenHoofd(naam: ModelNaam, maat: string, opties: { nekLengte?: number } = {}): HoofdTekening {
  const jaren = leeftijdBijMaatJaren(maat);
  // "Rijpheid" 0..1: het gezicht verandert het snelst in de eerste jaren.
  const r = Math.pow(Math.min(1, jaren / 12), 0.6);
  const isNoah = naam === 'noah';
  const fase = jaren < 0.75 ? 0 : jaren < 2.25 ? 1 : jaren < 7 ? 2 : 3;

  const W = 100;
  const H = lerp(92, 112, r);
  const cx = W / 2;

  // ---------- Gezichtsvorm ----------
  const yBreed = H * lerp(0.6, 0.47, r);
  const kinHalf = (W / 2) * lerp(0.66, 0.4, r);
  const wangVol = lerp(0.66, 0.5, r);
  const gezicht = `M ${cx} 0
    C ${g(cx + W * 0.33)} 0 ${W} ${g(yBreed * 0.36)} ${W} ${g(yBreed)}
    C ${W} ${g(yBreed + (H - yBreed) * wangVol)} ${g(cx + kinHalf)} ${g(H)} ${cx} ${g(H)}
    C ${g(cx - kinHalf)} ${g(H)} 0 ${g(yBreed + (H - yBreed) * wangVol)} 0 ${g(yBreed)}
    C 0 ${g(yBreed * 0.36)} ${g(cx - W * 0.33)} 0 ${cx} 0 Z`;

  // ---------- Gezichtsdelen ----------
  const oogY = H * lerp(0.62, 0.53, r);
  const oogDX = lerp(25, 26.5, r);
  const oogRx = lerp(4.9, 3.7, r);
  const oogRy = lerp(5.9, 5.1, r);
  const neusY = oogY + lerp(10, 14, r);
  const mondY = neusY + lerp(8.5, 10.5, r);
  const oorY = H * lerp(0.62, 0.55, r);
  const oorR = lerp(9, 10.5, r);

  const haarKleur = isNoah ? NOAH_HAAR : EMMA_HAAR;

  let achter = '';
  let voor = '';

  // ---------- Nek + stukje borst (achter het kledingstuk) ----------
  const nekB = lerp(34, 27, r);
  const nekZichtbaar = lerp(6, 16, r);
  const nekL = opties.nekLengte ?? nekZichtbaar + 16;
  achter += `<defs><linearGradient id="nek" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${HUID_DIEP}"/>
      <stop offset="0.3" stop-color="${HUID_SCHADUW}"/>
      <stop offset="1" stop-color="${HUID}"/>
    </linearGradient></defs>
    <path d="M ${g(cx - nekB / 2)} ${g(H * 0.72)} L ${g(cx + nekB / 2)} ${g(H * 0.72)} L ${g(cx + nekB / 2)} ${g(H + nekZichtbaar * 0.6)}
      Q ${g(cx + nekB * 0.55)} ${g(H + nekZichtbaar + 6)} ${g(cx + nekB * 1.25)} ${g(H + nekL)}
      L ${g(cx - nekB * 1.25)} ${g(H + nekL)}
      Q ${g(cx - nekB * 0.55)} ${g(H + nekZichtbaar + 6)} ${g(cx - nekB / 2)} ${g(H + nekZichtbaar * 0.6)} Z" fill="url(#nek)"/>`;

  // ---------- Haar achter het hoofd ----------
  if (!isNoah && fase === 3) {
    // Lang haar: valt achter de schouders (en dus achter het kledingstuk)
    const lang = H * 1.42;
    achter += `<path d="M ${cx} -9
      C ${W + 14} -9 ${W + 17} ${g(H * 0.45)} ${W + 15} ${g(H * 0.8)}
      C ${W + 13} ${g(lang * 0.9)} ${W + 20} ${g(lang)} ${W + 6} ${g(lang)}
      L ${-6} ${g(lang)}
      C ${-20} ${g(lang)} ${-13} ${g(lang * 0.9)} ${-15} ${g(H * 0.8)}
      C ${-17} ${g(H * 0.45)} ${-14} -9 ${cx} -9 Z" fill="${EMMA_HAAR}"/>
      <path d="M ${W + 4} ${g(H * 0.9)} C ${W + 6} ${g(lang * 0.85)} ${W + 2} ${g(lang * 0.95)} ${W - 2} ${g(lang)}" stroke="${EMMA_HAAR_DONKER}" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>
      <path d="M -4 ${g(H * 0.9)} C -6 ${g(lang * 0.85)} -2 ${g(lang * 0.95)} 2 ${g(lang)}" stroke="${EMMA_HAAR_DONKER}" stroke-width="2" fill="none" opacity="0.6" stroke-linecap="round"/>`;
  }
  if (!isNoah && (fase === 1 || fase === 2)) {
    // Haardos net iets groter dan de schedel (zichtbaar langs de randen)
    voor += `<path d="M ${cx} -7 C ${W + 10} -7 ${W + 9} ${g(H * 0.42)} ${W + 4} ${g(H * 0.62)}
      L -4 ${g(H * 0.62)} C -9 ${g(H * 0.42)} -10 -7 ${cx} -7 Z" fill="${EMMA_HAAR_DONKER}"/>`;
  }

  // ---------- Staartjes (Emma, peuter/kleuter) ----------
  if (!isNoah && fase === 2) {
    for (const kant of [-1, 1]) {
      const sx = cx + kant * (W / 2 + 9);
      const sy = H * 0.34;
      voor += `<path d="M ${g(sx - kant * 6)} ${g(sy - 4)}
        C ${g(sx + kant * 22)} ${g(sy - 6)} ${g(sx + kant * 24)} ${g(sy + 30)} ${g(sx + kant * 10)} ${g(sy + 44)}
        C ${g(sx + kant * 8)} ${g(sy + 34)} ${g(sx + kant * 2)} ${g(sy + 22)} ${g(sx - kant * 6)} ${g(sy + 12)} Z" fill="${EMMA_HAAR}"/>
        <path d="M ${g(sx + kant * 6)} ${g(sy + 4)} C ${g(sx + kant * 15)} ${g(sy + 12)} ${g(sx + kant * 15)} ${g(sy + 26)} ${g(sx + kant * 10)} ${g(sy + 36)}" stroke="${EMMA_HAAR_LICHT}" stroke-width="1.8" fill="none" opacity="0.7" stroke-linecap="round"/>
        ${strik(sx - kant * 2, sy - 3, 0.95, kant * 18)}`;
    }
  }

  // ---------- Oren (bij lang haar zitten ze eronder) ----------
  for (const kant of isNoah || fase < 3 ? [-1, 1] : []) {
    const ox = cx + kant * (W / 2 - 1);
    voor += `<circle cx="${g(ox)}" cy="${g(oorY)}" r="${g(oorR)}" fill="${HUID}"/>
      <circle cx="${g(ox + kant * 1.2)}" cy="${g(oorY)}" r="${g(oorR * 0.58)}" fill="${HUID_SCHADUW}"/>`;
  }

  // ---------- Gezicht ----------
  voor += `<path d="${gezicht}" fill="${HUID}"/>`;

  // Blosjes
  const blos = lerp(0.42, 0.2, r);
  for (const kant of [-1, 1]) {
    voor += `<ellipse cx="${g(cx + kant * 31)}" cy="${g(oogY + lerp(11, 10, r))}" rx="${g(lerp(9.5, 7.5, r))}" ry="${g(lerp(5.8, 4.5, r))}" fill="#FF8E8E" opacity="${g(blos * 100) / 100}"/>`;
  }

  // Wenkbrauwen
  const wbY = oogY - lerp(12.5, 14.5, r);
  const wbDikte = lerp(1.7, 2.7, r);
  const wbOp = lerp(0.45, 0.95, r);
  for (const kant of [-1, 1]) {
    const x = cx + kant * oogDX;
    voor += `<path d="M ${g(x - kant * 7.5)} ${g(wbY + 1.8)} Q ${g(x)} ${g(wbY - 2.8)} ${g(x + kant * 7.5)} ${g(wbY + 0.6)}" stroke="${isNoah ? NOAH_HAAR : EMMA_HAAR_DONKER}" stroke-width="${g(wbDikte)}" fill="none" stroke-linecap="round" opacity="${g(wbOp * 100) / 100}"/>`;
  }

  // Ogen: rond en glanzend; Emma met wimpertjes
  for (const kant of [-1, 1]) {
    const x = cx + kant * oogDX;
    voor += `<ellipse cx="${g(x)}" cy="${g(oogY)}" rx="${g(oogRx)}" ry="${g(oogRy)}" fill="#352215"/>
      <circle cx="${g(x - oogRx * 0.32)}" cy="${g(oogY - oogRy * 0.38)}" r="${g(oogRx * 0.4)}" fill="#FFFFFF"/>
      <circle cx="${g(x + oogRx * 0.38)}" cy="${g(oogY + oogRy * 0.36)}" r="${g(oogRx * 0.17)}" fill="#FFFFFF" opacity="0.8"/>`;
    if (!isNoah) {
      const lx = x + kant * oogRx * 0.8;
      const ly = oogY - oogRy * 0.62;
      voor += `<path d="M ${g(lx)} ${g(ly)} q ${g(kant * 3)} -1.5 ${g(kant * 4.2)} -4" stroke="#352215" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <path d="M ${g(lx - kant * 1.8)} ${g(ly - 1.6)} q ${g(kant * 2)} -2 ${g(kant * 2.4)} -4.6" stroke="#352215" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    }
  }

  // Neusje
  voor += `<ellipse cx="${cx}" cy="${g(neusY)}" rx="${g(lerp(3.8, 5.4, r))}" ry="${g(lerp(2.6, 3.4, r))}" fill="${HUID_SCHADUW}"/>`;

  // Mond: baby's lachen met open mondje; Noah later de glimlach van het
  // logo, Emma de lach met tandjes.
  const mB = lerp(7.5, isNoah ? 12.5 : 13.5, r);
  if (fase <= 1 || !isNoah) {
    const diep = lerp(9, 8, r);
    voor += `<path d="M ${g(cx - mB)} ${g(mondY)} Q ${cx} ${g(mondY + diep * 1.25)} ${g(cx + mB)} ${g(mondY)} Q ${cx} ${g(mondY + 1.5)} ${g(cx - mB)} ${g(mondY)} Z" fill="#C2485E"/>
      <path d="M ${g(cx - mB * 0.5)} ${g(mondY + diep * 0.72)} Q ${cx} ${g(mondY + diep * 0.38)} ${g(cx + mB * 0.5)} ${g(mondY + diep * 0.72)} Q ${cx} ${g(mondY + diep * 1.02)} ${g(cx - mB * 0.5)} ${g(mondY + diep * 0.72)} Z" fill="#F48A97"/>`;
    if (!isNoah && fase >= 2) {
      voor += `<path d="M ${g(cx - mB * 0.82)} ${g(mondY + 0.6)} Q ${cx} ${g(mondY + 2.6)} ${g(cx + mB * 0.82)} ${g(mondY + 0.6)} L ${g(cx + mB * 0.7)} ${g(mondY + 2.6)} Q ${cx} ${g(mondY + 4.6)} ${g(cx - mB * 0.7)} ${g(mondY + 2.6)} Z" fill="#FFFFFF"/>`;
    }
  } else {
    voor += `<path d="M ${g(cx - mB)} ${g(mondY)} Q ${cx} ${g(mondY + 9)} ${g(cx + mB)} ${g(mondY)}" stroke="#E0806B" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }

  // ---------- Haar voorkant ----------
  if (isNoah) {
    if (fase === 0) {
      // Dun babyhaar met één krulletje
      voor += `${babyDons('#5E4334', H, gezicht)}
        <path d="M ${cx - 1} 2 C ${cx - 6} -9 ${cx + 9} -14 ${cx + 9} -5 C ${cx + 9} 1 ${cx + 1} 0 ${cx + 2} -5" stroke="${NOAH_HAAR}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    } else if (fase === 1) {
      // Kort zacht haar met een golvend pony'tje
      const p = H * 0.27;
      voor += `<path d="M -3 ${g(H * 0.46)} C -5 ${g(H * 0.05)} 20 -8 ${cx} -8 C 80 -8 105 ${g(H * 0.05)} 103 ${g(H * 0.46)}
        C 99 ${g(H * 0.34)} 95 ${g(p)} 86 ${g(p - 2)}
        Q 78 ${g(p + 6)} 70 ${g(p)} Q 61 ${g(p + 7)} 52 ${g(p + 1)} Q 42 ${g(p + 8)} 33 ${g(p + 1)} Q 23 ${g(p + 7)} 14 ${g(p - 1)}
        C 6 ${g(p)} 1 ${g(H * 0.34)} -3 ${g(H * 0.46)} Z" fill="${NOAH_HAAR}"/>
        <path d="M ${cx + 3} -6 C ${cx} -16 ${cx + 14} -18 ${cx + 13} -9" stroke="${NOAH_HAAR}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        <path d="M 30 ${g(H * 0.08)} Q 44 ${g(H * 0.02)} 58 ${g(H * 0.06)}" stroke="${NOAH_HAAR_LICHT}" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>`;
    } else {
      // Zoals het logo: kuif met zijscheiding; schoolkind met meer volume
      const vol = fase === 3 ? 1 : 0;
      const top = -7 - vol * 8;
      voor += `<path d="M -3 ${g(H * 0.5)}
        C -7 ${g(H * 0.12)} 14 ${g(top)} ${g(cx)} ${g(top)}
        C ${g(86 + vol * 4)} ${g(top - vol * 2)} 107 ${g(H * 0.12)} 103 ${g(H * 0.5)}
        C 96 ${g(H * 0.36)} 86 ${g(H * 0.24)} 80 ${g(H * 0.14)}
        C 74 ${g(H * 0.2)} 68 ${g(H * 0.23)} 62 ${g(H * 0.24)}
        L 58 ${g(H * 0.3)} L 54 ${g(H * 0.25)}
        C 46 ${g(H * 0.27)} 38 ${g(H * 0.27)} 30 ${g(H * 0.26)}
        L 25 ${g(H * 0.33)} L 22 ${g(H * 0.29)}
        C 14 ${g(H * 0.34)} 5 ${g(H * 0.41)} -3 ${g(H * 0.5)} Z" fill="${NOAH_HAAR}"/>
        <path d="M 34 ${g(H * 0.16)} C 48 ${g(H * 0.12)} 64 ${g(H * 0.1)} 76 ${g(H * 0.04)}" stroke="${NOAH_HAAR_LICHT}" stroke-width="2.2" fill="none" opacity="0.8" stroke-linecap="round"/>
        ${vol ? `<path d="M 40 ${g(top + 6)} C 54 ${g(top + 2)} 68 ${g(top + 4)} 80 ${g(top + 10)}" stroke="${NOAH_HAAR_LICHT}" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>` : ''}`;
    }
  } else {
    if (fase === 0) {
      // Plukje babyhaar met een haarbandje en strikje
      voor += `${babyDons(EMMA_HAAR, H, gezicht)}
        <path d="M ${cx - 1} 2 C ${cx - 6} -9 ${cx + 9} -14 ${cx + 9} -5 C ${cx + 9} 1 ${cx + 1} 0 ${cx + 2} -5" stroke="${EMMA_HAAR}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M 3 ${g(H * 0.36)} C 14 ${g(H * 0.06)} 86 ${g(H * 0.06)} 97 ${g(H * 0.36)}" stroke="${STRIK}" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${strik(78, H * 0.13, 1.05, 14)}`;
    } else if (fase === 1 || fase === 2) {
      // Pony met puntjes (zoals het logo)
      const p = H * (fase === 1 ? 0.3 : 0.33);
      voor += `<path d="M -3 ${g(H * 0.55)} C -7 ${g(H * 0.06)} 18 -9 ${cx} -9 C 82 -9 107 ${g(H * 0.06)} 103 ${g(H * 0.55)}
        C 99 ${g(H * 0.4)} 92 ${g(p + 2)} 82 ${g(p)}
        L 74 ${g(p + 4)} L 70 ${g(p - 10)} L 64 ${g(p + 3)} L 52 ${g(p + 1)} L 47 ${g(p - 12)} L 42 ${g(p + 3)} L 30 ${g(p + 2)} L 26 ${g(p - 8)} L 20 ${g(p + 4)}
        C 9 ${g(p + 6)} 1 ${g(H * 0.42)} -3 ${g(H * 0.55)} Z" fill="${EMMA_HAAR}"/>
        <path d="M 40 ${g(H * 0.07)} Q 54 ${g(H * 0.02)} 68 ${g(H * 0.07)}" stroke="${EMMA_HAAR_LICHT}" stroke-width="2.2" fill="none" opacity="0.8" stroke-linecap="round"/>`;
      if (fase === 1) {
        // Fonteintje bovenop met strikje
        voor += `<path d="M ${cx - 4} -6 C ${cx - 14} -20 ${cx - 4} -30 ${cx + 2} -26 C ${cx + 10} -30 ${cx + 16} -20 ${cx + 5} -6 Z" fill="${EMMA_HAAR}"/>
          ${strik(cx, -7, 0.9)}`;
      }
    } else {
      // Schoolkind: zijscheiding met lange lokken langs het gezicht
      voor += `<path d="M -6 ${g(H * 0.92)}
        C -12 ${g(H * 0.35)} 2 -11 ${g(cx - 4)} -11
        C 86 -11 112 ${g(H * 0.3)} 106 ${g(H * 0.92)}
        C 104 ${g(H * 0.6)} 99 ${g(H * 0.4)} 92 ${g(H * 0.3)}
        C 78 ${g(H * 0.24)} 54 ${g(H * 0.22)} 36 ${g(H * 0.1)}
        C 34 ${g(H * 0.24)} 22 ${g(H * 0.32)} 9 ${g(H * 0.36)}
        C 4 ${g(H * 0.5)} 1 ${g(H * 0.7)} -6 ${g(H * 0.92)} Z" fill="${EMMA_HAAR}"/>
        <path d="M 40 ${g(H * 0.02)} C 58 ${g(H * 0.04)} 76 ${g(H * 0.1)} 90 ${g(H * 0.22)}" stroke="${EMMA_HAAR_LICHT}" stroke-width="2.2" fill="none" opacity="0.8" stroke-linecap="round"/>
        <path d="M 99 ${g(H * 0.45)} C 102 ${g(H * 0.6)} 103 ${g(H * 0.75)} 102 ${g(H * 0.88)}" stroke="${EMMA_HAAR_DONKER}" stroke-width="1.8" fill="none" opacity="0.6" stroke-linecap="round"/>
        ${strik(16, H * 0.2, 0.85, -20)}`;
    }
  }

  const boven = isNoah ? [-15, -19, -8, -16][fase] : [-15, -31, -11, -12][fase];
  const opzij = !isNoah && fase === 2 ? 34 : !isNoah && fase === 3 ? 21 : 12;
  const omvang = { links: -opzij, rechts: W + opzij, boven };

  const vak = { x: -60, y: -45, breedte: 220, hoogte: H + 45 + Math.max(H * 0.45, nekL) + 10 };
  const svg = (inhoud: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vak.x} ${vak.y} ${vak.breedte} ${g(vak.hoogte)}" width="${vak.breedte * 4}" height="${g(vak.hoogte * 4)}">${inhoud}</svg>`;

  return {
    achter: svg(achter),
    voor: svg(voor),
    vak: { ...vak, hoogte: g(vak.hoogte) },
    kin: { x: cx, y: H },
    gezichtBreedte: W,
    omvang,
    nekZichtbaar,
  };
}
