/**
 * Noah & Emma SVG strings voor canvas rendering
 * Wordt gebruikt bij face replacement in de sell pagina
 */

export function getNoahSvgString(size: number, uid: string = Math.random().toString(36).slice(2)): string {
  const ns = `ns-${uid}`;
  const nh = `nh-${uid}`;
  const nil = `nil-${uid}`;
  const nir = `nir-${uid}`;
  const nb = `nb-${uid}`;
  const nc = `nc-${uid}`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="${ns}" cx="45%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#E8A870"/>
    <stop offset="100%" stop-color="#C07840"/>
  </radialGradient>
  <radialGradient id="${nh}" cx="50%" cy="30%" r="70%">
    <stop offset="0%" stop-color="#3D2410"/>
    <stop offset="100%" stop-color="#1A0A02"/>
  </radialGradient>
  <radialGradient id="${nil}" cx="40%" cy="35%" r="60%">
    <stop offset="0%" stop-color="#7A4A18"/>
    <stop offset="100%" stop-color="#2C1005"/>
  </radialGradient>
  <radialGradient id="${nir}" cx="40%" cy="35%" r="60%">
    <stop offset="0%" stop-color="#7A4A18"/>
    <stop offset="100%" stop-color="#2C1005"/>
  </radialGradient>
  <filter id="${nb}">
    <feGaussianBlur stdDeviation="1.5"/>
  </filter>
  <clipPath id="${nc}">
    <ellipse cx="100" cy="114" rx="49" ry="54"/>
  </clipPath>
</defs>
<circle cx="100" cy="100" r="100" fill="#C8E8F8"/>
<path d="M82 158 C82 170 100 174 118 170 L118 158 Z" fill="url(#${ns})"/>
<path d="M50 200 C50 178 78 170 100 172 C122 170 150 178 150 200 Z" fill="#4A7FC0" opacity="0.8"/>
<ellipse cx="51" cy="116" rx="10" ry="13" fill="#C07840"/>
<ellipse cx="53" cy="116" rx="7" ry="9" fill="url(#${ns})"/>
<path d="M54 110 C56 113 56 119 54 122" stroke="#A06030" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
<ellipse cx="149" cy="116" rx="10" ry="13" fill="#C07840"/>
<ellipse cx="147" cy="116" rx="7" ry="9" fill="url(#${ns})"/>
<path d="M146 110 C144 113 144 119 146 122" stroke="#A06030" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
<ellipse cx="100" cy="114" rx="49" ry="54" fill="url(#${ns})"/>
<ellipse cx="100" cy="114" rx="49" ry="54" fill="url(#${ns})" clip-path="url(#${nc})"/>
<ellipse cx="62" cy="130" rx="14" ry="20" fill="#A06030" opacity="0.07"/>
<ellipse cx="138" cy="130" rx="14" ry="20" fill="#A06030" opacity="0.07"/>
<ellipse cx="100" cy="72" rx="52" ry="40" fill="url(#${nh})"/>
<ellipse cx="52" cy="100" rx="11" ry="24" fill="url(#${nh})"/>
<ellipse cx="148" cy="100" rx="11" ry="24" fill="url(#${nh})"/>
<path d="M54 88 C60 78 78 72 100 70 C122 72 140 78 146 88 C138 80 120 76 100 76 C80 76 62 80 54 88 Z" fill="#2C1A0A"/>
<path d="M80 60 C88 54 108 54 118 60" stroke="#5C3A1A" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
<path d="M72 66 C76 60 82 57 90 56" stroke="#5C3A1A" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3"/>
<path d="M65 100 C72 95 83 94 93 97" stroke="#1A0A02" stroke-width="4" stroke-linecap="round"/>
<path d="M65 100 C72 96 83 95 93 97" stroke="#3D2410" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
<path d="M107 97 C117 94 128 95 135 100" stroke="#1A0A02" stroke-width="4" stroke-linecap="round"/>
<path d="M107 97 C117 95 128 96 135 100" stroke="#3D2410" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
<ellipse cx="79" cy="113" rx="13" ry="11" fill="white"/>
<ellipse cx="79" cy="113" rx="13" ry="11" fill="white"/>
<path d="M67 107 C73 103 85 103 91 107" fill="#C07840" opacity="0.15"/>
<ellipse cx="121" cy="113" rx="13" ry="11" fill="white"/>
<path d="M109 107 C115 103 127 103 133 107" fill="#C07840" opacity="0.15"/>
<circle cx="79" cy="114" r="8.5" fill="url(#${nil})"/>
<circle cx="79" cy="114" r="8.5" fill="none" stroke="#5A3010" stroke-width="0.8" opacity="0.5"/>
<circle cx="121" cy="114" r="8.5" fill="url(#${nir})"/>
<circle cx="121" cy="114" r="8.5" fill="none" stroke="#5A3010" stroke-width="0.8" opacity="0.5"/>
<circle cx="80" cy="115" r="5.5" fill="#0A0300"/>
<circle cx="122" cy="115" r="5.5" fill="#0A0300"/>
<circle cx="83" cy="111" r="2.8" fill="white" opacity="0.95"/>
<circle cx="125" cy="111" r="2.8" fill="white" opacity="0.95"/>
<circle cx="77" cy="117" r="1.2" fill="white" opacity="0.5"/>
<circle cx="119" cy="117" r="1.2" fill="white" opacity="0.5"/>
<path d="M67 108 C73 104 85 104 91 108" stroke="#1A0A02" stroke-width="1.8" fill="none"/>
<path d="M109 108 C115 104 127 104 133 108" stroke="#1A0A02" stroke-width="1.8" fill="none"/>
<path d="M68 118 C73 121 85 121 90 118" stroke="#A06030" stroke-width="1" fill="none" opacity="0.4"/>
<path d="M110 118 C115 121 127 121 132 118" stroke="#A06030" stroke-width="1" fill="none" opacity="0.4"/>
<path d="M98 100 C96 106 96 114 97 120" stroke="#A06030" stroke-width="1.5" fill="none" opacity="0.3"/>
<ellipse cx="94" cy="130" rx="4" ry="3" fill="#A06030" opacity="0.35"/>
<ellipse cx="106" cy="130" rx="4" ry="3" fill="#A06030" opacity="0.35"/>
<path d="M94 127 C97 131 103 131 106 127" stroke="#A06030" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.6"/>
<ellipse cx="60" cy="130" rx="14" ry="9" fill="#E07050" opacity="0.14" filter="url(#${nb})"/>
<ellipse cx="140" cy="130" rx="14" ry="9" fill="#E07050" opacity="0.14" filter="url(#${nb})"/>
<path d="M83 146 C88 142 96 141 100 143 C104 141 112 142 117 146" fill="#C05838" stroke="#C05838" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M83 146 C88 156 112 156 117 146 C112 149 88 149 83 146 Z" fill="#7A2A14"/>
<path d="M84 147 C88 152 112 152 116 147 L116 149 C112 153 88 153 84 149 Z" fill="white"/>
<line x1="100" y1="147" x2="100" y2="152" stroke="#E0E0E0" stroke-width="1"/>
<line x1="91" y1="148" x2="91" y2="152" stroke="#E0E0E0" stroke-width="1"/>
<line x1="109" y1="148" x2="109" y2="152" stroke="#E0E0E0" stroke-width="1"/>
<path d="M86 153 C92 159 108 159 114 153" stroke="#D07050" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
<circle cx="83" cy="146" r="2" fill="#A04030" opacity="0.6"/>
<circle cx="117" cy="146" r="2" fill="#A04030" opacity="0.6"/>
</svg>`;
}

export function getEmmaSvgString(size: number, uid: string = Math.random().toString(36).slice(2)): string {
  const es = `es-${uid}`;
  const eh = `eh-${uid}`;
  const eil = `eil-${uid}`;
  const eir = `eir-${uid}`;
  const eb = `eb-${uid}`;
  const ef = `ef-${uid}`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="${es}" cx="45%" cy="40%" r="65%">
    <stop offset="0%" stop-color="#FFE8D0"/>
    <stop offset="100%" stop-color="#F0C090"/>
  </radialGradient>
  <radialGradient id="${eh}" cx="50%" cy="20%" r="80%">
    <stop offset="0%" stop-color="#C8955A"/>
    <stop offset="100%" stop-color="#8B5E2A"/>
  </radialGradient>
  <radialGradient id="${eil}" cx="35%" cy="30%" r="65%">
    <stop offset="0%" stop-color="#6AA8D8"/>
    <stop offset="100%" stop-color="#2A6898"/>
  </radialGradient>
  <radialGradient id="${eir}" cx="35%" cy="30%" r="65%">
    <stop offset="0%" stop-color="#6AA8D8"/>
    <stop offset="100%" stop-color="#2A6898"/>
  </radialGradient>
  <filter id="${eb}">
    <feGaussianBlur stdDeviation="2"/>
  </filter>
  <filter id="${ef}">
    <feGaussianBlur stdDeviation="1"/>
  </filter>
</defs>
<circle cx="100" cy="100" r="100" fill="#FFE0EC"/>
<path d="M84 156 C84 168 100 172 116 168 L116 156 Z" fill="url(#${es})"/>
<path d="M48 200 C48 176 78 168 100 170 C122 168 152 176 152 200 Z" fill="#FF9EB5" opacity="0.9"/>
<path d="M38 110 C28 118 22 135 26 150 C28 158 34 162 38 158 C34 148 32 132 42 120 Z" fill="url(#${eh})"/>
<path d="M162 110 C172 118 178 135 174 150 C172 158 166 162 162 158 C166 148 168 132 158 120 Z" fill="url(#${eh})"/>
<ellipse cx="100" cy="68" rx="54" ry="38" fill="url(#${eh})"/>
<ellipse cx="47" cy="108" rx="14" ry="26" fill="url(#${eh})"/>
<ellipse cx="153" cy="108" rx="14" ry="26" fill="url(#${eh})"/>
<path d="M52 86 C60 76 78 70 100 68 C122 70 140 76 148 86 C140 78 120 74 100 74 C80 74 60 78 52 86 Z" fill="#B07840"/>
<path d="M75 58 C84 50 116 50 125 58" stroke="#DEB880" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.5"/>
<path d="M82 54 C90 48 110 48 118 54" stroke="#DEB880" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.3"/>
<path d="M35 104 C30 96 38 88 44 94 C42 98 38 100 35 104 Z" fill="#FF6B8A"/>
<path d="M35 104 C30 112 38 120 44 114 C42 110 38 108 35 104 Z" fill="#FF6B8A"/>
<path d="M35 104 C44 100 52 102 52 104 C52 106 44 108 35 104 Z" fill="#FF8CA0"/>
<circle cx="35" cy="104" r="4" fill="#FF4070"/>
<path d="M165 104 C170 96 162 88 156 94 C158 98 162 100 165 104 Z" fill="#FF6B8A"/>
<path d="M165 104 C170 112 162 120 156 114 C158 110 162 108 165 104 Z" fill="#FF6B8A"/>
<path d="M165 104 C156 100 148 102 148 104 C148 106 156 108 165 104 Z" fill="#FF8CA0"/>
<circle cx="165" cy="104" r="4" fill="#FF4070"/>
<ellipse cx="51" cy="116" rx="10" ry="12" fill="#E8A870"/>
<ellipse cx="53" cy="116" rx="7" ry="9" fill="url(#${es})"/>
<path d="M54 111 C56 114 56 118 54 121" stroke="#D08050" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
<ellipse cx="149" cy="116" rx="10" ry="12" fill="#E8A870"/>
<ellipse cx="147" cy="116" rx="7" ry="9" fill="url(#${es})"/>
<path d="M146 111 C144 114 144 118 146 121" stroke="#D08050" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.4"/>
<ellipse cx="100" cy="114" rx="49" ry="54" fill="url(#${es})"/>
<ellipse cx="60" cy="128" rx="16" ry="10" fill="#FFB0A0" opacity="0.35" filter="url(#${eb})"/>
<ellipse cx="140" cy="128" rx="16" ry="10" fill="#FFB0A0" opacity="0.35" filter="url(#${eb})"/>
<path d="M66 100 C74 95 85 94 93 97" stroke="#8B5E30" stroke-width="3" stroke-linecap="round"/>
<path d="M107 97 C115 94 126 95 134 100" stroke="#8B5E30" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="79" cy="113" rx="13" ry="11" fill="white"/>
<path d="M67 107 C73 103 85 103 91 107" fill="#E8C0A0" opacity="0.2"/>
<ellipse cx="121" cy="113" rx="13" ry="11" fill="white"/>
<path d="M109 107 C115 103 127 103 133 107" fill="#E8C0A0" opacity="0.2"/>
<circle cx="79" cy="114" r="8.5" fill="url(#${eil})"/>
<circle cx="79" cy="114" r="8.5" fill="none" stroke="#4A88B8" stroke-width="0.8" opacity="0.6"/>
<circle cx="121" cy="114" r="8.5" fill="url(#${eir})"/>
<circle cx="121" cy="114" r="8.5" fill="none" stroke="#4A88B8" stroke-width="0.8" opacity="0.6"/>
<circle cx="80" cy="115" r="5.5" fill="#0A0510"/>
<circle cx="122" cy="115" r="5.5" fill="#0A0510"/>
<circle cx="83" cy="111" r="2.8" fill="white" opacity="0.95"/>
<circle cx="125" cy="111" r="2.8" fill="white" opacity="0.95"/>
<circle cx="77" cy="117" r="1.2" fill="white" opacity="0.5"/>
<circle cx="119" cy="117" r="1.2" fill="white" opacity="0.5"/>
<path d="M67 108 C73 104 85 104 91 108" stroke="#4A2808" stroke-width="2" fill="none"/>
<path d="M68 107 L65 103" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M72 105 L70 101" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M77 104 L76 100" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M82 104 L82 100" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M87 105 L88 101" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M90 107 L92 104" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M109 108 C115 104 127 104 133 108" stroke="#4A2808" stroke-width="2" fill="none"/>
<path d="M110 107 L108 103" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M114 105 L113 101" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M118 104 L118 100" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M123 104 L124 100" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M128 105 L130 101" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M132 107 L135 104" stroke="#4A2808" stroke-width="1.5" stroke-linecap="round"/>
<path d="M68 118 C73 121 85 121 90 118" stroke="#D09060" stroke-width="1" fill="none" opacity="0.35"/>
<path d="M110 118 C115 121 127 121 132 118" stroke="#D09060" stroke-width="1" fill="none" opacity="0.35"/>
<path d="M98 100 C96 106 96 114 97 120" stroke="#D09060" stroke-width="1.5" fill="none" opacity="0.25"/>
<ellipse cx="94" cy="130" rx="3.5" ry="2.5" fill="#D09060" opacity="0.3"/>
<ellipse cx="106" cy="130" rx="3.5" ry="2.5" fill="#D09060" opacity="0.3"/>
<path d="M95 127 C97 131 103 131 105 127" stroke="#D09060" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
<path d="M84 145 C88 140 94 138 100 140 C106 138 112 140 116 145" fill="#E06880" stroke="none"/>
<path d="M84 145 C88 155 112 155 116 145 C112 148 88 148 84 145 Z" fill="#8B2040"/>
<path d="M85 146 C89 152 111 152 115 146 L115 149 C111 153 89 153 85 149 Z" fill="white"/>
<line x1="100" y1="146" x2="100" y2="152" stroke="#F0E0E0" stroke-width="1"/>
<line x1="91" y1="147" x2="91" y2="152" stroke="#F0E0E0" stroke-width="1"/>
<line x1="109" y1="147" x2="109" y2="152" stroke="#F0E0E0" stroke-width="1"/>
<path d="M85 153 C92 161 108 161 115 153" stroke="#E87090" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
<ellipse cx="100" cy="156" rx="8" ry="3" fill="white" opacity="0.3"/>
<circle cx="84" cy="145" r="2" fill="#C05060" opacity="0.5"/>
<circle cx="116" cy="145" r="2" fill="#C05060" opacity="0.5"/>
</svg>`;
}
