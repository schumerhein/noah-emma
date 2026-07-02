'use client';

/**
 * 3D-stijl hoofd+schouders SVG-generators voor Noah en Emma.
 * Ontworpen voor compositing: avatar op kleding-foto plaatsen.
 * Formaat: 400×220 viewBox, volledig transparante achtergrond.
 */

export function getNoahHeadSvg(
  width: number,
  height: number,
  uid: string = Math.random().toString(36).slice(2),
): string {
  const n = `n${uid}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- Lichtere, Pixar-stijl huidkleur -->
  <radialGradient id="${n}sk" cx="38%" cy="32%" r="68%">
    <stop offset="0%" stop-color="#FFE4C0"/>
    <stop offset="40%" stop-color="#F5C090"/>
    <stop offset="100%" stop-color="#C07840"/>
  </radialGradient>
  <!-- Donkerbruin krullend haar -->
  <radialGradient id="${n}hr" cx="35%" cy="25%" r="75%">
    <stop offset="0%" stop-color="#7A4A20"/>
    <stop offset="50%" stop-color="#3A1E08"/>
    <stop offset="100%" stop-color="#1A0C04"/>
  </radialGradient>
  <!-- Haar highlight voor krullen -->
  <radialGradient id="${n}hh" cx="40%" cy="25%" r="60%">
    <stop offset="0%" stop-color="#9A6030"/>
    <stop offset="100%" stop-color="#3A1E08"/>
  </radialGradient>
  <!-- Donkerbruine iris -->
  <radialGradient id="${n}ir" cx="30%" cy="30%" r="70%">
    <stop offset="0%" stop-color="#7A5030"/>
    <stop offset="55%" stop-color="#3A1808"/>
    <stop offset="100%" stop-color="#1A0804"/>
  </radialGradient>
  <!-- Oogwit -->
  <radialGradient id="${n}er" cx="45%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#FFFFFF"/>
    <stop offset="100%" stop-color="#F0EDE8"/>
  </radialGradient>
  <!-- Blauwe trui -->
  <linearGradient id="${n}sh" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#29B6F6"/>
    <stop offset="100%" stop-color="#0277BD"/>
  </linearGradient>
  <!-- Nek -->
  <linearGradient id="${n}nk" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#C88040"/>
    <stop offset="45%" stop-color="#F0C080"/>
    <stop offset="100%" stop-color="#C88040"/>
  </linearGradient>
  <!-- Brillenglas tint -->
  <linearGradient id="${n}gl" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="rgba(180,220,255,0.30)"/>
    <stop offset="100%" stop-color="rgba(140,190,240,0.15)"/>
  </linearGradient>
</defs>

<!-- ===== HAAR ACHTERLAAG ===== -->
<!-- Grote haarmassa achter hoofd -->
<ellipse cx="200" cy="88" rx="92" ry="98" fill="url(#${n}hr)"/>
<!-- Krullen bulk bovenop -->
<ellipse cx="200" cy="45" rx="78" ry="68" fill="url(#${n}hr)"/>
<!-- Zijkanten haar -->
<ellipse cx="114" cy="102" rx="30" ry="46" fill="url(#${n}hr)"/>
<ellipse cx="286" cy="102" rx="30" ry="46" fill="url(#${n}hr)"/>

<!-- Individuele krullen bovenop (Pixar-stijl) -->
<circle cx="148" cy="42" r="24" fill="url(#${n}hh)"/>
<circle cx="172" cy="27" r="22" fill="url(#${n}hh)"/>
<circle cx="200" cy="22" r="25" fill="url(#${n}hh)"/>
<circle cx="228" cy="27" r="22" fill="url(#${n}hh)"/>
<circle cx="252" cy="42" r="24" fill="url(#${n}hh)"/>
<!-- Krullen iets donkerder voor diepte -->
<circle cx="148" cy="42" r="16" fill="url(#${n}hr)"/>
<circle cx="172" cy="27" r="15" fill="url(#${n}hr)"/>
<circle cx="200" cy="22" r="17" fill="url(#${n}hr)"/>
<circle cx="228" cy="27" r="15" fill="url(#${n}hr)"/>
<circle cx="252" cy="42" r="16" fill="url(#${n}hr)"/>
<!-- Haar highlight reflectie -->
<ellipse cx="183" cy="38" rx="30" ry="18" fill="rgba(255,255,255,0.09)" transform="rotate(-10 183 38)"/>

<!-- ===== OREN ===== -->
<ellipse cx="115" cy="108" rx="16" ry="20" fill="#E0A060"/>
<ellipse cx="285" cy="108" rx="16" ry="20" fill="#E0A060"/>
<ellipse cx="115" cy="108" rx="10" ry="13" fill="#C08040"/>
<ellipse cx="285" cy="108" rx="10" ry="13" fill="#C08040"/>

<!-- ===== GEZICHT ===== -->
<ellipse cx="200" cy="108" rx="82" ry="86" fill="url(#${n}sk)"/>
<!-- 3D shading kin -->
<ellipse cx="200" cy="180" rx="55" ry="18" fill="rgba(150,80,20,0.16)"/>
<!-- Lichte highlight wang links -->
<ellipse cx="162" cy="94" rx="24" ry="16" fill="rgba(255,230,180,0.22)" transform="rotate(-15 162 94)"/>
<ellipse cx="238" cy="94" rx="24" ry="16" fill="rgba(255,230,180,0.22)" transform="rotate(15 238 94)"/>

<!-- ===== WENKBRAUWEN ===== -->
<path d="M148 84 Q165 76 184 82" stroke="#2A1406" stroke-width="5.5" stroke-linecap="round" fill="none"/>
<path d="M216 82 Q235 76 252 84" stroke="#2A1406" stroke-width="5.5" stroke-linecap="round" fill="none"/>

<!-- ===== OGEN (groter, Pixar-proportie) ===== -->
<!-- Linkeroog wit -->
<ellipse cx="172" cy="103" rx="23" ry="19" fill="url(#${n}er)"/>
<!-- Iris links -->
<circle cx="172" cy="105" r="14" fill="url(#${n}ir)"/>
<circle cx="172" cy="105" r="9" fill="#1A0C04"/>
<!-- Pupil -->
<circle cx="173" cy="106" r="6" fill="#060402"/>
<!-- Highlight -->
<circle cx="178" cy="99" r="4.5" fill="white"/>
<circle cx="167" cy="110" r="2" fill="rgba(255,255,255,0.5)"/>
<!-- Ooglid lijn boven -->
<path d="M149 96 Q163 89 172 88 Q181 89 195 96" stroke="#1A0C06" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- Ooglid lijn onder -->
<path d="M150 110 Q172 116 194 110" stroke="rgba(100,55,18,0.25)" stroke-width="1.5" fill="none"/>

<!-- Rechteroog wit -->
<ellipse cx="228" cy="103" rx="23" ry="19" fill="url(#${n}er)"/>
<!-- Iris rechts -->
<circle cx="228" cy="105" r="14" fill="url(#${n}ir)"/>
<circle cx="228" cy="105" r="9" fill="#1A0C04"/>
<circle cx="229" cy="106" r="6" fill="#060402"/>
<circle cx="234" cy="99" r="4.5" fill="white"/>
<circle cx="223" cy="110" r="2" fill="rgba(255,255,255,0.5)"/>
<path d="M205 96 Q219 89 228 88 Q237 89 251 96" stroke="#1A0C06" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M206 110 Q228 116 250 110" stroke="rgba(100,55,18,0.25)" stroke-width="1.5" fill="none"/>

<!-- ===== NEUS ===== -->
<path d="M200 118 Q195 128 192 131" stroke="rgba(150,75,20,0.25)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M200 118 Q205 128 208 131" stroke="rgba(150,75,20,0.25)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<ellipse cx="194" cy="133" rx="5" ry="3.5" fill="rgba(130,65,18,0.25)"/>
<ellipse cx="206" cy="133" rx="5" ry="3.5" fill="rgba(130,65,18,0.25)"/>

<!-- ===== MOND ===== -->
<path d="M184 146 Q192 140 200 142 Q208 140 216 146" fill="#D08060"/>
<path d="M182 147 Q200 164 218 147" stroke="#8C2818" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M186 149 Q200 158 214 149 Q200 162 186 149" fill="rgba(255,255,255,0.75)"/>
<!-- Kuiltjes -->
<circle cx="179" cy="151" r="3.5" fill="rgba(190,85,55,0.22)"/>
<circle cx="221" cy="151" r="3.5" fill="rgba(190,85,55,0.22)"/>

<!-- ===== WANGEN BLOS ===== -->
<ellipse cx="148" cy="125" rx="22" ry="14" fill="rgba(230,110,90,0.22)"/>
<ellipse cx="252" cy="125" rx="22" ry="14" fill="rgba(230,110,90,0.22)"/>

<!-- ===== BRIL (grote 3D-stijl bril) ===== -->
<!-- Bril glazen tint (achter frame) -->
<rect x="144" y="87" width="52" height="38" rx="11" fill="url(#${n}gl)"/>
<rect x="204" y="87" width="52" height="38" rx="11" fill="url(#${n}gl)"/>
<!-- Frame links -->
<rect x="144" y="87" width="52" height="38" rx="11" stroke="#2A2A2A" stroke-width="4.5" fill="none"/>
<!-- Frame rechts -->
<rect x="204" y="87" width="52" height="38" rx="11" stroke="#2A2A2A" stroke-width="4.5" fill="none"/>
<!-- Brug tussen glazen -->
<path d="M196 106 Q200 103 204 106" stroke="#2A2A2A" stroke-width="4" stroke-linecap="round" fill="none"/>
<!-- Linker poot (brilpoot) -->
<line x1="144" y1="103" x2="116" y2="102" stroke="#2A2A2A" stroke-width="4" stroke-linecap="round"/>
<!-- Rechter poot -->
<line x1="256" y1="103" x2="284" y2="102" stroke="#2A2A2A" stroke-width="4" stroke-linecap="round"/>
<!-- Lens highlight (reflectie) -->
<path d="M150 93 Q158 90 166 93" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
<path d="M210 93 Q218 90 226 93" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round" fill="none"/>

<!-- ===== HAAR VOORKANT (over voorhoofd) ===== -->
<path d="M124 80 Q140 52 164 45 Q182 40 200 42 Q218 40 236 45 Q260 52 276 80" fill="url(#${n}hr)"/>
<!-- Haar overlappende krullen voorkant -->
<circle cx="148" cy="62" r="18" fill="url(#${n}hh)"/>
<circle cx="168" cy="52" r="15" fill="url(#${n}hh)"/>
<circle cx="252" cy="62" r="18" fill="url(#${n}hh)"/>
<circle cx="232" cy="52" r="15" fill="url(#${n}hh)"/>
<!-- Detail glans haar -->
<path d="M168 56 Q182 47 197 49" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>
<path d="M203 49 Q218 47 232 56" stroke="rgba(255,255,255,0.1)" stroke-width="2.5" fill="none"/>

<!-- ===== NEK ===== -->
<rect x="178" y="187" width="44" height="34" rx="10" fill="url(#${n}nk)"/>
<ellipse cx="200" cy="187" rx="22" ry="7" fill="rgba(0,0,0,0.12)"/>

<!-- ===== SCHOUDERS (blauwe trui) ===== -->
<path d="M0 220 L0 205 Q62 178 136 191 Q158 196 178 207 L178 220 Z" fill="url(#${n}sh)"/>
<path d="M400 220 L400 205 Q338 178 264 191 Q242 196 222 207 L222 220 Z" fill="url(#${n}sh)"/>
<!-- Kraag -->
<path d="M178 207 Q189 218 200 220 Q211 218 222 207" stroke="#0255A0" stroke-width="2.5" fill="url(#${n}sh)"/>
<!-- Trui glans/plooien -->
<path d="M80 208 Q130 200 178 207" stroke="rgba(255,255,255,0.12)" stroke-width="2" fill="none"/>
<path d="M320 208 Q270 200 222 207" stroke="rgba(255,255,255,0.12)" stroke-width="2" fill="none"/>
<!-- Schouder schaduw -->
<ellipse cx="100" cy="212" rx="46" ry="12" fill="rgba(0,10,50,0.12)" transform="rotate(-5 100 212)"/>
<ellipse cx="300" cy="212" rx="46" ry="12" fill="rgba(0,10,50,0.12)" transform="rotate(5 300 212)"/>
</svg>`;
}

/**
 * Achterkant van Noah's hoofd+schouders (400×220 viewBox).
 * Geen gezichtskenmerken — haar vanuit de rug, nek, blauwe schouders.
 */
export function getNoahBackSvg(
  width: number,
  height: number,
  uid: string = Math.random().toString(36).slice(2),
): string {
  const n = `nb${uid}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="${n}hr" cx="50%" cy="30%" r="70%">
    <stop offset="0%" stop-color="#7A5030"/>
    <stop offset="45%" stop-color="#3D2010"/>
    <stop offset="100%" stop-color="#180C04"/>
  </radialGradient>
  <radialGradient id="${n}cr" cx="50%" cy="20%" r="80%">
    <stop offset="0%" stop-color="#9A6840"/>
    <stop offset="100%" stop-color="#3D2010"/>
  </radialGradient>
  <linearGradient id="${n}sh" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#5A8AC8"/>
    <stop offset="100%" stop-color="#3060A0"/>
  </linearGradient>
  <linearGradient id="${n}nk" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#C88040"/>
    <stop offset="45%" stop-color="#E0A870"/>
    <stop offset="100%" stop-color="#C88040"/>
  </linearGradient>
</defs>

<!-- Haar massa (achterkant hoofd) -->
<ellipse cx="200" cy="95" rx="90" ry="96" fill="url(#${n}hr)"/>
<!-- Kruin volume -->
<ellipse cx="200" cy="52" rx="70" ry="60" fill="url(#${n}cr)"/>
<!-- Haar zijkanten naar beneden -->
<ellipse cx="118" cy="115" rx="28" ry="48" fill="url(#${n}hr)"/>
<ellipse cx="282" cy="115" rx="28" ry="48" fill="url(#${n}hr)"/>

<!-- Haar hoofd contour (ronde achterkant) -->
<ellipse cx="200" cy="108" rx="80" ry="83" fill="url(#${n}hr)"/>

<!-- Haar-richtingslijnen vanuit kruin -->
<path d="M200 55 Q172 78 148 112" stroke="rgba(255,255,255,0.055)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 55 Q188 82 182 115" stroke="rgba(255,255,255,0.055)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 55 Q200 82 200 118" stroke="rgba(255,255,255,0.06)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 55 Q212 82 218 115" stroke="rgba(255,255,255,0.055)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 55 Q228 78 252 112" stroke="rgba(255,255,255,0.055)" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- Haar kruin textuur -->
<path d="M186 50 Q192 42 200 45 Q208 42 214 50" stroke="rgba(255,255,255,0.08)" stroke-width="2.5" fill="none"/>

<!-- Kruin glans (licht van bovenaf) -->
<ellipse cx="200" cy="62" rx="32" ry="22" fill="rgba(255,255,255,0.07)" transform="rotate(-5 200 62)"/>

<!-- Kleine oorrand zichtbaar van achteren -->
<ellipse cx="122" cy="108" rx="9" ry="12" fill="#C88040"/>
<ellipse cx="278" cy="108" rx="9" ry="12" fill="#C88040"/>

<!-- Onderkant hoofd schaduw -->
<ellipse cx="200" cy="178" rx="55" ry="18" fill="rgba(0,0,0,0.2)"/>

<!-- Nek (achterkant) -->
<rect x="176" y="186" width="48" height="35" rx="10" fill="url(#${n}nk)"/>
<!-- Nek schaduw bovenaan -->
<ellipse cx="200" cy="186" rx="24" ry="8" fill="rgba(0,0,0,0.18)"/>
<!-- Subtiele nek-lijn (ruggengraad hint) -->
<path d="M200 188 Q200 205 200 220" stroke="rgba(150,80,30,0.15)" stroke-width="2" fill="none"/>

<!-- Schouders (achterkant blauwe trui) -->
<path d="M0 220 L0 205 Q60 178 135 191 Q158 196 176 207 L176 220 Z" fill="url(#${n}sh)"/>
<path d="M400 220 L400 205 Q340 178 265 191 Q242 196 224 207 L224 220 Z" fill="url(#${n}sh)"/>
<!-- Kraag achterkant (ronde hals) -->
<path d="M176 207 Q188 215 200 216 Q212 215 224 207" stroke="#2850A0" stroke-width="2.5" fill="url(#${n}sh)"/>
<!-- Trui naad/rib hint op schouder -->
<path d="M120 198 Q160 196 176 207" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
<path d="M280 198 Q240 196 224 207" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
<!-- Schouder schaduw -->
<ellipse cx="100" cy="212" rx="45" ry="12" fill="rgba(0,0,50,0.12)" transform="rotate(-5 100 212)"/>
<ellipse cx="300" cy="212" rx="45" ry="12" fill="rgba(0,0,50,0.12)" transform="rotate(5 300 212)"/>
</svg>`;
}

/**
 * Achterkant van Emma's hoofd+schouders (400×220 viewBox).
 * Staartjes zichtbaar van achteren, roze schouders.
 */
export function getEmmaBackSvg(
  width: number,
  height: number,
  uid: string = Math.random().toString(36).slice(2),
): string {
  const n = `eb${uid}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="${n}hr" cx="50%" cy="28%" r="72%">
    <stop offset="0%" stop-color="#D4A060"/>
    <stop offset="48%" stop-color="#9A6428"/>
    <stop offset="100%" stop-color="#6A4018"/>
  </radialGradient>
  <radialGradient id="${n}cr" cx="50%" cy="22%" r="78%">
    <stop offset="0%" stop-color="#E0B878"/>
    <stop offset="100%" stop-color="#9A6428"/>
  </radialGradient>
  <linearGradient id="${n}sh" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#F280A8"/>
    <stop offset="100%" stop-color="#CC4878"/>
  </linearGradient>
  <linearGradient id="${n}nk" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#D49060"/>
    <stop offset="45%" stop-color="#EFBB88"/>
    <stop offset="100%" stop-color="#D49060"/>
  </linearGradient>
  <radialGradient id="${n}ht" cx="40%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#F080A0"/>
    <stop offset="100%" stop-color="#C03060"/>
  </radialGradient>
</defs>

<!-- Haar massa (achterkant) -->
<ellipse cx="200" cy="88" rx="88" ry="90" fill="url(#${n}hr)"/>
<!-- Kruin -->
<ellipse cx="200" cy="50" rx="62" ry="55" fill="url(#${n}cr)"/>

<!-- Linker staartje (van achteren zichtbaar) -->
<ellipse cx="105" cy="118" rx="34" ry="60" fill="url(#${n}hr)" transform="rotate(-10 105 118)"/>
<!-- Staartje uiteinde links -->
<ellipse cx="100" cy="165" rx="20" ry="18" fill="url(#${n}hr)"/>
<!-- Elastiek links (van achteren) -->
<ellipse cx="110" cy="133" rx="11" ry="9" fill="url(#${n}ht)"/>

<!-- Rechter staartje (van achteren zichtbaar) -->
<ellipse cx="295" cy="118" rx="34" ry="60" fill="url(#${n}hr)" transform="rotate(10 295 118)"/>
<ellipse cx="300" cy="165" rx="20" ry="18" fill="url(#${n}hr)"/>
<ellipse cx="290" cy="133" rx="11" ry="9" fill="url(#${n}ht)"/>

<!-- Hoofd contour achterkant -->
<ellipse cx="200" cy="106" rx="79" ry="83" fill="url(#${n}hr)"/>

<!-- Haar richtingslijnen -->
<path d="M200 52 Q168 78 140 110" stroke="rgba(255,245,210,0.07)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 52 Q188 80 183 115" stroke="rgba(255,245,210,0.07)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 52 Q200 80 200 118" stroke="rgba(255,245,210,0.08)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 52 Q212 80 217 115" stroke="rgba(255,245,210,0.07)" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M200 52 Q232 78 260 110" stroke="rgba(255,245,210,0.07)" stroke-width="3" fill="none" stroke-linecap="round"/>
<!-- Middenpad van achteren zichtbaar -->
<path d="M200 45 Q199 65 198 88" stroke="rgba(180,120,50,0.2)" stroke-width="2.5" fill="none"/>

<!-- Haar glans kruin -->
<ellipse cx="200" cy="62" rx="30" ry="20" fill="rgba(255,245,200,0.09)" transform="rotate(-5 200 62)"/>

<!-- Kleine oorrand -->
<ellipse cx="123" cy="106" rx="9" ry="12" fill="#D09858"/>
<ellipse cx="277" cy="106" rx="9" ry="12" fill="#D09858"/>

<!-- Onderkant hoofd schaduw -->
<ellipse cx="200" cy="176" rx="52" ry="17" fill="rgba(0,0,0,0.18)"/>

<!-- Nek -->
<rect x="178" y="184" width="44" height="36" rx="10" fill="url(#${n}nk)"/>
<ellipse cx="200" cy="184" rx="22" ry="7" fill="rgba(0,0,0,0.14)"/>
<path d="M200 186 Q200 203 200 220" stroke="rgba(150,90,30,0.12)" stroke-width="2" fill="none"/>

<!-- Schouders (achterkant roze truitje) -->
<path d="M0 220 L0 206 Q58 180 134 192 Q158 196 178 208 L178 220 Z" fill="url(#${n}sh)"/>
<path d="M400 220 L400 206 Q342 180 266 192 Q242 196 222 208 L222 220 Z" fill="url(#${n}sh)"/>
<!-- Kraag achterkant -->
<path d="M178 208 Q189 215 200 216 Q211 215 222 208" stroke="#A02858" stroke-width="2.5" fill="url(#${n}sh)"/>
<path d="M120 198 Q158 196 178 208" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
<path d="M280 198 Q242 196 222 208" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
<ellipse cx="100" cy="212" rx="44" ry="12" fill="rgba(80,0,30,0.10)" transform="rotate(-5 100 212)"/>
<ellipse cx="300" cy="212" rx="44" ry="12" fill="rgba(80,0,30,0.10)" transform="rotate(5 300 212)"/>
</svg>`;
}

export function getEmmaHeadSvg(
  width: number,
  height: number,
  uid: string = Math.random().toString(36).slice(2),
): string {
  const n = `e${uid}`;

  return `<svg width="${width}" height="${height}" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <radialGradient id="${n}sk" cx="38%" cy="30%" r="70%">
    <stop offset="0%" stop-color="#FDE8C0"/>
    <stop offset="42%" stop-color="#EFBB88"/>
    <stop offset="100%" stop-color="#B07838"/>
  </radialGradient>
  <radialGradient id="${n}hr" cx="38%" cy="28%" r="72%">
    <stop offset="0%" stop-color="#DDB878"/>
    <stop offset="48%" stop-color="#A06830"/>
    <stop offset="100%" stop-color="#6A4018"/>
  </radialGradient>
  <radialGradient id="${n}ir" cx="30%" cy="32%" r="68%">
    <stop offset="0%" stop-color="#92D0E8"/>
    <stop offset="55%" stop-color="#4898B8"/>
    <stop offset="100%" stop-color="#286078"/>
  </radialGradient>
  <radialGradient id="${n}er" cx="50%" cy="45%" r="55%">
    <stop offset="0%" stop-color="#FFFEF8"/>
    <stop offset="100%" stop-color="#EEE8DC"/>
  </radialGradient>
  <linearGradient id="${n}sh" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#F280A8"/>
    <stop offset="100%" stop-color="#CC4878"/>
  </linearGradient>
  <linearGradient id="${n}nk" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#D49060"/>
    <stop offset="45%" stop-color="#EFBB88"/>
    <stop offset="100%" stop-color="#D49060"/>
  </linearGradient>
  <radialGradient id="${n}ht" cx="40%" cy="40%" r="60%">
    <stop offset="0%" stop-color="#F080A0"/>
    <stop offset="100%" stop-color="#C03060"/>
  </radialGradient>
</defs>

<!-- Haar achter hoofd -->
<ellipse cx="200" cy="88" rx="88" ry="92" fill="url(#${n}hr)"/>
<!-- Haar boven (volume) -->
<ellipse cx="200" cy="50" rx="65" ry="55" fill="url(#${n}hr)"/>

<!-- Linker vlechtje/staartje -->
<ellipse cx="108" cy="115" rx="32" ry="58" fill="url(#${n}hr)" transform="rotate(-8 108 115)"/>
<ellipse cx="108" cy="162" rx="20" ry="15" fill="url(#${n}hr)"/>
<!-- Elastiekje links -->
<ellipse cx="112" cy="130" rx="10" ry="8" fill="url(#${n}ht)"/>

<!-- Rechter vlechtje/staartje -->
<ellipse cx="292" cy="115" rx="32" ry="58" fill="url(#${n}hr)" transform="rotate(8 292 115)"/>
<ellipse cx="292" cy="162" rx="20" ry="15" fill="url(#${n}hr)"/>
<!-- Elastiekje rechts -->
<ellipse cx="288" cy="130" rx="10" ry="8" fill="url(#${n}ht)"/>

<!-- Oren -->
<ellipse cx="116" cy="106" rx="15" ry="19" fill="#DDA060"/>
<ellipse cx="284" cy="106" rx="15" ry="19" fill="#DDA060"/>
<ellipse cx="116" cy="106" rx="9" ry="12" fill="#BF8848"/>
<ellipse cx="284" cy="106" rx="9" ry="12" fill="#BF8848"/>

<!-- Gezicht/hoofd -->
<ellipse cx="200" cy="106" rx="79" ry="85" fill="url(#${n}sk)"/>

<!-- Gezichtsdiepte -->
<ellipse cx="200" cy="174" rx="52" ry="18" fill="rgba(160,90,30,0.15)"/>
<!-- Jukbeen highlights -->
<ellipse cx="164" cy="94" rx="23" ry="15" fill="rgba(255,225,175,0.22)" transform="rotate(-15 164 94)"/>
<ellipse cx="236" cy="94" rx="23" ry="15" fill="rgba(255,225,175,0.22)" transform="rotate(15 236 94)"/>

<!-- Wenkbrauwen (fijner, meer gebogen voor meisje) -->
<path d="M156 82 Q171 74 187 80" stroke="#7A4820" stroke-width="4" stroke-linecap="round" fill="none"/>
<path d="M213 80 Q229 74 244 82" stroke="#7A4820" stroke-width="4" stroke-linecap="round" fill="none"/>

<!-- Linkeroog (groter, expressief) -->
<ellipse cx="172" cy="102" rx="19" ry="15" fill="url(#${n}er)"/>
<path d="M153 95 Q172 88 191 95" fill="rgba(170,100,40,0.18)"/>
<circle cx="172" cy="102" r="11" fill="url(#${n}ir)"/>
<circle cx="172" cy="102" r="6.5" fill="#040608"/>
<circle cx="178" cy="97" r="3.5" fill="white"/>
<circle cx="168" cy="107" r="1.8" fill="rgba(255,255,255,0.6)"/>
<!-- Wimpers (langer voor Emma) -->
<path d="M153 95 Q163 89 172 87 Q181 89 191 95" stroke="#150A04" stroke-width="2.8" fill="none" stroke-linecap="round"/>
<line x1="157" y1="96" x2="153" y2="91" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="165" y1="93" x2="163" y2="88" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="172" y1="91" x2="172" y2="86" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="180" y1="93" x2="181" y2="88" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="187" y1="96" x2="189" y2="91" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<path d="M153 109 Q172 115 191 109" stroke="rgba(90,50,18,0.28)" stroke-width="1.5" fill="none"/>

<!-- Rechteroog -->
<ellipse cx="228" cy="102" rx="19" ry="15" fill="url(#${n}er)"/>
<path d="M209 95 Q228 88 247 95" fill="rgba(170,100,40,0.18)"/>
<circle cx="228" cy="102" r="11" fill="url(#${n}ir)"/>
<circle cx="228" cy="102" r="6.5" fill="#040608"/>
<circle cx="234" cy="97" r="3.5" fill="white"/>
<circle cx="224" cy="107" r="1.8" fill="rgba(255,255,255,0.6)"/>
<path d="M209 95 Q219 89 228 87 Q237 89 247 95" stroke="#150A04" stroke-width="2.8" fill="none" stroke-linecap="round"/>
<line x1="213" y1="96" x2="209" y2="91" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="221" y1="93" x2="219" y2="88" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="228" y1="91" x2="228" y2="86" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="236" y1="93" x2="237" y2="88" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<line x1="243" y1="96" x2="247" y2="91" stroke="#1C0D06" stroke-width="1.8" stroke-linecap="round"/>
<path d="M209 109 Q228 115 247 109" stroke="rgba(90,50,18,0.28)" stroke-width="1.5" fill="none"/>

<!-- Neus (delicaat) -->
<path d="M200 114 Q195 124 192 128" stroke="rgba(150,80,25,0.25)" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M200 114 Q205 124 208 128" stroke="rgba(150,80,25,0.25)" stroke-width="2" fill="none" stroke-linecap="round"/>
<ellipse cx="193" cy="130" rx="4.5" ry="3.5" fill="rgba(120,60,20,0.22)"/>
<ellipse cx="207" cy="130" rx="4.5" ry="3.5" fill="rgba(120,60,20,0.22)"/>

<!-- Mond (koraalrood) -->
<path d="M186 143 Q192 137 200 139 Q208 137 214 143" fill="#D07080" stroke="none"/>
<path d="M184 144 Q200 160 216 144" stroke="#902040" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M188 146 Q200 154 212 146 Q200 158 188 146" fill="rgba(255,255,255,0.7)"/>
<ellipse cx="200" cy="152" rx="6" ry="2" fill="rgba(255,255,255,0.25)"/>
<circle cx="181" cy="148" r="3" fill="rgba(190,80,60,0.2)"/>
<circle cx="219" cy="148" r="3" fill="rgba(190,80,60,0.2)"/>

<!-- Wangen blos (uitgesproken voor Emma) -->
<ellipse cx="148" cy="122" rx="20" ry="13" fill="rgba(230,100,85,0.22)"/>
<ellipse cx="252" cy="122" rx="20" ry="13" fill="rgba(230,100,85,0.22)"/>

<!-- Haar voorkant over voorhoofd -->
<path d="M128 76 Q144 49 165 43 Q182 38 200 40 Q218 38 235 43 Q256 49 272 76" fill="url(#${n}hr)" stroke="none"/>
<path d="M168 48 Q182 40 198 42" stroke="rgba(255,245,220,0.1)" stroke-width="2.5" fill="none"/>
<path d="M202 42 Q218 40 232 48" stroke="rgba(255,245,220,0.1)" stroke-width="2.5" fill="none"/>
<!-- Middenpad hint -->
<path d="M200 40 Q198 52 197 65" stroke="rgba(180,120,60,0.2)" stroke-width="2" fill="none"/>
<!-- Haar glans -->
<ellipse cx="184" cy="58" rx="28" ry="18" fill="rgba(255,245,200,0.1)" transform="rotate(-12 184 58)"/>

<!-- Nek -->
<rect x="178" y="184" width="44" height="36" rx="10" fill="url(#${n}nk)"/>
<ellipse cx="200" cy="184" rx="22" ry="7" fill="rgba(0,0,0,0.10)"/>

<!-- Schouders (roze truitje) -->
<path d="M0 220 L0 206 Q58 180 134 192 Q158 196 178 208 L178 220 Z" fill="url(#${n}sh)"/>
<path d="M400 220 L400 206 Q342 180 266 192 Q242 196 222 208 L222 220 Z" fill="url(#${n}sh)"/>
<!-- Kraag -->
<path d="M178 208 Q189 218 200 220 Q211 218 222 208" stroke="#A02858" stroke-width="2.5" fill="url(#${n}sh)"/>
<!-- Schouder schaduw -->
<ellipse cx="100" cy="212" rx="44" ry="12" fill="rgba(80,0,30,0.10)" transform="rotate(-5 100 212)"/>
<ellipse cx="300" cy="212" rx="44" ry="12" fill="rgba(80,0,30,0.10)" transform="rotate(5 300 212)"/>
</svg>`;
}
