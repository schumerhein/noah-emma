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

      {/* Haar — volume aan de achterkant */}
      <ellipse cx="100" cy="80" rx="48" ry="32" fill="url(#noah-hair)"/>
      {/* Bakkebaarden, smal aflopend */}
      <path d="M50 88 C45 98 45 110 52 120 C57 113 59 102 56 91 Z" fill="url(#noah-hair)"/>
      <path d="M150 88 C155 98 155 110 148 120 C143 113 141 102 144 91 Z" fill="url(#noah-hair)"/>
      {/* Getousseerde lokken bovenop — asymmetrisch, met een lichte zijscheiding */}
      <ellipse cx="60" cy="68" rx="13" ry="19" fill="#241407" transform="rotate(-26 60 68)"/>
      <ellipse cx="76" cy="55" rx="13" ry="21" fill="#241407" transform="rotate(-13 76 55)"/>
      <ellipse cx="94" cy="48" rx="12" ry="19" fill="#2C1A0A" transform="rotate(-3 94 48)"/>
      <ellipse cx="113" cy="50" rx="12" ry="19" fill="#241407" transform="rotate(13 113 50)"/>
      <ellipse cx="130" cy="59" rx="12" ry="18" fill="#241407" transform="rotate(27 130 59)"/>
      <ellipse cx="142" cy="73" rx="10" ry="15" fill="#1A0F05" transform="rotate(40 142 73)"/>
      {/* Losse lok voor een speels, natuurlijk accent */}
      <path d="M84 42 C80 34 82 26 90 24 C87 30 87 37 90 44 Z" fill="#241407"/>
      {/* Glans op de lokken */}
      <path d="M68 58 C70 48 78 40 88 38" stroke="#6B4622" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M98 42 C104 38 111 38 116 42" stroke="#6B4622" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M122 50 C128 48 134 52 138 60" stroke="#5C3A1A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>

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

      {/* Mond — warme, ontspannen glimlach */}
      {/* Mondvorm (basis) */}
      <path d="M81 143 C86 140 93 138 100 139 C107 138 114 140 119 143 C118 152 110 158 100 158 C90 158 82 152 81 143 Z" fill="#8B3020"/>
      {/* Zachte glimp van tanden, zonder harde lijntjes */}
      <path d="M85 144 C89 141 95 139 100 140 C105 139 111 141 115 144 C112 147 106 148 100 148 C94 148 88 147 85 144 Z" fill="#FFFCF8"/>
      {/* Bovenlip */}
      <path d="M81 143 C86 139 93 137 100 138 C107 137 114 139 119 143" stroke="#C05838" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Onderlip, vol en zacht */}
      <path d="M84 150 C90 157 110 157 116 150" stroke="#B8583A" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55"/>
      {/* Mond hoeken (kuiltjes) */}
      <circle cx="81" cy="143" r="1.6" fill="#7A2A14" opacity="0.5"/>
      <circle cx="119" cy="143" r="1.6" fill="#7A2A14" opacity="0.5"/>
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

      {/* Haar boven — één zachte, ronde volume-vorm i.p.v. een platte koepel */}
      <ellipse cx="100" cy="54" rx="36" ry="26" fill="url(#emma-hair)"/>
      <ellipse cx="70" cy="66" rx="22" ry="19" fill="url(#emma-hair)" transform="rotate(-16 70 66)"/>
      <ellipse cx="130" cy="66" rx="22" ry="19" fill="url(#emma-hair)" transform="rotate(16 130 66)"/>
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

      {/* Mond — meisje: zachte, volle glimlach */}
      {/* Mondvorm (basis) */}
      <path d="M82 142 C87 139 94 137 100 138 C106 137 113 139 118 142 C117 151 109 158 100 158 C91 158 83 151 82 142 Z" fill="#8B2040"/>
      {/* Zachte glimp van tanden */}
      <path d="M86 143 C90 140 95 138 100 139 C105 138 110 140 114 143 C111 146 105 147 100 147 C95 147 89 146 86 143 Z" fill="#FFF8F5"/>
      {/* Bovenlip met Cupido-boog */}
      <path d="M82 142 C86 138 92 136 96 138 C98 136 102 136 104 138 C108 136 114 138 118 142" stroke="#E06880" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Onderlip, vol */}
      <path d="M84 149 C91 158 109 158 116 149" stroke="#E06880" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* Liplicht */}
      <ellipse cx="100" cy="152" rx="7" ry="2.5" fill="white" opacity="0.35"/>
      {/* Mond hoeken */}
      <circle cx="82" cy="142" r="1.6" fill="#7A1838" opacity="0.5"/>
      <circle cx="118" cy="142" r="1.6" fill="#7A1838" opacity="0.5"/>
    </svg>
  );
}
