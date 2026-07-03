import { supabase } from "@/lib/supabase";

// Item dat gemodereerd en gefilterd kan worden
type ZichtbaarItem = {
  user_id?: string;
  moderatie_status?: string;
};

// Haal de ids op van gebruikers die de ingelogde gebruiker geblokkeerd heeft
export async function haalGeblokkeerdeIds(): Promise<Set<string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase
    .from("blocks")
    .select("geblokkeerd_id")
    .eq("blokkeerder_id", user.id);
  return new Set((data || []).map((b: { geblokkeerd_id: string }) => b.geblokkeerd_id));
}

// Filter een lijst listings op zichtbaarheid:
// - alleen goedgekeurde advertenties (eigen advertenties altijd zichtbaar voor de eigenaar)
// - geen advertenties van geblokkeerde gebruikers
// Werkt ook als de moderatie-kolom (nog) niet bestaat in de database.
export function filterZichtbaar<T extends ZichtbaarItem>(
  items: T[],
  geblokkeerdeIds: Set<string>,
  eigenUserId?: string | null
): T[] {
  return items.filter(item => {
    const status = item.moderatie_status;
    const moderatieOk = status === undefined || status === null || status === "goedgekeurd" || item.user_id === eigenUserId;
    const nietGeblokkeerd = !(item.user_id && geblokkeerdeIds.has(item.user_id));
    return moderatieOk && nietGeblokkeerd;
  });
}
