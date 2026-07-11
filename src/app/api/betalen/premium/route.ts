import { NextResponse } from "next/server";
import { SequenceType } from "@mollie/api-client";
import { mollie, supabaseAdmin, haalGebruikerOp, haalOfMaakMollieKlant, PREMIUM_PRIJS } from "@/lib/mollie";

export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("mollie_subscription_id")
    .eq("id", user.id)
    .single();
  if (profiel?.mollie_subscription_id) {
    return NextResponse.json({ error: "Je hebt al een lopend Premium-abonnement" }, { status: 400 });
  }

  const customerId = await haalOfMaakMollieKlant(user);

  const origin = new URL(request.url).origin;
  // Mollie accepteert alleen een https-webhookUrl. Lokaal (http://localhost)
  // laten we 'm weg — de bevestigingspagina rondt de betaling dan zelf af.
  const webhookUrl = origin.startsWith("https://") ? `${origin}/api/betalen/webhook` : undefined;

  // Eerste betaling: legt meteen de machtiging vast voor het doorlopende
  // abonnement (zie verwerkBetaling in src/lib/mollie.ts).
  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: PREMIUM_PRIJS.toFixed(2) },
    description: "Noah & Emma Premium (eerste maand)",
    redirectUrl: `${origin}/premium/bevestiging`,
    webhookUrl,
    customerId,
    sequenceType: SequenceType.first,
    metadata: { type: "premium", userId: user.id },
  });

  await supabaseAdmin.from("betalingen").insert({
    mollie_payment_id: payment.id,
    user_id: user.id,
    type: "premium",
    bedrag: PREMIUM_PRIJS,
    status: "open",
  });

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl(), paymentId: payment.id });
}
