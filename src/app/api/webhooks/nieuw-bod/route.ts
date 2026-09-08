import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stuurEmail, emailSjabloon } from "@/lib/email";
import { magEmailKrijgen } from "@/lib/notificatieVoorkeuren";

// Wordt aangeroepen door een Supabase Database Webhook op INSERT in
// "biedingen". Stuurt de verkoper een e-mail dat er een bod is gedaan.
export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const payload = await request.json();
  const bod = payload.record;
  if (!bod?.listing_id || !bod?.bieder_id || bod?.bedrag == null) {
    return NextResponse.json({ error: "Ongeldige payload" }, { status: 400 });
  }

  const { data: listing } = await supabaseAdmin
    .from("listings")
    .select("id, titel, user_id")
    .eq("id", bod.listing_id)
    .single();
  if (!listing || listing.user_id === bod.bieder_id) return NextResponse.json({ ok: true });

  const { data: { user: verkoper } } = await supabaseAdmin.auth.admin.getUserById(listing.user_id);
  if (!verkoper?.email) return NextResponse.json({ ok: true });
  if (!(await magEmailKrijgen(listing.user_id, "nieuw_bod"))) return NextResponse.json({ ok: true });

  const { data: bieder } = await supabaseAdmin.from("profiles").select("naam").eq("id", bod.bieder_id).single();
  const bieder_naam = bieder?.naam || "Iemand";
  const bedrag = Number(bod.bedrag).toFixed(2).replace(".", ",");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://noah-emma.nl";

  await stuurEmail({
    naar: verkoper.email,
    onderwerp: `${bieder_naam} doet een bod van €${bedrag}`,
    html: emailSjabloon({
      titel: `Nieuw bod op "${listing.titel}"`,
      tekst: `${bieder_naam} biedt €${bedrag} op je advertentie "${listing.titel}". Bekijk het bod in je berichten.`,
      knopTekst: "Bekijk bod",
      knopUrl: `${origin}/product/${listing.id}`,
    }),
  });

  return NextResponse.json({ ok: true });
}
