// Cookietoestemming: "alle" (ook analytische cookies) of "essentieel".
// Wordt gedeeld door de cookiemelding, de voorkeurenpagina en Google Analytics.
export type CookieKeuze = "alle" | "essentieel";

export const OPSLAGSLEUTEL = "noah-emma-cookievoorkeur";
const WIJZIGING_EVENT = "noah-emma-cookievoorkeur";

export function leesCookieKeuze(): CookieKeuze | null {
  try {
    const k = localStorage.getItem(OPSLAGSLEUTEL);
    return k === "alle" || k === "essentieel" ? k : null;
  } catch {
    return null;
  }
}

export function bewaarCookieKeuze(k: CookieKeuze) {
  try {
    localStorage.setItem(OPSLAGSLEUTEL, k);
  } catch {
    // Opslag geblokkeerd (bv. privévenster): de keuze geldt dan alleen voor deze pagina.
  }
  window.dispatchEvent(new CustomEvent<CookieKeuze>(WIJZIGING_EVENT, { detail: k }));
}

export function opCookieKeuze(cb: (k: CookieKeuze) => void) {
  const luister = (e: Event) => cb((e as CustomEvent<CookieKeuze>).detail);
  window.addEventListener(WIJZIGING_EVENT, luister);
  return () => window.removeEventListener(WIJZIGING_EVENT, luister);
}
