import { leesCookieKeuze } from "@/lib/cookieToestemming";

// Eigen gebeurtenissen voor Google Analytics (GA4). Alles loopt via
// meetGebeurtenis, dat alleen meet als de bezoeker analytische cookies heeft
// toegestaan en GA dus geladen is. Zonder toestemming gebeurt er niets.
//
// Gebeurtenissen:
// - sign_up       account aangemaakt (in GA markeren als belangrijke gebeurtenis)
// - mailto_click  klik op een e-maillink (mailto:)

type Gtag = (...args: unknown[]) => void;

export function meetGebeurtenis(naam: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined" || leesCookieKeuze() !== "alle") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", naam, params);
}

/**
 * Meet een klik op een mailto-link. Persoonsgegevens gaan nooit naar Google:
 * we sturen alleen onze eigen adressen mee (op /admin staan bv. adressen van
 * gebruikers).
 */
export function meetLinkKlik(a: HTMLAnchorElement) {
  const href = a.getAttribute("href") ?? "";
  if (!href.startsWith("mailto:")) return;
  const adres = href.slice(7).split("?")[0].toLowerCase();
  meetGebeurtenis("mailto_click", { email_adres: adres.endsWith("@noah-emma.nl") ? adres : undefined });
}
