import { NextResponse } from "next/server";
import { haalGebruikerOp, verwerkBetaling, supabaseAdmin } from "@/lib/mollie";

// Wordt aangeroepen door de bevestigingspagina na terugkomst van Mollie.
// Nodig omdat de webhook lokaal niet bereikbaar is; op de live site vangt
// de webhook dit ook af, dan is dit een extra zekerheidje.
// Zoekt de meest recente betaling van dit type op voor de ingelogde
// gebruiker (Mollie stuurt geen betalings-id mee in de terugkeer-URL).
export async function GET(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const listingId = searchParams.get("listingId");
  if (type !== "premium" && type !== "boost") {
    return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("betalingen")
    .select("mollie_payment_id")
    .eq("user_id", user.id)
    .eq("type", type)
    .order("created_at", { ascending: false })
    .limit(1);
  if (type === "boost" && listingId) query = query.eq("listing_id", listingId);

  const { data: betaling } = await query.single();
  if (!betaling) {
    return NextResponse.json({ status: "onbekend" });
  }

  const resultaat = await verwerkBetaling(betaling.mollie_payment_id);
  return NextResponse.json(resultaat);
}
