export const SIGNUP_URL = "/login?mode=register";
export const LOGIN_URL = "/login";
// Het hoofddomein: noah-emma.nl stuurt bij Vercel met een 301 door naar www.
export const SITE_URL = "https://www.noah-emma.nl";

export interface MenuItem {
  label: string;
  href: string;
  /** Subpagina's, getoond in een uitklapmenu. */
  sub?: MenuItem[];
}

// Het hoofdmenu van de marketingsite. Over ons klapt uit met de
// veelgestelde vragen (de pagina /helpcentrum).
export const HOOFDMENU: MenuItem[] = [
  { label: "Kinderkleding", href: "/kinderkleding" },
  { label: "Accessoires", href: "/accessoires" },
  { label: "Hoe het werkt", href: "/hoe-het-werkt" },
  {
    label: "Over ons",
    href: "/over-ons",
    sub: [
      { label: "Over Noah & Emma", href: "/over-ons" },
      { label: "Veelgestelde vragen", href: "/helpcentrum" },
    ],
  },
];

/** Alle pagina's uit het hoofdmenu, zonder dubbele (voor de footer). */
export const MENU_PAGINAS: MenuItem[] = HOOFDMENU.flatMap((m) => m.sub ?? [m]);

export const FOOTER_EXTRA: MenuItem[] = [
  { label: "Inloggen", href: LOGIN_URL },
  { label: "2e hands kinderkleding", href: "/2e-hands-kinderkleding" },
  { label: "Privacy", href: "/privacy" },
  { label: "Voorwaarden", href: "/voorwaarden" },
  { label: "Cookies", href: "/cookies" },
];

// Paden die als volwaardige website worden getoond (zonder telefoonframe).
export const MARKETING_PATHS = ["/landing", "/2e-hands-kinderkleding", ...MENU_PAGINAS.map((m) => m.href)];
