import { NextResponse } from "next/server";
import { haalGebruikerOp, supabaseAdmin } from "@/lib/mollie";

// Goed- of afkeuren van een advertentie in de moderatiewachtrij.
//
// Loopt via de server (service role) omdat ingelogde gebruikers — ook admins —
// geen update-recht hebben op moderatie_status (zie
// beveiliging-profiel-update.sql). Daarom controleert deze route zelf of de
// aanroeper admin is.
export async function POST(request: Request) {
  const user = await haalGebruikerOp(request);
  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { data: profiel } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profiel?.is_admin) {
    return NextResponse.json({ error: "Alleen voor admins" }, { status: 403 });
  }

  const { listingId, actie, reden } = await request.json().catch(() => ({}));
  if (typeof listingId !== "string" || (actie !== "goedkeuren" && actie !== "afkeuren")) {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }
  if (actie === "afkeuren" && (typeof reden !== "string" || !reden.trim())) {
    return NextResponse.json({ error: "Geef een reden op" }, { status: 400 });
  }

  const wijziging = actie === "goedkeuren"
    ? { moderatie_status: "goedgekeurd", moderatie_reden: null }
    : { moderatie_status: "afgekeurd", moderatie_reden: reden.trim().slice(0, 200), actief: false };

  const { data, error } = await supabaseAdmin
    .from("listings")
    .update(wijziging)
    .eq("id", listingId)
    .select("id");
  if (error) {
    console.error("Modereren mislukt:", error);
    return NextResponse.json({ error: "Opslaan is niet gelukt" }, { status: 500 });
  }
  if (!data?.length) {
    return NextResponse.json({ error: "Advertentie niet gevonden" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
