import { NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { beoordeelAdvertentie } from "@/lib/aiModeratie";

// Wordt aangeroepen door een Supabase Database Webhook (zie ai-moderatie.sql)
// zodra een advertentie op 'wachtend' komt te staan: bij plaatsen, bij nieuwe
// foto's en bij aanpassen na afkeuring. De AI keurt goed, keurt af, of laat
// de advertentie bij twijfel in de handmatige wachtrij staan.
export const maxDuration = 60;

const VELDEN = "id, titel, beschrijving, prijs, categorie, subcategorie, maat, conditie, merk, foto_urls, moderatie_status";

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const listingId: unknown = payload?.record?.id;
  if (typeof listingId !== "string") {
    return NextResponse.json({ error: "Geen advertentie in payload" }, { status: 400 });
  }

  // Meteen antwoorden: de database-webhook wacht maar een paar seconden, de
  // AI-beoordeling kan langer duren en loopt daarom op de achtergrond door.
  after(() => modereer(listingId));
  return NextResponse.json({ ok: true }, { status: 202 });
}

async function modereer(listingId: string) {
  // Altijd de actuele versie lezen, niet de (mogelijk verouderde) payload.
  const { data: advertentie } = await supabaseAdmin.from("listings").select(VELDEN).eq("id", listingId).single();
  if (!advertentie || advertentie.moderatie_status !== "wachtend") return;

  let resultaat;
  try {
    resultaat = await beoordeelAdvertentie(advertentie);
  } catch (e) {
    console.error("AI-moderatie mislukt:", listingId, e);
    // Blijft 'wachtend' — een admin beoordeelt hem handmatig.
    await supabaseAdmin
      .from("listings")
      .update({ ai_oordeel: "fout", ai_toelichting: "AI-controle mislukt, handmatig beoordelen.", ai_beoordeeld_op: new Date().toISOString() })
      .eq("id", listingId);
    return;
  }

  // Is de advertentie tijdens de beoordeling aangepast (andere foto's of
  // tekst) of al door een admin afgehandeld? Dan dit oordeel niet toepassen;
  // een aanpassing start vanzelf een nieuwe beoordeling.
  const { data: actueel } = await supabaseAdmin.from("listings").select(VELDEN).eq("id", listingId).single();
  if (!actueel || actueel.moderatie_status !== "wachtend" || JSON.stringify(actueel) !== JSON.stringify(advertentie)) return;

  const aiVelden = {
    ai_oordeel: resultaat.oordeel,
    ai_toelichting: resultaat.toelichting.slice(0, 300),
    ai_beoordeeld_op: new Date().toISOString(),
  };
  const wijziging =
    resultaat.oordeel === "goedkeuren"
      ? { ...aiVelden, moderatie_status: "goedgekeurd", moderatie_reden: null }
      : resultaat.oordeel === "afkeuren"
        ? {
            ...aiVelden,
            moderatie_status: "afgekeurd",
            moderatie_reden: (resultaat.redenVerkoper || "Je advertentie voldoet niet aan onze regels.").slice(0, 200),
            actief: false,
          }
        : aiVelden;

  const { error } = await supabaseAdmin
    .from("listings")
    .update(wijziging)
    .eq("id", listingId)
    .eq("moderatie_status", "wachtend");
  if (error) console.error("AI-moderatie opslaan mislukt:", listingId, error);
}
