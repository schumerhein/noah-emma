import { NextResponse } from "next/server";
import { haalGebruikerOp, supabaseAdmin } from "@/lib/mollie";
import { vertaalZoekvraag } from "@/lib/aiZoeken";

// AI-zoekchat — alleen voor actieve Premium-leden. Vertaalt een vrije-tekst
// vraag naar zoekfilters via Claude; de daadwerkelijke productquery blijft
// aan de client (dezelfde zoekmachine als de normale zoekpagina), zodat deze
// route geen directe databasetoegang tot listings nodig heeft.
export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("is_premium, premium_verloopdatum")
    .eq("id", user.id)
    .single();
  const isPremium = profiel?.is_premium && (!profiel.premium_verloopdatum || new Date(profiel.premium_verloopdatum) > new Date());
  if (!isPremium) {
    return NextResponse.json({ error: "Alleen voor Premium-leden" }, { status: 403 });
  }

  const { vraag } = await request.json().catch(() => ({ vraag: "" }));
  if (typeof vraag !== "string" || !vraag.trim()) {
    return NextResponse.json({ error: "Geen vraag opgegeven" }, { status: 400 });
  }
  if (vraag.length > 500) {
    return NextResponse.json({ error: "Vraag is te lang" }, { status: 400 });
  }

  try {
    const filters = await vertaalZoekvraag(vraag.trim());
    return NextResponse.json(filters);
  } catch (err) {
    console.error("AI-zoeken mislukt:", err);
    return NextResponse.json({ error: "AI-zoeken is nu niet beschikbaar, probeer het later opnieuw." }, { status: 502 });
  }
}
