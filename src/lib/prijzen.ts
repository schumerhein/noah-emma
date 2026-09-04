// Eén bron van waarheid voor de Premium-prijs, zodat server (Mollie-checkout)
// en client (PremiumModal, FAQ, AI-assistent) nooit uit elkaar kunnen lopen.
// Geen server-only imports hier (zoals @mollie/api-client) — dit bestand
// moet ook veilig in client components te importeren zijn.
export const PREMIUM_PRIJS = 2.99;
