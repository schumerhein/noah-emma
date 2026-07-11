import { NextResponse } from "next/server";
import { mollie, supabaseAdmin, haalGebruikerOp, BOOST_TIERS, type BoostTier } from "@/lib/mollie";

export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { listingId, tier } = await request.json();
  const gekozenTier = BOOST_TIERS[tier as BoostTier];
  if (!listingId || !gekozenTier) {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  // Alleen de eigenaar van de advertentie mag deze boosten.
  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select("id, titel, user_id")
    .eq("id", listingId)
    .eq("user_id", user.id)
    .single();
  if (!listing) {
    return NextResponse.json({ error: "Advertentie niet gevonden" }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const webhookUrl = origin.startsWith("https://") ? `${origin}/api/betalen/webhook` : undefined;

  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: gekozenTier.prijs.toFixed(2) },
    description: `Boost "${listing.titel}" — ${gekozenTier.naam} (${gekozenTier.dagen} dagen)`,
    redirectUrl: `${origin}/promote/${listingId}/bevestiging`,
    webhookUrl,
    metadata: { type: "boost", userId: user.id, listingId, tier },
  });

  await supabaseAdmin.from("betalingen").insert({
    mollie_payment_id: payment.id,
    user_id: user.id,
    type: "boost",
    listing_id: listingId,
    tier,
    bedrag: gekozenTier.prijs,
    status: "open",
  });

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl(), paymentId: payment.id });
}
