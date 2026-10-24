export const SIGNUP_URL = "/login?mode=register";
export const LOGIN_URL = "/login";
// Het hoofddomein: noah-emma.nl stuurt bij Vercel met een 301 door naar www.
export const SITE_URL = "https://www.noah-emma.nl";

/** Deelafbeelding (1200x630) voor WhatsApp, Facebook en andere socials. */
export const OG_AFBEELDING = { url: "/images/og-noah-emma.png", width: 1200, height: 630, alt: "Noah & Emma: tweedehands voor je kind, altijd in de juiste maat" };

export interface MenuItem {
  label: string;
  href: string;
  /** Subpagina's, getoond in een uitklapmenu. */
  sub?: MenuItem[];
}

// Het hoofdmenu van de marketingsite. Het hoofditem zelf is klikbaar; Kinderkleding
// en Accessoires klappen uit met kopen en verkopen, Over ons met de veelgestelde vragen.
export const HOOFDMENU: MenuItem[] = [
  {
    label: "Kinderkleding",
    href: "/kinderkleding",
    sub: [
      { label: "Kinderkleding kopen", href: "/kinderkleding/kopen" },
      { label: "Kinderkleding verkopen", href: "/kinderkleding/verkopen" },
    ],
  },
  {
    label: "Accessoires",
    href: "/accessoires",
    sub: [
      { label: "Kinderaccessoires kopen", href: "/accessoires/kopen" },
      { label: "Kinderaccessoires verkopen", href: "/accessoires/verkopen" },
    ],
  },
  { label: "Hoe het werkt", href: "/hoe-het-werkt" },
  {
    label: "Over ons",
    href: "/over-ons",
    sub: [
      { label: "Veelgestelde vragen", href: "/veelgestelde-vragen" },
    ],
  },
];

/** Alle pagina's uit het hoofdmenu, zonder dubbele (voor de footer). */
export const MENU_PAGINAS: MenuItem[] = HOOFDMENU.flatMap(({ sub, ...m }) => [m, ...(sub ?? [])]);

/** Social-mediakanalen, in de footer en als sameAs in de JSON-LD van de organisatie. */
export const SOCIALS = [
  { naam: "Instagram", href: "https://www.instagram.com/noah_emma_kinderkleding/" },
  { naam: "TikTok", href: "https://www.tiktok.com/@noah_emma_kinderkleding" },
  { naam: "Facebook", href: "https://www.facebook.com/1424061760784280" },
] as const;

export const FOOTER_EXTRA: MenuItem[] = [
  { label: "Inloggen", href: LOGIN_URL },
  { label: "2e hands kinderkleding", href: "/2e-hands-kinderkleding" },
  { label: "Privacy", href: "/privacy" },
  { label: "Voorwaarden", href: "/voorwaarden" },
  { label: "Cookies", href: "/cookies" },
  { label: "Communityrichtlijnen", href: "/community" },
  { label: "Wettelijke informatie", href: "/wettelijk" },
];

// Paden die als volwaardige website worden getoond (zonder telefoonframe).
export const JURIDISCHE_PADEN = ["/privacy", "/voorwaarden", "/cookies", "/community", "/wettelijk"];

export const MARKETING_PATHS = ["/landing", "/2e-hands-kinderkleding", ...MENU_PAGINAS.map((m) => m.href), ...JURIDISCHE_PADEN];
