export const SIGNUP_URL = "/login?mode=register";
export const LOGIN_URL = "/login";

export interface MenuItem {
  label: string;
  href: string;
}

// De vijf hoofdpagina's van de marketingsite. Kinderkleding en Accessoires
// verwijzen voorlopig naar het categorieblok; zodra die pagina's bestaan
// kunnen de links hier worden aangepast.
export const HOOFDMENU: MenuItem[] = [
  { label: "Kinderkleding", href: "#categorieen" },
  { label: "Accessoires", href: "#categorieen" },
  { label: "Hoe het werkt", href: "#hoe-het-werkt" },
  { label: "Over ons", href: "/over" },
  { label: "Helpcentrum", href: "/helpdesk" },
];
