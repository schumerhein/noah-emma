import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stuurEmail, emailSjabloon, escapeHtml } from "@/lib/email";
import { magEmailKrijgen } from "@/lib/notificatieVoorkeuren";

// Wordt aangeroepen door een Supabase Database Webhook op INSERT in
// "messages". Stuurt de ontvanger (niet de afzender) een e-mail dat er een
// nieuw bericht is.
export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const payload = await request.json();
  const bericht = payload.record;
  if (!bericht?.conversation_id || !bericht?.sender_id) {
    return NextResponse.json({ error: "Ongeldige payload" }, { status: 400 });
  }
  // Een bod stuurt zelf al een aparte "nieuw bod"-mail (via de biedingen-
  // webhook) — het bijbehorende chatbericht ("💸 Ik doe een bod van...")
  // hoeft dan niet ook nog eens een generieke "nieuw bericht"-mail te geven.
  if (typeof bericht.tekst === "string" && bericht.tekst.startsWith("💸 Ik doe een bod van")) {
    return NextResponse.json({ ok: true });
  }
  // Deal gesloten en "ik heb dit gekocht" krijgen een eigen mail (met
  // review- of bevestigknop) via /api/webhooks/reviews — niet dubbel mailen.
  if (typeof bericht.tekst === "string" && (bericht.tekst.startsWith("🎉 Deal gesloten") || bericht.tekst.startsWith("🛍️ Ik heb dit gekocht"))) {
    return NextResponse.json({ ok: true });
  }

  const { data: conversation } = await supabaseAdmin
    .from("conversations")
    .select("id, buyer_id, seller_id, listing_id, listings(titel)")
    .eq("id", bericht.conversation_id)
    .single();
  if (!conversation) return NextResponse.json({ ok: true });

  const ontvangerId = conversation.buyer_id === bericht.sender_id ? conversation.seller_id : conversation.buyer_id;

  const isDealGesloten = typeof bericht.tekst === "string" && bericht.tekst.startsWith("🎉 Deal gesloten");
  if (!(await magEmailKrijgen(ontvangerId, isDealGesloten ? "deal_gesloten" : "nieuw_bericht"))) {
    return NextResponse.json({ ok: true });
  }

  const { data: { user: ontvanger } } = await supabaseAdmin.auth.admin.getUserById(ontvangerId);
  if (!ontvanger?.email) return NextResponse.json({ ok: true });

  const { data: afzenderProfiel } = await supabaseAdmin.from("profiles").select("naam").eq("id", bericht.sender_id).single();
  const listing = conversation.listings as unknown as { titel: string } | null;
  // Namen en titels komen van gebruikers: escapen voor de HTML van de mail.
  const afzenderNaamRuw = afzenderProfiel?.naam || "Iemand";
  const afzenderNaam = escapeHtml(afzenderNaamRuw);
  const titel = listing?.titel ? escapeHtml(listing.titel) : null;
  const tekst = typeof bericht.tekst === "string" ? bericht.tekst.trim() : "";
  const citaat = tekst ? escapeHtml(tekst.length > 280 ? `${tekst.slice(0, 277)}…` : tekst) : undefined;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://noah-emma.nl";

  await stuurEmail({
    naar: ontvanger.email,
    onderwerp: isDealGesloten
      ? `Deal gesloten voor "${listing?.titel ?? "je advertentie"}"`
      : `${afzenderNaamRuw} heeft je een bericht gestuurd`,
    html: isDealGesloten
      ? emailSjabloon({
          titel: "Deal gesloten! 🎉",
          tekst: titel
            ? `${afzenderNaam} heeft de deal voor "${titel}" afgerond. Vergeet niet een review achter te laten.`
            : `${afzenderNaam} heeft jullie deal afgerond. Vergeet niet een review achter te laten.`,
          knopTekst: "Bekijk gesprek",
          knopUrl: `${origin}/messages/${conversation.id}`,
        })
      : emailSjabloon({
          titel: `Nieuw bericht van ${afzenderNaam}`,
          tekst: titel
            ? `${afzenderNaam} heeft je een bericht gestuurd over "${titel}".`
            : `${afzenderNaam} heeft je een bericht gestuurd.`,
          citaat,
          knopTekst: "Beantwoorden",
          knopUrl: `${origin}/messages/${conversation.id}`,
        }),
  });

  return NextResponse.json({ ok: true });
}
