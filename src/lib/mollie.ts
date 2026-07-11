import { createMollieClient } from "@mollie/api-client";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY! });

// Server-only client met volledige rechten (service role), voor het
// verwerken van betalingen los van de rechten van de ingelogde gebruiker.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const PREMIUM_PRIJS = 4.99;
const PREMIUM_INTERVAL = "1 month";

export const BOOST_TIERS = {
  fast: { naam: "Snel", dagen: 3, prijs: 2.99 },
  popular: { naam: "Populair", dagen: 7, prijs: 4.99 },
  max: { naam: "Maximaal", dagen: 14, prijs: 8.99 },
} as const;

export type BoostTier = keyof typeof BOOST_TIERS;

// Haalt de ingelogde gebruiker op basis van het Supabase-token dat de
// client meestuurt. Geeft null terug als het token ontbreekt of ongeldig is.
export async function haalGebruikerOp(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

// Geeft de bestaande Mollie-klant van deze gebruiker terug, of maakt er een aan.
export async function haalOfMaakMollieKlant(user: User): Promise<string> {
  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("mollie_customer_id")
    .eq("id", user.id)
    .single();

  if (profiel?.mollie_customer_id) return profiel.mollie_customer_id;

  const klant = await mollie.customers.create({
    name: user.email ?? user.id,
    email: user.email,
  });

  await supabaseAdmin
    .from("profiles")
    .update({ mollie_customer_id: klant.id })
    .eq("id", user.id);

  return klant.id;
}

// Verwerkt een betaalde Mollie-betaling. Idempotent — mag vaker aangeroepen
// worden voor dezelfde betaling (webhook én de bevestigingspagina roepen dit
// allebei aan).
//
// Twee gevallen:
// 1. Een betaling die wij zelf vooraf in `betalingen` hebben gezet (eerste
//    Premium-betaling die meteen de machtiging vastlegt, of een Boost).
// 2. Een vervolgbetaling van een lopend Mollie-abonnement — die betaling
//    bestaat niet in onze tabel (Mollie maakt 'm zelf aan), maar is te
//    herkennen aan het customerId + subscriptionId op de betaling.
export async function verwerkBetaling(molliePaymentId: string) {
  const payment = await mollie.payments.get(molliePaymentId);

  const { data: betaling } = await supabaseAdmin
    .from("betalingen")
    .select("*")
    .eq("mollie_payment_id", molliePaymentId)
    .single();

  // Geval 2: onbekende betaling, maar hoort bij een lopend abonnement.
  if (!betaling) {
    if (payment.status !== "paid" || !payment.subscriptionId || !payment.customerId) {
      return { status: "onbekend" as const };
    }
    const { data: profiel } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("mollie_customer_id", payment.customerId)
      .eq("mollie_subscription_id", payment.subscriptionId)
      .single();
    if (!profiel) return { status: "onbekend" as const };

    await verlengPremium(profiel.id);
    await supabaseAdmin.from("betalingen").insert({
      mollie_payment_id: molliePaymentId,
      user_id: profiel.id,
      type: "premium",
      bedrag: PREMIUM_PRIJS,
      status: "paid",
      betaald_op: new Date().toISOString(),
    });
    return { status: "paid" as const };
  }

  if (betaling.status === "paid") return { status: "paid" as const };
  if (payment.status !== "paid") return { status: payment.status };

  await supabaseAdmin
    .from("betalingen")
    .update({ status: "paid", betaald_op: new Date().toISOString() })
    .eq("mollie_payment_id", molliePaymentId);

  if (betaling.type === "premium") {
    await verlengPremium(betaling.user_id);

    // Eerste betaling van een nieuw abonnement: nu de machtiging vastligt
    // (payment.mandateId), het doorlopende abonnement bij Mollie aanmaken.
    if (payment.sequenceType === "first" && payment.mandateId && payment.customerId) {
      const abonnement = await mollie.customerSubscriptions.create({
        customerId: payment.customerId,
        mandateId: payment.mandateId,
        amount: { currency: "EUR", value: PREMIUM_PRIJS.toFixed(2) },
        interval: PREMIUM_INTERVAL,
        description: "Noah & Emma Premium",
      });
      await supabaseAdmin
        .from("profiles")
        .update({ mollie_subscription_id: abonnement.id })
        .eq("id", betaling.user_id);
    }
  }

  if (betaling.type === "boost" && betaling.listing_id) {
    const tier = BOOST_TIERS[betaling.tier as BoostTier];
    const verloopdatum = new Date();
    verloopdatum.setDate(verloopdatum.getDate() + (tier?.dagen ?? 7));
    await supabaseAdmin
      .from("listings")
      .update({ gepromoot: true, promotie_verloopdatum: verloopdatum.toISOString() })
      .eq("id", betaling.listing_id);
  }

  return { status: "paid" as const };
}

async function verlengPremium(userId: string) {
  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("premium_verloopdatum")
    .eq("id", userId)
    .single();

  // Verleng vanaf de huidige vervaldatum als die nog in de toekomst ligt
  // (voorkomt verlies van resterende dagen bij een vroege incasso),
  // anders vanaf nu.
  const basis = profiel?.premium_verloopdatum && new Date(profiel.premium_verloopdatum) > new Date()
    ? new Date(profiel.premium_verloopdatum)
    : new Date();
  basis.setMonth(basis.getMonth() + 1);

  await supabaseAdmin
    .from("profiles")
    .update({ is_premium: true, premium_verloopdatum: basis.toISOString() })
    .eq("id", userId);
}

// Zegt het lopende abonnement op bij Mollie. Premium blijft actief tot de
// al betaalde vervaldatum, maar wordt daarna niet meer automatisch verlengd.
export async function zegAbonnementOp(userId: string) {
  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("mollie_customer_id, mollie_subscription_id")
    .eq("id", userId)
    .single();

  if (!profiel?.mollie_customer_id || !profiel?.mollie_subscription_id) {
    return { error: "Geen actief abonnement gevonden" };
  }

  await mollie.customerSubscriptions.cancel(profiel.mollie_subscription_id, {
    customerId: profiel.mollie_customer_id,
  });

  await supabaseAdmin
    .from("profiles")
    .update({ mollie_subscription_id: null })
    .eq("id", userId);

  return { ok: true };
}
