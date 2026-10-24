import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { stuurEmail, emailSjabloon, escapeHtml } from "@/lib/email";
import { magEmailKrijgen } from "@/lib/notificatieVoorkeuren";

// Mail aan de verkoper dat een advertentie is afgekeurd (door de AI of door
// een admin), met de reden en een knop om hem meteen aan te passen. Na het
// aanpassen gaat de advertentie vanzelf terug naar de moderatie (zie
// ai-moderatie.sql). In de app staat dezelfde melding in Inbox → Notificaties.
export async function meldAfkeuring(listingId: string) {
  try {
    const { data: listing } = await supabaseAdmin
      .from("listings")
      .select("id, titel, user_id, moderatie_status, moderatie_reden")
      .eq("id", listingId)
      .single();
    if (!listing || listing.moderatie_status !== "afgekeurd") return;
    if (!(await magEmailKrijgen(listing.user_id, "advertentie_afgekeurd"))) return;

    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(listing.user_id);
    if (!user?.email) return;

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.noah-emma.nl";
    const titel = escapeHtml(listing.titel);
    await stuurEmail({
      naar: user.email,
      onderwerp: `Je advertentie "${listing.titel}" is afgekeurd`,
      html: emailSjabloon({
        titel: "Je advertentie staat nog niet online",
        tekst: `We hebben "${titel}" bekeken, maar kunnen hem zo nog niet plaatsen. Hieronder lees je waarom. Pas je advertentie aan (bijvoorbeeld een andere foto of tekst), dan bekijken we hem meteen opnieuw.`,
        citaat: escapeHtml(listing.moderatie_reden || "Je advertentie voldoet niet aan onze regels."),
        knopTekst: "Advertentie aanpassen",
        knopUrl: `${origin}/product/${listing.id}/edit`,
      }),
    });
  } catch (e) {
    console.error("Afkeurmelding versturen mislukt:", listingId, e);
  }
}
