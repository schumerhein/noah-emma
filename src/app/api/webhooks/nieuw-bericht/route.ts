import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stuurEmail, emailSjabloon } from "@/lib/email";

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

  const { data: conversation } = await supabaseAdmin
    .from("conversations")
    .select("id, buyer_id, seller_id, listing_id, listings(titel)")
    .eq("id", bericht.conversation_id)
    .single();
  if (!conversation) return NextResponse.json({ ok: true });

  const ontvangerId = conversation.buyer_id === bericht.sender_id ? conversation.seller_id : conversation.buyer_id;
  const { data: { user: ontvanger } } = await supabaseAdmin.auth.admin.getUserById(ontvangerId);
  if (!ontvanger?.email) return NextResponse.json({ ok: true });

  const { data: afzenderProfiel } = await supabaseAdmin.from("profiles").select("naam").eq("id", bericht.sender_id).single();
  const listing = conversation.listings as unknown as { titel: string } | null;
  const afzenderNaam = afzenderProfiel?.naam || "Iemand";
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://noah-emma.nl";

  await stuurEmail({
    naar: ontvanger.email,
    onderwerp: `${afzenderNaam} heeft je een bericht gestuurd`,
    html: emailSjabloon({
      titel: `Nieuw bericht van ${afzenderNaam}`,
      tekst: listing?.titel
        ? `${afzenderNaam} heeft je een bericht gestuurd over "${listing.titel}".`
        : `${afzenderNaam} heeft je een bericht gestuurd.`,
      knopTekst: "Bekijk gesprek",
      knopUrl: `${origin}/messages/${conversation.id}`,
    }),
  });

  return NextResponse.json({ ok: true });
}
