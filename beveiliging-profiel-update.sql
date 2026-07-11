-- ============================================
-- BEVEILIGINGSFIX: gebruikers konden via een rechtstreekse aanroep aan de
-- database élk veld van hun eigen profiel wijzigen, dus ook is_admin en
-- is_premium — buiten de app en buiten betaling om. Ontdekt doordat er in
-- de code twee plekken bleken te staan die is_premium gratis aanzetten
-- (nu al gerepareerd in de app-code, dit is de reparatie in de database).
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

revoke update on public.profiles from anon, authenticated;

grant update (
  naam, stad, bio, avatar_url, geboortedatum, vakantiestand, totaal_verkopen
) on public.profiles to authenticated;

notify pgrst, 'reload schema';

-- ============================================
-- AANVULLING: hetzelfde probleem bleek ook bij listings te spelen.
-- "gepromoot" (Boost) kon een gebruiker zelf aanzetten via het
-- bewerkscherm van een advertentie — volledig gratis, buiten Mollie om.
-- En "moderatie_status" kon een verkoper in theorie zelf op "goedgekeurd"
-- zetten, wat de hele moderatiewachtrij omzeilt.
-- ============================================

revoke update on public.listings from authenticated;

grant update (
  titel, beschrijving, categorie, subcategorie, maat, conditie, prijs,
  merk, kleur, bieden_toegestaan, actief, foto_urls, verkocht
) on public.listings to authenticated;

notify pgrst, 'reload schema';
