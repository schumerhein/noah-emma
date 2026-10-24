/**
 * Exporteert de Noah & Emma SVG's uit de app naar losse bestanden in marketing/assets,
 * zodat banners en video's exact dezelfde figuren gebruiken als de app.
 * Draaien vanuit de projectroot: npx tsx marketing/scripts/exporteer-avatars.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getFullBodySvg } from "../../src/lib/avatarFullBodySvg";

const root = join(__dirname, "../..");
const assets = join(__dirname, "../assets");

// Full-body avatars (maat 104 ≈ 3-4 jaar)
for (const naam of ["noah", "emma"] as const) {
  // Witruimte rond het figuur wegsnijden, zodat het schaalt als een losse afbeelding
  const svg = getFullBodySvg(naam, "104", { uid: naam }).replace(
    /viewBox="0 0 300 460" width="300" height="460"/,
    'viewBox="60 100 180 362"'
  );
  if (!svg.includes('viewBox="60 100')) throw new Error(`${naam}: viewBox niet gevonden`);
  writeFileSync(join(assets, `${naam}-body.svg`), svg);
}

// Meegroei-reeks: zelfde canvas en grondlijn, dus naast elkaar zie je ze echt groeien
export const GROEI_MATEN = ["62", "86", "116", "146"];
for (const naam of ["noah", "emma"] as const) {
  for (const maat of GROEI_MATEN) {
    const svg = getFullBodySvg(naam, maat, { uid: `${naam}${maat}` }).replace(
      /viewBox="0 0 300 460" width="300" height="460"/,
      'viewBox="50 0 200 462"'
    );
    writeFileSync(join(assets, `${naam}-groei-${maat}.svg`), svg);
  }
}

// Gezichten uit de logo-component (JSX → kale SVG)
const tsx = readFileSync(join(root, "src/components/ai-models/NoahEmmaFaces.tsx"), "utf8");
for (const [comp, naam] of [["NoahFace", "noah"], ["EmmaFace", "emma"]]) {
  const start = tsx.indexOf(`export function ${comp}`);
  const svgStart = tsx.indexOf("<svg", start);
  const svgEind = tsx.indexOf("</svg>", svgStart) + 6;
  const svg = tsx
    .slice(svgStart, svgEind)
    .replace(/width=\{size\}/, 'width="200"')
    .replace(/height=\{size\}/, 'height="200"')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  if (/[{}]/.test(svg)) throw new Error(`${comp}: onverwachte JSX-expressie`);
  writeFileSync(join(assets, `${naam}-face.svg`), svg);
}
console.log("Avatars geëxporteerd naar", assets);
