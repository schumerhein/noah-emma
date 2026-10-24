export const SIGNUP_URL = "/login?mode=register";
export const LOGIN_URL = "/login";
export const SITE_URL = "https://noah-emma.nl";

export interface MenuItem {
  label: string;
  href: string;
}

// De vijf hoofdpagina's van de marketingsite (header en footer).
export const HOOFDMENU: MenuItem[] = [
  { label: "Kinderkleding", href: "/kinderkleding" },
  { label: "Accessoires", href: "/accessoires" },
  { label: "Hoe het werkt", href: "/hoe-het-werkt" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Helpcentrum", href: "/helpcentrum" },
];

export const FOOTER_EXTRA: MenuItem[] = [
  { label: "2e hands kinderkleding", href: "/2e-hands-kinderkleding" },
  { label: "Privacy", href: "/privacy" },
  { label: "Voorwaarden", href: "/voorwaarden" },
  { label: "Cookies", href: "/cookies" },
];

// Paden die als volwaardige website worden getoond (zonder telefoonframe).
export const MARKETING_PATHS = ["/landing", "/2e-hands-kinderkleding", ...HOOFDMENU.map((m) => m.href)];
