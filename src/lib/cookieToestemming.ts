// Cookietoestemming: "alle" (ook analytische cookies) of "essentieel".
// Wordt gedeeld door de cookiemelding, de voorkeurenpagina en Google Analytics.
//
// Wat de AVG en de Telecommunicatiewet vragen, en hoe we dat doen:
// - geen analytische cookies vóór toestemming (GoogleAnalytics laadt pas na "alle");
// - weigeren is even makkelijk als accepteren (twee gelijke knoppen);
// - toestemming intrekken kan altijd (footerlink en /voorkeuren) en wist de _ga-cookies;
// - we bewaren wanneer en voor welke versie iemand koos, en vragen na 12 maanden opnieuw.
export type CookieKeuze = "alle" | "essentieel";

export const OPSLAGSLEUTEL = "noah-emma-cookievoorkeur";
/** Ophogen als er een nieuwe soort cookie bijkomt: iedereen krijgt de vraag dan opnieuw. */
const VERSIE = 1;
const GELDIG_MS = 365 * 24 * 60 * 60 * 1000;
const WIJZIGING_EVENT = "noah-emma-cookievoorkeur";
const OPEN_MELDING_EVENT = "noah-emma-cookiemelding-openen";

interface Opgeslagen {
  keuze: CookieKeuze;
  datum: string;
  versie: number;
}

export function leesCookieKeuze(): CookieKeuze | null {
  try {
    const ruw = localStorage.getItem(OPSLAGSLEUTEL);
    if (!ruw) return null;
    // Oude opslag (alleen "alle" of "essentieel", zonder datum): opnieuw vragen.
    const o = JSON.parse(ruw) as Partial<Opgeslagen>;
    if (o.keuze !== "alle" && o.keuze !== "essentieel") return null;
    if (o.versie !== VERSIE || !o.datum || Date.now() - Date.parse(o.datum) > GELDIG_MS) return null;
    return o.keuze;
  } catch {
    return null;
  }
}

export function bewaarCookieKeuze(keuze: CookieKeuze) {
  try {
    const o: Opgeslagen = { keuze, datum: new Date().toISOString(), versie: VERSIE };
    localStorage.setItem(OPSLAGSLEUTEL, JSON.stringify(o));
  } catch {
    // Opslag geblokkeerd (bv. privévenster): de keuze geldt dan alleen voor deze pagina.
  }
  if (keuze === "essentieel") verwijderAnalyseCookies();
  window.dispatchEvent(new CustomEvent<CookieKeuze>(WIJZIGING_EVENT, { detail: keuze }));
}

export function opCookieKeuze(cb: (k: CookieKeuze) => void) {
  const luister = (e: Event) => cb((e as CustomEvent<CookieKeuze>).detail);
  window.addEventListener(WIJZIGING_EVENT, luister);
  return () => window.removeEventListener(WIJZIGING_EVENT, luister);
}

/** Toont de cookiemelding opnieuw, bv. via de link "Cookie-instellingen" in de footer. */
export function openCookieMelding() {
  window.dispatchEvent(new Event(OPEN_MELDING_EVENT));
}

export function opOpenCookieMelding(cb: () => void) {
  window.addEventListener(OPEN_MELDING_EVENT, cb);
  return () => window.removeEventListener(OPEN_MELDING_EVENT, cb);
}

/** Wist de Google Analytics-cookies (_ga en _ga_*) op dit domein en op .noah-emma.nl. */
function verwijderAnalyseCookies() {
  const namen = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n === "_ga" || n.startsWith("_ga_"));
  const host = location.hostname;
  const domeinen = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const naam of namen) {
    for (const d of domeinen) {
      document.cookie = `${naam}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}
