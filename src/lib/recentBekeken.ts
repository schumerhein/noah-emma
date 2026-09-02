const OPSLAGSLEUTEL_PREFIX = "noah-emma-recent-bekeken";
const MAX_ITEMS = 20;

// Bijgehouden per apparaat/browser (localStorage), niet in de database —
// dit is puur lokale kijkgeschiedenis, geen data die gedeeld hoeft te worden.
// Wel per userId opgeslagen: zonder dat zou op een gedeeld apparaat de ene
// gebruiker de kijkgeschiedenis van de vorige ingelogde gebruiker zien.
export function voegRecentBekekenToe(userId: string, listingId: string) {
  try {
    const huidig = leesRecentBekekenIds(userId);
    const nieuw = [listingId, ...huidig.filter(id => id !== listingId)].slice(0, MAX_ITEMS);
    localStorage.setItem(`${OPSLAGSLEUTEL_PREFIX}:${userId}`, JSON.stringify(nieuw));
  } catch {}
}

export function leesRecentBekekenIds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`${OPSLAGSLEUTEL_PREFIX}:${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
