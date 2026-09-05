// Eén bron van waarheid voor prijzen, zodat server (Mollie-checkout) en
// client (modals, promotiepagina, FAQ, AI-assistent) nooit uit elkaar
// kunnen lopen. Geen server-only imports hier (zoals @mollie/api-client) —
// dit bestand moet ook veilig in client components te importeren zijn.
export const PREMIUM_PRIJS = 2.99;

export const BOOST_TIERS = {
  fast: { naam: "Snel", dagen: 3, prijs: 0.99 },
  popular: { naam: "Populair", dagen: 7, prijs: 2.99 },
  max: { naam: "Maximaal", dagen: 14, prijs: 4.99 },
} as const;

export type BoostTier = keyof typeof BOOST_TIERS;
