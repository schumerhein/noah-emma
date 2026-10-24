import { NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { beoordeelAdvertentie, beschrijfFout } from "@/lib/aiModeratie";
import { meldAfkeuring } from "@/lib/afkeurMelding";

// Wordt aangeroepen door een Supabase Database Webhook (zie ai-moderatie.sql)
// zodra een advertentie op 'wachtend' komt te staan: bij plaatsen, bij nieuwe
// foto's en bij aanpassen na afkeuring. De AI keurt goed, keurt af, of laat
// de advertentie bij twijfel in de handmatige wachtrij staan.
//
// Lukt de beoordeling niet (bv. Gemini te druk omdat er veel advertenties
// tegelijk binnenkwamen), dan stuurt pg_cron elke 2 minuten
// {"taak":"opnieuw"} en probeert deze route het een paar advertenties per
// keer opnieuw (zie ai-moderatie-opnieuw-proberen.sql).
export const maxDuration = 60;

const VELDEN = "id, titel, beschrijving, prijs, categorie, subcategorie, maat, conditie, merk, foto_urls, moderatie_status";

// Moet gelijk blijven aan de grens in ai-moderatie-opnieuw-proberen.sql.
// Drukte bij Gemini (429/5xx/time-out) telt niet als poging: dat gaat vanzelf
// over, dus de herhaalronde blijft het dan proberen. Andere fouten (bv. een
// foto die niet te openen is) wel; na MAX_POGINGEN kijkt een admin ernaar.
const MAX_POGINGEN = 6;
const PER_RONDE = 6;
// Na deze tijd geen nieuwe advertentie meer oppakken in een ronde, zodat de
// laatste ruim binnen maxDuration klaar is (en rondes elkaar niet overlappen).
const RONDE_BUDGET_MS = 25_000;
const MINUUT = 60_000;

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (payload?.taak === "opnieuw") {
    after(() => herhaalronde());
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const listingId: unknown = payload?.record?.id;
  if (typeof listingId !== "string") {
    return NextResponse.json({ error: "Geen advertentie in payload" }, { status: 400 });
  }

  // Meteen antwoorden: de database-webhook wacht maar een paar seconden, de
  // AI-beoordeling kan langer duren en loopt daarom op de achtergrond door.
  after(() => modereer(listingId));
  return NextResponse.json({ ok: true }, { status: 202 });
}

// Advertenties die nog wachten op de AI: een eerdere poging mislukte, of de
// webhook kwam nooit aan (dan staat ai_oordeel na 5 minuten nog leeg).
async function herhaalronde() {
  const start = Date.now();
  const sinds = (minuten: number) => `"${new Date(start - minuten * MINUUT).toISOString()}"`;
  const { data: achterstand, error } = await supabaseAdmin
    .from("listings")
    .select("id")
    .eq("moderatie_status", "wachtend")
    .lt("ai_pogingen", MAX_POGINGEN)
    .or(`and(ai_oordeel.eq.fout,ai_beoordeeld_op.lt.${sinds(2)}),and(ai_oordeel.is.null,ai_wacht_sinds.lt.${sinds(5)})`)
    .order("ai_wacht_sinds", { ascending: true })
    .limit(PER_RONDE);
  if (error) {
    console.error("AI-moderatie herhaalronde: ophalen mislukt", error);
    return;
  }

  for (const { id } of achterstand || []) {
    if (Date.now() - start > RONDE_BUDGET_MS) break;
    // Is Gemini nog steeds te druk, dan de rest bewaren voor de volgende ronde.
    if ((await modereer(id)) === "te druk") break;
  }
}

async function modereer(listingId: string): Promise<"klaar" | "mislukt" | "te druk"> {
  // Altijd de actuele versie lezen, niet de (mogelijk verouderde) payload.
  const { data: advertentie } = await supabaseAdmin.from("listings").select(VELDEN).eq("id", listingId).single();
  if (!advertentie || advertentie.moderatie_status !== "wachtend") return "klaar";

  let resultaat;
  try {
    resultaat = await beoordeelAdvertentie(advertentie);
  } catch (e) {
    console.error("AI-moderatie mislukt:", listingId, e);
    const { oorzaak, teDruk } = beschrijfFout(e);
    const { data: stand } = await supabaseAdmin.from("listings").select("ai_pogingen").eq("id", listingId).single();
    const pogingen = (stand?.ai_pogingen ?? 0) + (teDruk ? 0 : 1);
    // Blijft 'wachtend': de herhaalronde probeert het opnieuw, en na
    // MAX_POGINGEN beoordeelt een admin hem handmatig.
    await supabaseAdmin
      .from("listings")
      .update({
        ai_oordeel: "fout",
        ai_pogingen: pogingen,
        ai_toelichting: (pogingen < MAX_POGINGEN
          ? `AI-controle mislukt (${oorzaak}), wordt over een paar minuten automatisch opnieuw geprobeerd.`
          : `AI-controle ${pogingen}x mislukt (${oorzaak}), handmatig beoordelen.`
        ).slice(0, 300),
        ai_beoordeeld_op: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("moderatie_status", "wachtend");
    return teDruk ? "te druk" : "mislukt";
  }

  // Is de advertentie tijdens de beoordeling aangepast (andere foto's of
  // tekst) of al door een admin afgehandeld? Dan dit oordeel niet toepassen;
  // een aanpassing start vanzelf een nieuwe beoordeling.
  const { data: actueel } = await supabaseAdmin.from("listings").select(VELDEN).eq("id", listingId).single();
  if (!actueel || actueel.moderatie_status !== "wachtend" || JSON.stringify(actueel) !== JSON.stringify(advertentie)) return "klaar";

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

  const { data: opgeslagen, error } = await supabaseAdmin
    .from("listings")
    .update(wijziging)
    .eq("id", listingId)
    .eq("moderatie_status", "wachtend")
    .select("id");
  if (error) {
    console.error("AI-moderatie opslaan mislukt:", listingId, error);
    return "mislukt";
  }
  if (resultaat.oordeel === "afkeuren" && opgeslagen?.length) await meldAfkeuring(listingId);
  return "klaar";
}
