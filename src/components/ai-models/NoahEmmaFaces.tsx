"use client";

/**
 * Noah & Emma — geïllustreerde kindergezichten (SVG)
 * Stijl: flat design, vlakke kleuren, minimale lijnen — geen echte kinderfoto's
 */

export function NoahFace({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Achtergrond */}
      <circle cx="100" cy="100" r="100" fill="#C8E8F8"/>

      {/* Schouders / shirt */}
      <path d="M50 200 C50 178 78 170 100 172 C122 170 150 178 150 200 Z" fill="#4AA8B8"/>

      {/* Nek */}
      <path d="M86 156 C86 168 100 172 114 168 L114 156 Z" fill="#F5CBA0"/>

      {/* Oren */}
      <ellipse cx="53" cy="114" rx="8" ry="11" fill="#F9D5AC"/>
      <ellipse cx="147" cy="114" rx="8" ry="11" fill="#F9D5AC"/>

      {/* Gezicht — vlak */}
      <ellipse cx="100" cy="112" rx="48" ry="50" fill="#F9D5AC"/>

      {/* Haar — zij-scheiding, naar één kant geveegd */}
      <ellipse cx="88" cy="68" rx="40" ry="27" fill="#1E1E1E"/>
      <ellipse cx="124" cy="64" rx="24" ry="16" fill="#1E1E1E" transform="rotate(-25 124 64)"/>
      <ellipse cx="138" cy="78" rx="13" ry="9" fill="#1E1E1E" transform="rotate(-35 138 78)"/>

      {/* Wenkbrauwen */}
      <path d="M70 98 C76 93 84 92 90 96" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round"/>
      <path d="M110 96 C116 92 124 93 130 98" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round"/>

      {/* Ogen — simpele stip */}
      <circle cx="82" cy="112" r="5" fill="#1E1E1E"/>
      <circle cx="118" cy="112" r="5" fill="#1E1E1E"/>

      {/* Neus — subtiele stip */}
      <circle cx="99" cy="122" r="2" fill="#D9A876" opacity="0.8"/>

      {/* Mond — rustige glimlach, gesloten */}
      <path d="M86 136 C91 141 109 141 114 136" stroke="#C97878" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function EmmaFace({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Achtergrond */}
      <circle cx="100" cy="100" r="100" fill="#FFE0EC"/>

      {/* Schouders / shirt */}
      <path d="M48 200 C48 176 78 168 100 170 C122 168 152 176 152 200 Z" fill="#FF9EB5"/>
      <path d="M92 170 L100 182 L108 170" stroke="#FF7FA0" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Paardenstaart, opzij */}
      <path d="M56 86 C42 90 32 104 34 122 C35 132 42 138 47 132 C40 120 38 104 50 94 Z" fill="#8B5A2B"/>

      {/* Nek */}
      <path d="M86 156 C86 168 100 172 114 168 L114 156 Z" fill="#FCDCB8"/>

      {/* Oren */}
      <ellipse cx="53" cy="114" rx="8" ry="11" fill="#FEE2C0"/>
      <ellipse cx="147" cy="114" rx="8" ry="11" fill="#FEE2C0"/>

      {/* Gezicht */}
      <ellipse cx="100" cy="112" rx="48" ry="50" fill="#FEE2C0"/>

      {/* Kruin */}
      <ellipse cx="100" cy="62" rx="32" ry="26" fill="#9C6B37"/>
      {/* Rechte pony, duidelijk afgebakend */}
      <path d="M60 90 C58 76 66 68 100 68 C134 68 142 76 140 90 C140 80 128 76 100 76 C72 76 60 80 60 90 Z" fill="#9C6B37"/>

      {/* Wenkbrauwen */}
      <path d="M70 98 C76 93 84 92 90 96" stroke="#6B4A24" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M110 96 C116 92 124 93 130 98" stroke="#6B4A24" strokeWidth="2.6" strokeLinecap="round"/>

      {/* Ogen */}
      <circle cx="82" cy="112" r="5" fill="#1E1E1E"/>
      <circle cx="118" cy="112" r="5" fill="#1E1E1E"/>

      {/* Neus */}
      <circle cx="99" cy="122" r="2" fill="#E0A878" opacity="0.8"/>

      {/* Blush */}
      <circle cx="66" cy="128" r="7" fill="#FFA8A0" opacity="0.4"/>
      <circle cx="134" cy="128" r="7" fill="#FFA8A0" opacity="0.4"/>

      {/* Mond — brede open glimlach met tanden */}
      <path d="M82 133 C82 145 118 145 118 133 C118 141 108 147 100 147 C92 147 82 141 82 133 Z" fill="#B23A50"/>
      <path d="M84 134 C86 141 114 141 116 134 C112 138 106 139 100 139 C94 139 88 138 84 134 Z" fill="white"/>
    </svg>
  );
}
