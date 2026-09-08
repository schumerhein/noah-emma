import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type MeldingType = "nieuw_bericht" | "nieuw_bod" | "deal_gesloten";

// Bepaalt of gebruiker `userId` een e-mail mag krijgen voor meldingtype
// `type`. Standaard AAN: een ontbrekende instelling (nooit aangeraakt in de
// instellingenpagina) mag bestaande gebruikers niet stilzwijgend afsluiten
// van e-mail die al werkte — pas een expliciete "uit" telt.
export async function magEmailKrijgen(userId: string, type: MeldingType): Promise<boolean> {
  const { data: profiel } = await supabaseAdmin
    .from("profiles").select("notificatie_instellingen").eq("id", userId).single();
  const inst = (profiel?.notificatie_instellingen || {}) as Record<string, unknown>;
  if (inst.email_aan === false) return false;
  if (inst[type] === false) return false;
  return true;
}
