/**
 * Groeifunctie — de maat van een kindprofiel groeit mee met de leeftijd.
 *
 * Gebaseerd op de gemiddelde Nederlandse groeicurve: kledingmaat ≈ lichaamslengte.
 * De app vergelijkt de verwachte maat (uit de geboortedatum) met de ingestelde
 * maat en stelt een update voor zodra het kind eruit gegroeid is.
 */

export const GROEI_MAATLIJST = ["50", "56", "62", "68", "74", "80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158/164"];

/** Leeftijd in maanden op basis van de geboortedatum */
export function leeftijdInMaanden(geboortedatum: string): number {
  const geb = new Date(geboortedatum);
  const nu = new Date();
  return Math.max(0, (nu.getFullYear() - geb.getFullYear()) * 12 + (nu.getMonth() - geb.getMonth()));
}

/**
 * Verwachte kledingmaat bij een leeftijd.
 * Gebaseerd op de gemiddelde lengte van Nederlandse kinderen
 * (maat = lichaamslengte in cm, afgerond naar de eerstvolgende maat):
 * geboorte ±50 cm, 1 jaar ±76 cm, 2 jaar ±88 cm, 4 jaar ±104 cm,
 * 6 jaar ±119 cm, 8 jaar ±131 cm, 10 jaar ±142 cm, 12 jaar ±155 cm.
 */
export function schatMaatOpLeeftijd(maanden: number): string {
  if (maanden <= 1) return "50";    // pasgeboren ±50 cm
  if (maanden <= 2) return "56";
  if (maanden <= 4) return "62";
  if (maanden <= 6) return "68";    // half jaar ±67 cm
  if (maanden <= 9) return "74";
  if (maanden <= 12) return "80";   // 1 jaar ±76 cm
  if (maanden <= 18) return "86";
  if (maanden <= 24) return "92";   // 2 jaar ±88 cm
  if (maanden <= 36) return "98";
  if (maanden <= 48) return "104";  // 4 jaar ±104 cm
  if (maanden <= 60) return "110";
  if (maanden <= 72) return "116";  // 6 jaar ±119 cm → 116/122
  if (maanden <= 84) return "122";
  if (maanden <= 96) return "128";  // 8 jaar ±131 cm
  if (maanden <= 108) return "134";
  if (maanden <= 120) return "140"; // 10 jaar ±142 cm
  if (maanden <= 132) return "146";
  if (maanden <= 144) return "152"; // 12 jaar ±155 cm
  return "158/164";
}

/**
 * Geschatte lichaamslengte (cm) bij een maat.
 * Kledingmaat ≈ lengte; bij "158/164" nemen we 160.
 */
export function lengteBijMaat(maat: string): number {
  if (maat === "158/164") return 160;
  const n = parseInt(maat, 10);
  return Number.isFinite(n) ? n : 86;
}

/**
 * Controleer of een kind uit zijn ingestelde maat gegroeid is.
 * Retourneert de verwachte maat als die GROTER is dan de huidige, anders null.
 * (We stellen nooit een kleinere maat voor — ouders weten het zelf het best.)
 */
export function groeiCheck(geboortedatum: string | null, huidigeMaat: string | null): string | null {
  if (!geboortedatum || !huidigeMaat) return null;
  const verwacht = schatMaatOpLeeftijd(leeftijdInMaanden(geboortedatum));
  const huidigeIdx = GROEI_MAATLIJST.indexOf(huidigeMaat);
  const verwachteIdx = GROEI_MAATLIJST.indexOf(verwacht);
  if (huidigeIdx < 0 || verwachteIdx < 0) return null;
  return verwachteIdx > huidigeIdx ? verwacht : null;
}
