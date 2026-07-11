import { NextResponse } from "next/server";
import { haalGebruikerOp, supabaseAdmin } from "@/lib/mollie";

export async function GET(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("is_premium, premium_verloopdatum, mollie_subscription_id")
    .eq("id", user.id)
    .single();

  const premiumActief = !!profiel?.is_premium &&
    (!profiel.premium_verloopdatum || new Date(profiel.premium_verloopdatum) > new Date());

  return NextResponse.json({
    premiumActief,
    heeftAbonnement: !!profiel?.mollie_subscription_id,
    verloopdatum: profiel?.premium_verloopdatum ?? null,
  });
}
