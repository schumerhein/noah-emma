import { GROEI_MAATLIJST } from "@/lib/groei";

// Categorieën voor feed-personalisatie, met de subcategorie-strings
// (src/app/sell/page.tsx CATEGORY_HIERARCHY) die als match tellen. Jongens-
// en meisjeskleding gebruiken soms net andere namen voor hetzelfde
// kledingstuk (bv. "T-shirts & Tops" vs "T-shirts & Poloshirts") — daarom
// een match-array per categorie in plaats van te proberen die te unificeren.
export const FEED_CATEGORIEEN = [
  { id: "jassen", label: "Jassen & Vesten", emoji: "🧥", match: ["Jassen & Vesten"] },
  { id: "truien", label: "Truien & Sweaters", emoji: "🧶", match: ["Truien & Sweaters"] },
  { id: "tops", label: "T-shirts & Tops", emoji: "👕", match: ["T-shirts & Tops", "T-shirts & Poloshirts"] },
  { id: "broeken", label: "Broeken & Shorts", emoji: "👖", match: ["Broeken & Leggings", "Broeken & Shorts"] },
  { id: "zwemkleding", label: "Zwemkleding", emoji: "🩱", match: ["Zwemkleding & Badpakken", "Zwemkleding"] },
  { id: "pyama", label: "Pyjama & Ondergoed", emoji: "🌙", match: ["Pyjama & Ondergoed"] },
  { id: "schoenen", label: "Schoenen & Laarzen", emoji: "👟", match: ["Schoenen & Laarzen"] },
  { id: "sokken", label: "Sokken & Kousen", emoji: "🧦", match: ["Sokken & Kousen", "Sokken"] },
  { id: "feest", label: "Feest & Gala", emoji: "🎀", match: ["Feest & Galakleding"] },
  { id: "sport", label: "Sportkleding", emoji: "⚽", match: ["Sportkleding"] },
  { id: "mutsen", label: "Mutsen & Sjaals", emoji: "🧣", match: ["Mutsen & Sjaals"] },
] as const;

export const FEED_MATEN = GROEI_MAATLIJST;

export const FEED_MERKEN = [
  "H&M", "Zara Kids", "Next", "Hema", "Name It",
  "Molo", "Petit Bateau", "Noppies", "Prenatal", "Boden",
  "Tommy Hilfiger Kids", "Nike Kids", "Adidas Kids", "Scotch & Soda",
];

export type FeedVoorkeuren = {
  categorieen: string[]; // FEED_CATEGORIEEN ids
  maten: string[]; // GROEI_MAATLIJST waarden
  merken: string[]; // FEED_MERKEN waarden
};

export const LEGE_FEED_VOORKEUREN: FeedVoorkeuren = { categorieen: [], maten: [], merken: [] };

// Score hoe goed een advertentie bij de voorkeuren past (0 = geen match).
// Gebruikt als zachte ranking-boost in de ontdekfeed — geen harde filter,
// dus een gebruiker mist nooit advertenties buiten zijn voorkeuren.
export function scoreVoorkeurMatch(
  listing: { subcategorie?: string | null; maat?: string | null; merk?: string | null },
  voorkeuren: FeedVoorkeuren
): number {
  let score = 0;
  if (listing.subcategorie && voorkeuren.categorieen.length) {
    const matcht = voorkeuren.categorieen.some(id => {
      const cat = FEED_CATEGORIEEN.find(c => c.id === id);
      return (cat?.match as readonly string[] | undefined)?.includes(listing.subcategorie as string);
    });
    if (matcht) score += 1;
  }
  if (listing.maat && voorkeuren.maten.includes(listing.maat)) score += 1;
  if (listing.merk && voorkeuren.merken.includes(listing.merk)) score += 1;
  return score;
}
