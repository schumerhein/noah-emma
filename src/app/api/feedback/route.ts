import { NextResponse, after } from "next/server";
import { createHash } from "crypto";
import { haalGebruikerOp, supabaseAdmin } from "@/lib/mollie";
import { stuurEmail, emailSjabloon } from "@/lib/email";

const TYPES = ["bug", "verbetering", "anders"] as const;
const TYPE_LABEL: Record<(typeof TYPES)[number], string> = {
  bug: "Iets werkt niet",
  verbetering: "Dit kan beter",
  anders: "Anders",
};

const MAX_PER_UUR = 8;

const kort = (v: unknown, max: number) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Gasten én ingelogde gebruikers mogen feedback sturen — juist iemand die niet
// kan inloggen moet dat kunnen melden. Ingelogd is optioneel; zonder token
// wordt de feedback anoniem opgeslagen.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });

  const type = body.type as (typeof TYPES)[number];
  const bericht = kort(body.bericht, 2000);
  if (!TYPES.includes(type) || !bericht || bericht.length < 3) {
    return NextResponse.json({ error: "Vertel kort wat er speelt (minimaal een paar woorden)." }, { status: 400 });
  }

  const user = await haalGebruikerOp(request);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  const ipHash = createHash("sha256").update(`${ip}|${process.env.SUPABASE_SERVICE_ROLE_KEY}`).digest("hex").slice(0, 32);

  const sinds = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const teller = supabaseAdmin.from("feedback").select("id", { count: "exact", head: true }).gte("created_at", sinds);
  const { count } = await (user ? teller.eq("user_id", user.id) : teller.eq("ip_hash", ipHash));
  if ((count ?? 0) >= MAX_PER_UUR) {
    return NextResponse.json({ error: "Je hebt al veel feedback gestuurd, bedankt! Probeer het over een uur nog eens." }, { status: 429 });
  }

  const contactEmail = kort(body.contact_email, 200);
  const rij = {
    user_id: user?.id ?? null,
    type,
    bericht,
    pagina: kort(body.pagina, 300),
    apparaat: kort(body.apparaat, 100),
    scherm: kort(body.scherm, 30),
    app_versie: kort(body.app_versie, 40),
    contact_email: (contactEmail && /^\S+@\S+\.\S+$/.test(contactEmail) ? contactEmail : null) ?? user?.email ?? null,
    ip_hash: user ? null : ipHash,
  };

  const { error } = await supabaseAdmin.from("feedback").insert(rij);
  if (error) {
    console.error("Feedback opslaan mislukt:", error.message);
    return NextResponse.json({ error: "Versturen is niet gelukt. Probeer het zo nog eens." }, { status: 500 });
  }

  // Melding naar de beheerders gebeurt ná het antwoord, zodat de gebruiker niet
  // op de e-mail hoeft te wachten (en een mislukte mail het versturen nooit breekt).
  after(async () => {
    try {
      const { data: admins } = await supabaseAdmin.from("profiles").select("id").eq("is_admin", true);
      const wie = rij.contact_email || "gast";
      const html = emailSjabloon({
        titel: `Nieuwe feedback: ${TYPE_LABEL[type]}`,
        tekst: `${escapeHtml(bericht).replace(/\n/g, "<br>")}<br><br><small>Van: ${escapeHtml(wie)}<br>Pagina: ${escapeHtml(rij.pagina || "-")}<br>Apparaat: ${escapeHtml(rij.apparaat || "-")}</small>`,
        knopTekst: "Alle feedback bekijken",
        knopUrl: "https://www.noah-emma.nl/admin/feedback",
      });
      for (const a of admins || []) {
        const { data } = await supabaseAdmin.auth.admin.getUserById(a.id);
        if (data.user?.email) await stuurEmail({ naar: data.user.email, onderwerp: `Feedback: ${TYPE_LABEL[type]}`, html });
      }
    } catch (err) {
      console.error("Feedbackmelding naar admin mislukt:", err);
    }
  });

  return NextResponse.json({ ok: true });
}
