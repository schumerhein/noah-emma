"use client";

/**
 * Noah & Emma — geïllustreerde kindergezichten (SVG)
 * Stijl: Pixar/kinderboek illustratie — warm, herkenbaar, geen echte kinderfoto's
 */

export function NoahFace({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="noah-skin" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#E8A870"/>
          <stop offset="100%" stopColor="#C07840"/>
        </radialGradient>
        <radialGradient id="noah-hair" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#3D2410"/>
          <stop offset="100%" stopColor="#1A0A02"/>
        </radialGradient>
        <radialGradient id="noah-iris-l" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7A4A18"/>
          <stop offset="100%" stopColor="#2C1005"/>
        </radialGradient>
        <radialGradient id="noah-iris-r" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7A4A18"/>
          <stop offset="100%" stopColor="#2C1005"/>
        </radialGradient>
        <filter id="noah-blur">
          <feGaussianBlur stdDeviation="1.5"/>
        </filter>
        <clipPath id="noah-face-clip">
          <ellipse cx="100" cy="114" rx="49" ry="54"/>
        </clipPath>
      </defs>

      {/* Achtergrond */}
      <circle cx="100" cy="100" r="100" fill="#C8E8F8"/>

      {/* Nek */}
      <path d="M82 158 C82 170 100 174 118 170 L118 158 Z" fill="url(#noah-skin)"/>

      {/* Schouders (hint) */}
      <path d="M50 200 C50 178 78 170 100 172 C122 170 150 178 150 200 Z" fill="#4A7FC0" opacity="0.8"/>

      {/* Oor links */}
      <ellipse cx="51" cy="116" rx="10" ry="13" fill="#C07840"/>
      <ellipse cx="53" cy="116" rx="7" ry="9" fill="url(#noah-skin)"/>
      <path d="M54 110 C56 113 56 119 54 122" stroke="#A06030" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* Oor rechts */}
      <ellipse cx="149" cy="116" rx="10" ry="13" fill="#C07840"/>
      <ellipse cx="147" cy="116" rx="7" ry="9" fill="url(#noah-skin)"/>
      <path d="M146 110 C144 113 144 119 146 122" stroke="#A06030" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* Gezicht */}
      <ellipse cx="100" cy="114" rx="49" ry="54" fill="url(#noah-skin)"/>

      {/* Gezichtsschaduw subtiel */}
      <ellipse cx="100" cy="114" rx="49" ry="54" fill="url(#noah-skin)" clipPath="url(#noah-face-clip)"/>
      <ellipse cx="62" cy="130" rx="14" ry="20" fill="#A06030" opacity="0.07"/>
      <ellipse cx="138" cy="130" rx="14" ry="20" fill="#A06030" opacity="0.07"/>

      {/* Haar — basis dekking */}
      <ellipse cx="100" cy="72" rx="52" ry="40" fill="url(#noah-hair)"/>
      {/* Haar — zijkanten */}
      <ellipse cx="52" cy="100" rx="11" ry="24" fill="url(#noah-hair)"/>
      <ellipse cx="148" cy="100" rx="11" ry="24" fill="url(#noah-hair)"/>
      {/* Haar — voorkant lijn (frisuur), zachte lokjes i.p.v. één vlakke boog */}
      <path d="M50 92 C53 80 60 72 68 76 C71 68 79 62 87 68 C91 60 100 58 100 66 C100 58 109 60 113 68 C121 62 129 68 132 76 C140 72 147 80 150 92 C141 81 121 75 100 75 C79 75 59 81 50 92 Z" fill="#241407"/>
      {/* Haar lok-scheidingen (subtiele lijnen voor textuur) */}
      <path d="M64 78 C63 82 63 87 65 91" stroke="#160B03" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M83 70 C82 75 82 80 84 85" stroke="#160B03" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M100 66 C99 72 99 78 100 83" stroke="#160B03" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M117 70 C118 75 118 80 116 85" stroke="#160B03" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M136 78 C137 82 137 87 135 91" stroke="#160B03" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* Haar highlight — volgt de lokken voor een glanzend effect */}
      <path d="M70 68 C76 60 84 56 92 58" stroke="#6B4622" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.55"/>
      <path d="M96 60 C102 56 110 56 116 60" stroke="#6B4622" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M120 64 C126 62 132 66 136 72" stroke="#6B4622" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
      {/* Zijkant highlight */}
      <path d="M53 88 C51 94 51 102 54 110" stroke="#5C3A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.35"/>

      {/* Wenkbrauw links */}
      <path d="M65 100 C72 95 83 94 93 97" stroke="#1A0A02" strokeWidth="4" strokeLinecap="round"/>
      <path d="M65 100 C72 96 83 95 93 97" stroke="#3D2410" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

      {/* Wenkbrauw rechts */}
      <path d="M107 97 C117 94 128 95 135 100" stroke="#1A0A02" strokeWidth="4" strokeLinecap="round"/>
      <path d="M107 97 C117 95 128 96 135 100" stroke="#3D2410" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

      {/* Oogwit links */}
      <ellipse cx="79" cy="113" rx="13" ry="11" fill="white"/>
      <ellipse cx="79" cy="113" rx="13" ry="11" fill="white"/>
      {/* Bovenste ooglid schaduw */}
      <path d="M67 107 C73 103 85 103 91 107" fill="#C07840" opacity="0.15"/>

      {/* Oogwit rechts */}
      <ellipse cx="121" cy="113" rx="13" ry="11" fill="white"/>
      <path d="M109 107 C115 103 127 103 133 107" fill="#C07840" opacity="0.15"/>

      {/* Iris links */}
      <circle cx="79" cy="114" r="8.5" fill="url(#noah-iris-l)"/>
      {/* Iris detail */}
      <circle cx="79" cy="114" r="8.5" fill="none" stroke="#5A3010" strokeWidth="0.8" opacity="0.5"/>

      {/* Iris rechts */}
      <circle cx="121" cy="114" r="8.5" fill="url(#noah-iris-r)"/>
      <circle cx="121" cy="114" r="8.5" fill="none" stroke="#5A3010" strokeWidth="0.8" opacity="0.5"/>

      {/* Pupillen */}
      <circle cx="80" cy="115" r="5.5" fill="#0A0300"/>
      <circle cx="122" cy="115" r="5.5" fill="#0A0300"/>

      {/* Oogglinstering */}
      <circle cx="83" cy="111" r="2.8" fill="white" opacity="0.95"/>
      <circle cx="125" cy="111" r="2.8" fill="white" opacity="0.95"/>
      <circle cx="77" cy="117" r="1.2" fill="white" opacity="0.5"/>
      <circle cx="119" cy="117" r="1.2" fill="white" opacity="0.5"/>

      {/* Ooglid lijn boven */}
      <path d="M67 108 C73 104 85 104 91 108" stroke="#1A0A02" strokeWidth="1.8" fill="none"/>
      <path d="M109 108 C115 104 127 104 133 108" stroke="#1A0A02" strokeWidth="1.8" fill="none"/>
      {/* Ooglid lijn onder subtiel */}
      <path d="M68 118 C73 121 85 121 90 118" stroke="#A06030" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M110 118 C115 121 127 121 132 118" stroke="#A06030" strokeWidth="1" fill="none" opacity="0.4"/>

      {/* Neus brug schaduw */}
      <path d="M98 100 C96 106 96 114 97 120" stroke="#A06030" strokeWidth="1.5" fill="none" opacity="0.3"/>

      {/* Neus */}
      <ellipse cx="94" cy="130" rx="4" ry="3" fill="#A06030" opacity="0.35"/>
      <ellipse cx="106" cy="130" rx="4" ry="3" fill="#A06030" opacity="0.35"/>
      <path d="M94 127 C97 131 103 131 106 127" stroke="#A06030" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Wangen blush */}
      <ellipse cx="60" cy="130" rx="14" ry="9" fill="#E07050" opacity="0.14" filter="url(#noah-blur)"/>
      <ellipse cx="140" cy="130" rx="14" ry="9" fill="#E07050" opacity="0.14" filter="url(#noah-blur)"/>

      {/* Mond — glimlach met tanden */}
      {/* Bovenlip */}
      <path d="M83 146 C88 142 96 141 100 143 C104 141 112 142 117 146" fill="#C05838" stroke="#C05838" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Mondholte */}
      <path d="M83 146 C88 156 112 156 117 146 C112 149 88 149 83 146 Z" fill="#7A2A14"/>
      {/* Tanden */}
      <path d="M84 147 C88 152 112 152 116 147 L116 149 C112 153 88 153 84 149 Z" fill="white"/>
      {/* Tandlijn */}
      <line x1="100" y1="147" x2="100" y2="152" stroke="#E0E0E0" strokeWidth="1"/>
      <line x1="91" y1="148" x2="91" y2="152" stroke="#E0E0E0" strokeWidth="1"/>
      <line x1="109" y1="148" x2="109" y2="152" stroke="#E0E0E0" strokeWidth="1"/>
      {/* Onderlip */}
      <path d="M86 153 C92 159 108 159 114 153" stroke="#D07050" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
      {/* Mond hoeken */}
      <circle cx="83" cy="146" r="2" fill="#A04030" opacity="0.6"/>
      <circle cx="117" cy="146" r="2" fill="#A04030" opacity="0.6"/>
    </svg>
  );
}

export function EmmaFace({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="emma-skin" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFE8D0"/>
          <stop offset="100%" stopColor="#F0C090"/>
        </radialGradient>
        <radialGradient id="emma-hair" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#C8955A"/>
          <stop offset="100%" stopColor="#8B5E2A"/>
        </radialGradient>
        <radialGradient id="emma-iris-l" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#6AA8D8"/>
          <stop offset="100%" stopColor="#2A6898"/>
        </radialGradient>
        <radialGradient id="emma-iris-r" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#6AA8D8"/>
          <stop offset="100%" stopColor="#2A6898"/>
        </radialGradient>
        <filter id="emma-blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
        <filter id="emma-soft">
          <feGaussianBlur stdDeviation="1"/>
        </filter>
      </defs>

      {/* Achtergrond */}
      <circle cx="100" cy="100" r="100" fill="#FFE0EC"/>

      {/* Nek */}
      <path d="M84 156 C84 168 100 172 116 168 L116 156 Z" fill="url(#emma-skin)"/>

      {/* Schouders */}
      <path d="M48 200 C48 176 78 168 100 170 C122 168 152 176 152 200 Z" fill="#FF9EB5" opacity="0.9"/>

      {/* Staartjes — haar uiteinden links */}
      <path d="M38 110 C28 118 22 135 26 150 C28 158 34 162 38 158 C34 148 32 132 42 120 Z" fill="url(#emma-hair)"/>
      {/* Staartje rechts */}
      <path d="M162 110 C172 118 178 135 174 150 C172 158 166 162 162 158 C166 148 168 132 158 120 Z" fill="url(#emma-hair)"/>

      {/* Haar boven (uitlopend) */}
      <ellipse cx="100" cy="68" rx="54" ry="38" fill="url(#emma-hair)"/>
      {/* Haar zijkanten dik (staartjes) */}
      <ellipse cx="47" cy="108" rx="14" ry="26" fill="url(#emma-hair)"/>
      <ellipse cx="153" cy="108" rx="14" ry="26" fill="url(#emma-hair)"/>

      {/* Haar voorkant lijn — zachte lokjes i.p.v. één vlakke boog */}
      <path d="M50 90 C54 78 62 70 70 74 C73 66 82 60 90 66 C93 58 100 56 100 64 C100 56 107 58 110 66 C118 60 127 66 130 74 C138 70 146 78 150 90 C140 79 121 73 100 73 C79 73 60 79 50 90 Z" fill="#A9723E"/>
      {/* Haar lok-scheidingen */}
      <path d="M66 76 C65 80 65 85 67 89" stroke="#8B5E2A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M85 66 C84 71 84 76 86 81" stroke="#8B5E2A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M115 66 C116 71 116 76 114 81" stroke="#8B5E2A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M134 76 C135 80 135 85 133 89" stroke="#8B5E2A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Haar highlight */}
      <path d="M72 62 C80 52 92 48 100 50" stroke="#EACB9C" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
      <path d="M100 50 C108 48 120 52 128 62" stroke="#EACB9C" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M78 56 C86 50 94 48 100 49" stroke="#F5DDB5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Strikje links */}
      <path d="M35 104 C30 96 38 88 44 94 C42 98 38 100 35 104 Z" fill="#FF6B8A"/>
      <path d="M35 104 C30 112 38 120 44 114 C42 110 38 108 35 104 Z" fill="#FF6B8A"/>
      <path d="M35 104 C44 100 52 102 52 104 C52 106 44 108 35 104 Z" fill="#FF8CA0"/>
      <circle cx="35" cy="104" r="4" fill="#FF4070"/>

      {/* Strikje rechts */}
      <path d="M165 104 C170 96 162 88 156 94 C158 98 162 100 165 104 Z" fill="#FF6B8A"/>
      <path d="M165 104 C170 112 162 120 156 114 C158 110 162 108 165 104 Z" fill="#FF6B8A"/>
      <path d="M165 104 C156 100 148 102 148 104 C148 106 156 108 165 104 Z" fill="#FF8CA0"/>
      <circle cx="165" cy="104" r="4" fill="#FF4070"/>

      {/* Oor links */}
      <ellipse cx="51" cy="116" rx="10" ry="12" fill="#E8A870"/>
      <ellipse cx="53" cy="116" rx="7" ry="9" fill="url(#emma-skin)"/>
      <path d="M54 111 C56 114 56 118 54 121" stroke="#D08050" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Oor rechts */}
      <ellipse cx="149" cy="116" rx="10" ry="12" fill="#E8A870"/>
      <ellipse cx="147" cy="116" rx="7" ry="9" fill="url(#emma-skin)"/>
      <path d="M146 111 C144 114 144 118 146 121" stroke="#D08050" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Gezicht */}
      <ellipse cx="100" cy="114" rx="49" ry="54" fill="url(#emma-skin)"/>

      {/* Wangen blush (prominent voor meisje) */}
      <ellipse cx="60" cy="128" rx="16" ry="10" fill="#FFB0A0" opacity="0.35" filter="url(#emma-blur)"/>
      <ellipse cx="140" cy="128" rx="16" ry="10" fill="#FFB0A0" opacity="0.35" filter="url(#emma-blur)"/>

      {/* Wenkbrauw links — fijner voor meisje */}
      <path d="M66 100 C74 95 85 94 93 97" stroke="#8B5E30" strokeWidth="3" strokeLinecap="round"/>

      {/* Wenkbrauw rechts */}
      <path d="M107 97 C115 94 126 95 134 100" stroke="#8B5E30" strokeWidth="3" strokeLinecap="round"/>

      {/* Oogwit links */}
      <ellipse cx="79" cy="113" rx="13" ry="11" fill="white"/>
      <path d="M67 107 C73 103 85 103 91 107" fill="#E8C0A0" opacity="0.2"/>

      {/* Oogwit rechts */}
      <ellipse cx="121" cy="113" rx="13" ry="11" fill="white"/>
      <path d="M109 107 C115 103 127 103 133 107" fill="#E8C0A0" opacity="0.2"/>

      {/* Iris links */}
      <circle cx="79" cy="114" r="8.5" fill="url(#emma-iris-l)"/>
      <circle cx="79" cy="114" r="8.5" fill="none" stroke="#4A88B8" strokeWidth="0.8" opacity="0.6"/>

      {/* Iris rechts */}
      <circle cx="121" cy="114" r="8.5" fill="url(#emma-iris-r)"/>
      <circle cx="121" cy="114" r="8.5" fill="none" stroke="#4A88B8" strokeWidth="0.8" opacity="0.6"/>

      {/* Pupillen */}
      <circle cx="80" cy="115" r="5.5" fill="#0A0510"/>
      <circle cx="122" cy="115" r="5.5" fill="#0A0510"/>

      {/* Oogglinstering */}
      <circle cx="83" cy="111" r="2.8" fill="white" opacity="0.95"/>
      <circle cx="125" cy="111" r="2.8" fill="white" opacity="0.95"/>
      <circle cx="77" cy="117" r="1.2" fill="white" opacity="0.5"/>
      <circle cx="119" cy="117" r="1.2" fill="white" opacity="0.5"/>

      {/* Wimpers links */}
      <path d="M67 108 C73 104 85 104 91 108" stroke="#4A2808" strokeWidth="2" fill="none"/>
      <path d="M68 107 L65 103" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M72 105 L70 101" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M77 104 L76 100" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M82 104 L82 100" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M87 105 L88 101" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M90 107 L92 104" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Wimpers rechts */}
      <path d="M109 108 C115 104 127 104 133 108" stroke="#4A2808" strokeWidth="2" fill="none"/>
      <path d="M110 107 L108 103" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M114 105 L113 101" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M118 104 L118 100" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M123 104 L124 100" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M128 105 L130 101" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M132 107 L135 104" stroke="#4A2808" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Onderwimpers subtiel */}
      <path d="M68 118 C73 121 85 121 90 118" stroke="#D09060" strokeWidth="1" fill="none" opacity="0.35"/>
      <path d="M110 118 C115 121 127 121 132 118" stroke="#D09060" strokeWidth="1" fill="none" opacity="0.35"/>

      {/* Neus brug */}
      <path d="M98 100 C96 106 96 114 97 120" stroke="#D09060" strokeWidth="1.5" fill="none" opacity="0.25"/>

      {/* Neus */}
      <ellipse cx="94" cy="130" rx="3.5" ry="2.5" fill="#D09060" opacity="0.3"/>
      <ellipse cx="106" cy="130" rx="3.5" ry="2.5" fill="#D09060" opacity="0.3"/>
      <path d="M95 127 C97 131 103 131 105 127" stroke="#D09060" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* Mond — meisje: voller, meer roze */}
      {/* Bovenlip Cupido-boog */}
      <path d="M84 145 C88 140 94 138 100 140 C106 138 112 140 116 145" fill="#E06880" stroke="none"/>
      {/* Mondholte */}
      <path d="M84 145 C88 155 112 155 116 145 C112 148 88 148 84 145 Z" fill="#8B2040"/>
      {/* Tanden */}
      <path d="M85 146 C89 152 111 152 115 146 L115 149 C111 153 89 153 85 149 Z" fill="white"/>
      {/* Tandlijn */}
      <line x1="100" y1="146" x2="100" y2="152" stroke="#F0E0E0" strokeWidth="1"/>
      <line x1="91" y1="147" x2="91" y2="152" stroke="#F0E0E0" strokeWidth="1"/>
      <line x1="109" y1="147" x2="109" y2="152" stroke="#F0E0E0" strokeWidth="1"/>
      {/* Onderlip voller */}
      <path d="M85 153 C92 161 108 161 115 153" stroke="#E87090" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      {/* Liplicht */}
      <ellipse cx="100" cy="156" rx="8" ry="3" fill="white" opacity="0.3"/>
      {/* Mond hoeken */}
      <circle cx="84" cy="145" r="2" fill="#C05060" opacity="0.5"/>
      <circle cx="116" cy="145" r="2" fill="#C05060" opacity="0.5"/>
    </svg>
  );
}
