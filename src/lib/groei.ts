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

/** Verwachte kledingmaat bij een leeftijd (gemiddelde groeicurve) */
export function schatMaatOpLeeftijd(maanden: number): string {
  if (maanden <= 1) return "50";
  if (maanden <= 3) return "56";
  if (maanden <= 6) return "62";
  if (maanden <= 9) return "68";
  if (maanden <= 12) return "74";
  if (maanden <= 18) return "80";
  if (maanden <= 24) return "86";
  if (maanden <= 36) return "92";
  if (maanden <= 48) return "98";
  if (maanden <= 60) return "104";
  if (maanden <= 72) return "110";
  if (maanden <= 84) return "116";
  if (maanden <= 96) return "122";
  if (maanden <= 108) return "128";
  if (maanden <= 120) return "134";
  if (maanden <= 132) return "140";
  if (maanden <= 144) return "146";
  if (maanden <= 156) return "152";
  return "158/164";
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
