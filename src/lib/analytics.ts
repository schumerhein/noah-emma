import { leesCookieKeuze } from "@/lib/cookieToestemming";

// Eigen gebeurtenissen voor Google Analytics (GA4). Alles loopt via
// meetGebeurtenis, dat alleen meet als de bezoeker analytische cookies heeft
// toegestaan en GA dus geladen is. Zonder toestemming gebeurt er niets.
//
// Gebeurtenissen:
// - sign_up            account aangemaakt (in GA markeren als belangrijke gebeurtenis)
// - mailto_click       klik op een e-maillink
// - tel_click          klik op een telefoonlink
// - sign_up_cta_click  klik op een "Account aanmaken"-knop of -link
// - login_cta_click    klik op een "Inloggen"-link
// Uitgaande links (naar andere websites) meet GA zelf al als "click".

type Gtag = (...args: unknown[]) => void;

export function meetGebeurtenis(naam: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined" || leesCookieKeuze() !== "alle") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", naam, params);
}

/** Zichtbare linktekst (innerText slaat verborgen mobiel/desktop-varianten over), max. 100 tekens. */
function linkTekst(a: HTMLAnchorElement) {
  return (a.innerText || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100) || undefined;
}

/**
 * Bepaalt of een klik op een link een eigen gebeurtenis is. Persoonsgegevens
 * gaan nooit naar Google: van e-maillinks sturen we alleen onze eigen adressen
 * mee (op /admin staan bv. adressen van gebruikers).
 */
export function meetLinkKlik(a: HTMLAnchorElement) {
  const href = a.getAttribute("href") ?? "";

  if (href.startsWith("mailto:")) {
    const adres = href.slice(7).split("?")[0].toLowerCase();
    meetGebeurtenis("mailto_click", { email_adres: adres.endsWith("@noah-emma.nl") ? adres : undefined });
    return;
  }
  if (href.startsWith("tel:")) {
    meetGebeurtenis("tel_click");
    return;
  }

  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return;
  }
  if (url.origin !== location.origin || url.pathname !== "/login") return;
  const naam = url.searchParams.get("mode") === "register" ? "sign_up_cta_click" : "login_cta_click";
  meetGebeurtenis(naam, { link_text: linkTekst(a), link_url: url.pathname + url.search });
}
