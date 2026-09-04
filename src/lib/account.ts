import { randomUUID } from "node:crypto";
import { supabaseAdmin, zegAbonnementOp } from "@/lib/mollie";

// Verwijdert een account. Puur persoonlijke data (kinderen, favorieten,
// volgers, zoekwaarschuwingen, swipe-tellers, avatar) wordt hard verwijderd.
// Advertenties worden gedeactiveerd in plaats van verwijderd, en het profiel
// wordt geanonimiseerd in plaats van hard verwijderd, zodat gesprekken,
// biedingen, beoordelingen en betaalgeschiedenis van andere, nog actieve
// gebruikers intact blijven (die verwijzen naar dit profiel via foreign
// keys).
//
// Als laatste stap wordt het account geblokkeerd (ban_duration) in plaats
// van hard verwijderd met auth.admin.deleteUser(). profiles.id verwijst met
// ON DELETE CASCADE naar auth.users(id) — een hard delete van de auth-
// gebruiker trekt dus alsnog de profielrij mee, en daarmee (via cascades
// op reviews/reports/blocks) ook data van andere, nog actieve gebruikers.
// Getest en bevestigd op 2 sep 2026: na auth.admin.deleteUser() was de
// profielrij volledig verdwenen in plaats van geanonimiseerd. Een langdurige
// ban + willekeurig wachtwoord maakt inloggen net zo definitief onmogelijk,
// zonder dit cascade-effect.
export async function verwijderAccount(userId: string) {
  await zegAbonnementOp(userId).catch(() => {});

  const verwijderResultaten = await Promise.all([
    supabaseAdmin.from("children").delete().eq("user_id", userId),
    supabaseAdmin.from("favorites").delete().eq("user_id", userId),
    supabaseAdmin.from("followers").delete().or(`follower_id.eq.${userId},following_id.eq.${userId}`),
    supabaseAdmin.from("zoekwaarschuwingen").delete().eq("user_id", userId),
    supabaseAdmin.from("swipe_tellers").delete().eq("user_id", userId),
    supabaseAdmin.from("listings").update({ actief: false }).eq("user_id", userId),
  ]);
  const eersteFout = verwijderResultaten.find(r => r.error)?.error;
  if (eersteFout) throw eersteFout;

  const { data: avatarBestanden } = await supabaseAdmin.storage.from("avatars").list(userId);
  if (avatarBestanden?.length) {
    await supabaseAdmin.storage.from("avatars").remove(avatarBestanden.map(b => `${userId}/${b.name}`));
  }

  // profiles.email is NOT NULL — kan dus niet op null gezet worden.
  // Gebruikt hetzelfde anonieme adres als de auth-kant, in plaats van null.
  // Bug gevonden op 4 sep 2026: de update hieronder faalde stil op precies
  // dit punt (23502, not-null constraint), waardoor de HELE update-instructie
  // niets bijwerkte (Postgres past een update atomisch toe) — inclusief naam
  // en de rest — terwijl de daaropvolgende auth-ban wél gewoon slaagde. Dat
  // gaf de indruk dat verwijderen werkte, terwijl het profiel intact bleef.
  const anoniemEmail = `verwijderd-${userId}@noah-emma.invalid`;
  const { error: profielError } = await supabaseAdmin.from("profiles").update({
    naam: "Verwijderde gebruiker",
    email: anoniemEmail,
    avatar_url: null,
    bio: null,
    stad: null,
    geboortedatum: null,
    is_premium: false,
    premium_verloopdatum: null,
    mollie_customer_id: null,
    mollie_subscription_id: null,
  }).eq("id", userId);
  if (profielError) throw profielError;

  await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: "876000h", // ~100 jaar — er bestaat geen "voor altijd"-optie
    password: randomUUID() + randomUUID(),
    // Maakt het e-mailadres vrij zodat iemand later opnieuw kan registreren.
    email: anoniemEmail,
  });
}
