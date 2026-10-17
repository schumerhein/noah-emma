import { NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stuurEmail, emailSjabloon, escapeHtml } from "@/lib/email";
import { magEmailKrijgen } from "@/lib/notificatieVoorkeuren";

// Alle e-mails rond reviews (zie reviews-verplicht-na-deal.sql):
// - deal afgerond          → koper én verkoper krijgen een review-verzoek
// - koper zegt "gekocht"   → verkoper wordt gevraagd de deal te bevestigen
// - nieuwe review          → de beoordeelde krijgt een mail
// - {"taak":"herinneringen"} (dagelijks via pg_cron) → één herinnering na
//   3 dagen zonder review, en aan verkopers die een koop niet bevestigden
export const maxDuration = 60;

const HERINNER_NA_DAGEN = 3;
const BEVESTIG_HERINNER_NA_DAGEN = 2;
const DAG = 24 * 60 * 60 * 1000;

type Gesprek = {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  afgerond: boolean;
  koper_bevestigd_op: string | null;
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload) return NextResponse.json({ error: "Ongeldige payload" }, { status: 400 });

  // Meteen antwoorden; de mails gaan op de achtergrond de deur uit.
  after(async () => {
    try {
      if (payload.taak === "herinneringen") {
        await stuurHerinneringen();
      } else if (payload.table === "reviews" && payload.type === "INSERT") {
        await mailNieuweReview(payload.record);
      } else if (payload.table === "conversations" && payload.type === "UPDATE") {
        const nieuw = payload.record as Gesprek;
        const oud = payload.old_record as Gesprek;
        if (nieuw.afgerond && !oud?.afgerond) await mailReviewVerzoeken(nieuw.id, false);
        else if (nieuw.koper_bevestigd_op && !oud?.koper_bevestigd_op && !nieuw.afgerond) await mailBevestigVerzoek(nieuw.id, false);
      }
    } catch (e) {
      console.error("Review-mail mislukt:", e);
    }
  });
  return NextResponse.json({ ok: true }, { status: 202 });
}

const origin = () => process.env.NEXT_PUBLIC_SITE_URL || "https://www.noah-emma.nl";

async function haalGesprek(id: string) {
  const { data } = await supabaseAdmin
    .from("conversations")
    .select("id, buyer_id, seller_id, listing_id, afgerond, koper_bevestigd_op, listings(titel)")
    .eq("id", id)
    .single();
  if (!data) return null;
  const titel = (data.listings as unknown as { titel: string } | null)?.titel ?? "je product";
  return { ...(data as unknown as Gesprek), titel };
}

async function naamVan(userId: string) {
  const { data } = await supabaseAdmin.from("profiles").select("naam").eq("id", userId).single();
  return data?.naam || "Je koper of verkoper";
}

async function emailVan(userId: string) {
  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId);
  return user?.email ?? null;
}

async function heeftBeoordeeld(reviewerId: string, listingId: string) {
  const { data } = await supabaseAdmin
    .from("reviews").select("id").eq("reviewer_id", reviewerId).eq("listing_id", listingId).maybeSingle();
  return !!data;
}

function reviewLink(gesprek: { id: string; listing_id: string | null }, beoordeeldeId: string) {
  return `${origin()}/reviews/schrijf?user=${beoordeeldeId}&listing=${gesprek.listing_id}&conv=${gesprek.id}`;
}

// Koper én verkoper vragen om een review. Bij een herinnering alleen wie
// er nog geen gaf.
async function mailReviewVerzoeken(gesprekId: string, herinnering: boolean) {
  const gesprek = await haalGesprek(gesprekId);
  if (!gesprek?.afgerond || !gesprek.listing_id) return;

  const partijen = [
    { ik: gesprek.buyer_id, ander: gesprek.seller_id, rol: "verkoper" },
    { ik: gesprek.seller_id, ander: gesprek.buyer_id, rol: "koper" },
  ];
  for (const { ik, ander, rol } of partijen) {
    if (await heeftBeoordeeld(ik, gesprek.listing_id)) continue;
    if (!(await magEmailKrijgen(ik, "beoordelingen"))) continue;
    const email = await emailVan(ik);
    if (!email) continue;
    const anderNaam = escapeHtml(await naamVan(ander));
    const titel = escapeHtml(gesprek.titel);

    await stuurEmail({
      naar: email,
      onderwerp: herinnering
        ? `Vergeet je niet ${await naamVan(ander)} te beoordelen?`
        : `Hoe ging je deal met ${await naamVan(ander)}? ⭐`,
      html: emailSjabloon({
        titel: herinnering ? "Nog even je beoordeling geven?" : "Deal gesloten! Hoe ging het? 🎉",
        tekst: herinnering
          ? `Een paar dagen geleden sloot je de deal voor "${titel}" met ${anderNaam}. Je beoordeling helpt andere ouders om veilig te kopen en verkopen — het kost maar een minuutje.`
          : `De deal voor "${titel}" is gesloten. Laat met een paar sterren weten hoe het ging met ${anderNaam} als ${rol}. Zo weten andere ouders bij wie ze veilig terechtkunnen.`,
        knopTekst: `Beoordeel ${anderNaam}`,
        knopUrl: reviewLink(gesprek, ander),
      }),
    });
  }

  await supabaseAdmin
    .from("conversations")
    .update(herinnering ? { review_herinnering_op: new Date().toISOString() } : { review_verzoek_op: new Date().toISOString() })
    .eq("id", gesprek.id);
}

// Koper zegt "ik heb dit gekocht" → verkoper vragen de deal te bevestigen.
async function mailBevestigVerzoek(gesprekId: string, herinnering: boolean) {
  const gesprek = await haalGesprek(gesprekId);
  if (!gesprek || gesprek.afgerond || !gesprek.koper_bevestigd_op) return;
  if (!(await magEmailKrijgen(gesprek.seller_id, "deal_gesloten"))) return;
  const email = await emailVan(gesprek.seller_id);
  if (!email) return;
  const koperNaam = await naamVan(gesprek.buyer_id);

  await stuurEmail({
    naar: email,
    onderwerp: herinnering
      ? `${koperNaam} wacht nog op je bevestiging`
      : `${koperNaam} heeft "${gesprek.titel}" gekocht — klopt dat?`,
    html: emailSjabloon({
      titel: "Bevestig je verkoop",
      tekst: `${escapeHtml(koperNaam)} geeft aan dat ze "${escapeHtml(gesprek.titel)}" van je heeft gekocht. Bevestig de deal in het gesprek, dan kunnen jullie elkaar een beoordeling geven.`,
      knopTekst: "Bevestig de deal",
      knopUrl: `${origin()}/messages/${gesprek.id}`,
    }),
  });

  if (herinnering) {
    await supabaseAdmin.from("conversations").update({ bevestig_herinnering_op: new Date().toISOString() }).eq("id", gesprek.id);
  }
}

// De beoordeelde laten weten dat er een review is — en als die zelf nog
// geen review gaf, meteen de kans geven om terug te beoordelen.
async function mailNieuweReview(review: { reviewer_id: string; reviewed_id: string; listing_id: string | null; beoordeling: number }) {
  if (!review?.reviewed_id || !(await magEmailKrijgen(review.reviewed_id, "beoordelingen"))) return;
  const email = await emailVan(review.reviewed_id);
  if (!email) return;

  const reviewerNaam = await naamVan(review.reviewer_id);
  const sterren = "⭐".repeat(Math.max(1, Math.min(5, review.beoordeling)));

  let knop = { tekst: "Bekijk je beoordelingen", url: `${origin()}/profile` };
  if (review.listing_id && !(await heeftBeoordeeld(review.reviewed_id, review.listing_id))) {
    const { data: gesprek } = await supabaseAdmin
      .from("conversations")
      .select("id, listing_id")
      .eq("listing_id", review.listing_id)
      .eq("afgerond", true)
      .or(`and(buyer_id.eq.${review.reviewer_id},seller_id.eq.${review.reviewed_id}),and(seller_id.eq.${review.reviewer_id},buyer_id.eq.${review.reviewed_id})`)
      .maybeSingle();
    if (gesprek) knop = { tekst: `Beoordeel ${escapeHtml(reviewerNaam)} terug`, url: reviewLink(gesprek, review.reviewer_id) };
  }

  await stuurEmail({
    naar: email,
    onderwerp: `${reviewerNaam} gaf je ${review.beoordeling} ${review.beoordeling === 1 ? "ster" : "sterren"} ${sterren}`,
    html: emailSjabloon({
      titel: `Je hebt een nieuwe beoordeling ${sterren}`,
      tekst: `${escapeHtml(reviewerNaam)} heeft je beoordeeld. Goede beoordelingen zorgen dat andere ouders sneller met je handelen.`,
      knopTekst: knop.tekst,
      knopUrl: knop.url,
    }),
  });
}

async function stuurHerinneringen() {
  const nu = Date.now();

  // Deals van 3–30 dagen oud waarvoor nog geen herinnering ging
  const { data: deals } = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("afgerond", true)
    .is("review_herinnering_op", null)
    .lt("afgerond_at", new Date(nu - HERINNER_NA_DAGEN * DAG).toISOString())
    .gt("afgerond_at", new Date(nu - 30 * DAG).toISOString());
  for (const deal of deals || []) await mailReviewVerzoeken(deal.id, true);

  // Kopers die "gekocht" zeiden, maar de verkoper bevestigde nog niet
  const { data: openKopen } = await supabaseAdmin
    .from("conversations")
    .select("id")
    .eq("afgerond", false)
    .is("bevestig_herinnering_op", null)
    .lt("koper_bevestigd_op", new Date(nu - BEVESTIG_HERINNER_NA_DAGEN * DAG).toISOString());
  for (const koop of openKopen || []) await mailBevestigVerzoek(koop.id, true);
}
