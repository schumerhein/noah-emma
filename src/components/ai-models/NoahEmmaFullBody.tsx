"use client";

/**
 * Noah & Emma — volledige, meegroeiende avatars (SVG)
 *
 * Eén parametrisch component: de verhoudingen veranderen met de maat.
 * Een baby (maat 50) is mollig met een relatief groot hoofd en korte beentjes;
 * een kind van 12 (maat 158/164) is lang met langere benen en smaller gezicht.
 *
 * Stijl: warme kinderboek-illustratie, consistent met NoahEmmaFaces.
 * Geen echte kinderfoto's — dit zijn de vaste modellen van het platform.
 */

export const MAATLIJST_AVATAR = ["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"];

/** Leeftijdslabel bij een kledingmaat */
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

/** 0 (baby) … 1 (12 jaar) op basis van de maat */
function groeiFactor(maat: string): number {
  const idx = MAATLIJST_AVATAR.indexOf(maat);
  if (idx < 0) return 0.4;
  return idx / (MAATLIJST_AVATAR.length - 1);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface FullBodyProps {
  naam: "noah" | "emma";
  maat: string;
  /** Hoogte in pixels; breedte schaalt mee */
  height?: number;
  className?: string;
}

export function NoahEmmaFullBody({ naam, maat, height = 340, className }: FullBodyProps) {
  const t = groeiFactor(maat);
  const isNoah = naam === "noah";
  const uid = `${naam}-${maat.replace("/", "-")}`;

  // ---- Huid & haar per model ----
  const huid = isNoah ? "#D89660" : "#FBDDB8";
  const huidDonker = isNoah ? "#C07840" : "#F0C090";
  const haar = isNoah ? "#241407" : "#A5713A";
  const haarLicht = isNoah ? "#3D2410" : "#C8955A";
  const blos = isNoah ? "#C06840" : "#FFB0A0";

  // ---- Kleding (neutrale basics) ----
  const shirt = "#FFFFFF";
  const shirtSchaduw = "#E8ECF2";
  const broek = isNoah ? "#5B8BC4" : "#F8A8BC"; // jeans-blauw / zacht roze
  const broekDonker = isNoah ? "#4A7FC0" : "#EF8FA8";
  const schoen = "#F4F6F8";
  const schoenZool = "#D8DDE4";

  // ---- Meegroeiende verhoudingen ----
  const beenL = lerp(52, 150, t);          // beentjes worden lang
  const torsoL = lerp(74, 122, t);         // romp strekt
  const hoofdR = lerp(47, 42, t);          // hoofd relatief kleiner
  const schouderB = lerp(88, 112, t);      // schouders breder
  const heupB = lerp(84, 82, t + (isNoah ? 0 : 0.02)); // baby's zijn rond
  const armL = lerp(56, 108, t);           // armen langer
  const armDikte = lerp(17, 12, t);        // babymolligheid verdwijnt
  const beenDikte = lerp(19, 13, t);
  const nekH = lerp(4, 12, t);
  const wangVol = lerp(1, 0, t);           // bolle wangen vervagen

  // ---- Opbouw vanaf de grond ----
  const W = 300;
  const grondY = 428;
  const schoenH = 14;
  const heupY = grondY - schoenH - beenL;
  const schouderY = heupY - torsoL;
  const hoofdCy = schouderY - nekH - hoofdR + 4;
  const H = 440;
  const cx = W / 2;

  const beenOffset = heupB / 4 + 2;
  const armStartX = schouderB / 2 - 2;

  // Gezichtselementen
  const oogY = hoofdCy + hoofdR * 0.08;
  const oogDX = hoofdR * 0.42;
  const mondY = hoofdCy + hoofdR * 0.52;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      height={height}
      width={(height * W) / H}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${isNoah ? "Noah" : "Emma"} — maat ${maat}`}
    >
      <defs>
        <radialGradient id={`huid-${uid}`} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor={isNoah ? "#E8A870" : "#FFE8D0"} />
          <stop offset="100%" stopColor={huid} />
        </radialGradient>
        <linearGradient id={`shirt-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shirt} />
          <stop offset="100%" stopColor={shirtSchaduw} />
        </linearGradient>
        <linearGradient id={`broek-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={broek} />
          <stop offset="100%" stopColor={broekDonker} />
        </linearGradient>
        <radialGradient id={`haar-${uid}`} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor={haarLicht} />
          <stop offset="100%" stopColor={haar} />
        </radialGradient>
      </defs>

      {/* Schaduw op de grond */}
      <ellipse cx={cx} cy={grondY + 4} rx={lerp(52, 66, t)} ry={9} fill="#0F172A" opacity="0.08" />

      {/* ===== BENEN ===== */}
      {[-1, 1].map(kant => (
        <g key={`been-${kant}`}>
          <rect
            x={cx + kant * beenOffset - beenDikte / 2}
            y={heupY + 4}
            width={beenDikte}
            height={beenL}
            rx={beenDikte / 2}
            fill={huid}
          />
          {/* Schoen */}
          <path
            d={`M ${cx + kant * beenOffset - beenDikte / 2 - 4} ${grondY}
                q 0 -${schoenH} ${beenDikte / 2 + 4} -${schoenH}
                q ${beenDikte / 2 + 6} 0 ${beenDikte / 2 + 6} ${schoenH - 4}
                q 0 4 -4 4 Z`}
            fill={schoen}
            stroke={schoenZool}
            strokeWidth="1.5"
          />
          <rect x={cx + kant * beenOffset - beenDikte / 2 - 4} y={grondY - 3} width={beenDikte + 10} height={4} rx={2} fill={schoenZool} />
        </g>
      ))}

      {/* ===== BROEKJE / ROKJE ===== */}
      {isNoah ? (
        // Kort broekje
        <path
          d={`M ${cx - heupB / 2 + 6} ${heupY - 8}
              L ${cx + heupB / 2 - 6} ${heupY - 8}
              L ${cx + heupB / 2 - 4} ${heupY + lerp(22, 34, t)}
              L ${cx + 3} ${heupY + lerp(22, 34, t)}
              L ${cx} ${heupY + 12}
              L ${cx - 3} ${heupY + lerp(22, 34, t)}
              L ${cx - heupB / 2 + 4} ${heupY + lerp(22, 34, t)} Z`}
          fill={`url(#broek-${uid})`}
        />
      ) : (
        // Rokje met plooi
        <path
          d={`M ${cx - heupB / 2 + 8} ${heupY - 10}
              L ${cx + heupB / 2 - 8} ${heupY - 10}
              L ${cx + heupB / 2 + 4} ${heupY + lerp(24, 34, t)}
              Q ${cx} ${heupY + lerp(32, 42, t)} ${cx - heupB / 2 - 4} ${heupY + lerp(24, 34, t)} Z`}
          fill={`url(#broek-${uid})`}
        />
      )}

      {/* ===== ARMEN ===== */}
      {[-1, 1].map(kant => (
        <g key={`arm-${kant}`}>
          {/* Mouwtje */}
          <rect
            x={cx + kant * armStartX - armDikte / 2 - 2}
            y={schouderY + 6}
            width={armDikte + 4}
            height={lerp(20, 26, t)}
            rx={(armDikte + 4) / 2}
            fill={shirtSchaduw}
            transform={`rotate(${kant * lerp(14, 8, t)} ${cx + kant * armStartX} ${schouderY + 8})`}
          />
          {/* Arm */}
          <rect
            x={cx + kant * armStartX - armDikte / 2}
            y={schouderY + 8}
            width={armDikte}
            height={armL}
            rx={armDikte / 2}
            fill={huid}
            transform={`rotate(${kant * lerp(14, 8, t)} ${cx + kant * armStartX} ${schouderY + 8})`}
          />
        </g>
      ))}

      {/* ===== ROMP (shirt) ===== */}
      <path
        d={`M ${cx - schouderB / 2} ${schouderY + 10}
            Q ${cx - schouderB / 2} ${schouderY} ${cx - schouderB / 2 + 12} ${schouderY - 2}
            L ${cx + schouderB / 2 - 12} ${schouderY - 2}
            Q ${cx + schouderB / 2} ${schouderY} ${cx + schouderB / 2} ${schouderY + 10}
            L ${cx + heupB / 2 - 4} ${heupY + 2}
            Q ${cx} ${heupY + lerp(12, 8, t)} ${cx - heupB / 2 + 4} ${heupY + 2} Z`}
        fill={`url(#shirt-${uid})`}
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      {/* Kraagje */}
      <path
        d={`M ${cx - 14} ${schouderY - 1} Q ${cx} ${schouderY + 8} ${cx + 14} ${schouderY - 1}`}
        fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round"
      />

      {/* ===== NEK ===== */}
      <rect x={cx - 9} y={schouderY - nekH - 6} width={18} height={nekH + 10} rx={7} fill={huidDonker} />

      {/* ===== HOOFD ===== */}
      {/* Haar achter (Emma: laag haar + staartjes) */}
      {!isNoah && (
        <g>
          <ellipse cx={cx} cy={hoofdCy + hoofdR * 0.25} rx={hoofdR * 1.08} ry={hoofdR * 1.05} fill={`url(#haar-${uid})`} />
          {/* Staartjes */}
          {[-1, 1].map(kant => (
            <g key={`staart-${kant}`}>
              <ellipse
                cx={cx + kant * hoofdR * 1.12}
                cy={hoofdCy + hoofdR * 0.35}
                rx={lerp(11, 14, t)}
                ry={lerp(16, 26, t)}
                fill={`url(#haar-${uid})`}
              />
              {/* Strikje */}
              <g transform={`translate(${cx + kant * hoofdR * 1.05}, ${hoofdCy - hoofdR * 0.05})`}>
                <path d="M0 0 C-7 -6 -12 2 -5 5 C-8 8 -2 12 1 6 Z" fill="#FF6B8A" />
                <path d="M0 0 C7 -6 12 2 5 5 C8 8 2 12 -1 6 Z" fill="#FF6B8A" />
                <circle cx="0" cy="3" r="3.2" fill="#FF4070" />
              </g>
            </g>
          ))}
        </g>
      )}

      {/* Gezicht */}
      <circle cx={cx} cy={hoofdCy} r={hoofdR} fill={`url(#huid-${uid})`} />

      {/* Oren */}
      <ellipse cx={cx - hoofdR * 0.98} cy={hoofdCy + 4} rx={7} ry={9} fill={huidDonker} />
      <ellipse cx={cx + hoofdR * 0.98} cy={hoofdCy + 4} rx={7} ry={9} fill={huidDonker} />

      {/* Haar voor */}
      {isNoah ? (
        // Noah: korte donkere krulletjes
        <g>
          <path
            d={`M ${cx - hoofdR * 0.95} ${hoofdCy - hoofdR * 0.1}
                C ${cx - hoofdR * 1.05} ${hoofdCy - hoofdR * 0.9} ${cx - hoofdR * 0.4} ${hoofdCy - hoofdR * 1.22} ${cx} ${hoofdCy - hoofdR * 1.18}
                C ${cx + hoofdR * 0.4} ${hoofdCy - hoofdR * 1.22} ${cx + hoofdR * 1.05} ${hoofdCy - hoofdR * 0.9} ${cx + hoofdR * 0.95} ${hoofdCy - hoofdR * 0.1}
                C ${cx + hoofdR * 0.85} ${hoofdCy - hoofdR * 0.45} ${cx + hoofdR * 0.5} ${hoofdCy - hoofdR * 0.62} ${cx} ${hoofdCy - hoofdR * 0.6}
                C ${cx - hoofdR * 0.5} ${hoofdCy - hoofdR * 0.62} ${cx - hoofdR * 0.85} ${hoofdCy - hoofdR * 0.45} ${cx - hoofdR * 0.95} ${hoofdCy - hoofdR * 0.1} Z`}
            fill={`url(#haar-${uid})`}
          />
          {/* Krul-textuur */}
          {[0.28, 0.52, 0.76].map((f, i) => (
            <circle key={i} cx={cx - hoofdR * 0.62 + hoofdR * 1.24 * f} cy={hoofdCy - hoofdR * 0.95} r={hoofdR * 0.14} fill={haarLicht} opacity="0.55" />
          ))}
        </g>
      ) : (
        // Emma: zachte pony met scheiding
        <path
          d={`M ${cx - hoofdR * 0.98} ${hoofdCy + hoofdR * 0.05}
              C ${cx - hoofdR * 1.02} ${hoofdCy - hoofdR * 0.95} ${cx - hoofdR * 0.35} ${hoofdCy - hoofdR * 1.18} ${cx} ${hoofdCy - hoofdR * 1.14}
              C ${cx + hoofdR * 0.35} ${hoofdCy - hoofdR * 1.18} ${cx + hoofdR * 1.02} ${hoofdCy - hoofdR * 0.95} ${cx + hoofdR * 0.98} ${hoofdCy + hoofdR * 0.05}
              C ${cx + hoofdR * 0.8} ${hoofdCy - hoofdR * 0.5} ${cx + hoofdR * 0.45} ${hoofdCy - hoofdR * 0.72} ${cx + hoofdR * 0.12} ${hoofdCy - hoofdR * 0.55}
              C ${cx + hoofdR * 0.05} ${hoofdCy - hoofdR * 0.75} ${cx - hoofdR * 0.05} ${hoofdCy - hoofdR * 0.75} ${cx - hoofdR * 0.12} ${hoofdCy - hoofdR * 0.55}
              C ${cx - hoofdR * 0.45} ${hoofdCy - hoofdR * 0.72} ${cx - hoofdR * 0.8} ${hoofdCy - hoofdR * 0.5} ${cx - hoofdR * 0.98} ${hoofdCy + hoofdR * 0.05} Z`}
          fill={`url(#haar-${uid})`}
        />
      )}

      {/* Wenkbrauwen */}
      <path d={`M ${cx - oogDX - 8} ${oogY - 13} q 8 -5 15 -1`} stroke={haar} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d={`M ${cx + oogDX - 7} ${oogY - 14} q 8 -4 15 2`} stroke={haar} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Ogen */}
      {[-1, 1].map(kant => (
        <g key={`oog-${kant}`}>
          <ellipse cx={cx + kant * oogDX} cy={oogY} rx={7.5} ry={8.5} fill="#FFFFFF" />
          <circle cx={cx + kant * oogDX} cy={oogY + 1} r={5} fill={isNoah ? "#4A2810" : "#3A78B0"} />
          <circle cx={cx + kant * oogDX} cy={oogY + 1} r={2.4} fill="#150800" />
          <circle cx={cx + kant * oogDX - 1.6} cy={oogY - 1.4} r={1.5} fill="#FFFFFF" />
        </g>
      ))}

      {/* Neusje */}
      <path d={`M ${cx - 2} ${oogY + 11} q 2 4 4 0`} stroke={huidDonker} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Mond — vrolijke lach */}
      <path d={`M ${cx - 9} ${mondY} q 9 ${lerp(9, 7, t)} 18 0`} stroke={isNoah ? "#7A2A14" : "#D06050"} strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Bolle babywangen (vervagen bij het groeien) */}
      <ellipse cx={cx - hoofdR * 0.62} cy={mondY - 6} rx={9} ry={6} fill={blos} opacity={0.25 + wangVol * 0.2} />
      <ellipse cx={cx + hoofdR * 0.62} cy={mondY - 6} rx={9} ry={6} fill={blos} opacity={0.25 + wangVol * 0.2} />
    </svg>
  );
}
