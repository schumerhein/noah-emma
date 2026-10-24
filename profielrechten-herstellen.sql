-- ============================================
-- BEVEILIGINGSFIX + meldingen-instellingen (24 okt 2026)
--
-- Gevonden bij een controle van de live database:
--
-- 1. De rechten uit beveiliging-profiel-update.sql en
--    beveiliging-rls-profielen.sql waren voor ingelogde gebruikers niet
--    (meer) actief: "authenticated" had weer tabelbrede SELECT en UPDATE op
--    profiles. Daardoor kon elke ingelogde gebruiker via een rechtstreekse
--    API-aanroep zichzelf is_admin/is_premium geven, en de e-mailadressen en
--    Mollie-klantnummers van alle gebruikers opvragen.
--
-- 2. De kolom notificatie_instellingen bestond niet. De pagina's
--    /notificaties en /notificaties/email konden daardoor niets laden of
--    opslaan (400 Bad Request), en de e-mailwebhooks negeerden een "uit".
--
-- Dit bestand zet beide recht: de kolom erbij, en de lees- en
-- schrijfrechten weer precies op de whitelist (alles wat de app zelf
-- gebruikt, plus de nieuwe kolom). email en mollie_* blijven alleen
-- serverside (service role) bereikbaar.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

alter table public.profiles add column if not exists notificatie_instellingen jsonb;

-- Lezen: alles behalve email en de Mollie-koppeling.
revoke select on public.profiles from anon, authenticated;
grant select (
  id, naam, avatar_url, stad, bio, verified, created_at,
  aantalvolgers, gemiddelde_beoordeling, totaal_beoordelingen,
  totaal_verkopen, lid_sinds, vakantiestand, is_premium,
  premium_verloopdatum, geboortedatum, is_admin,
  geslacht, telefoonnummer, privacy_instellingen, feed_voorkeuren,
  notificaties_gezien_tot, notificatie_instellingen
) on public.profiles to anon, authenticated;

-- Schrijven: alleen velden die een gebruiker zelf mag aanpassen (RLS
-- beperkt dit daarnaast tot het eigen profiel). Dus nooit is_admin,
-- is_premium, premium_verloopdatum, email of mollie_*.
revoke update on public.profiles from anon, authenticated;
grant update (
  naam, stad, bio, avatar_url, geboortedatum, vakantiestand, totaal_verkopen,
  geslacht, telefoonnummer, privacy_instellingen, feed_voorkeuren,
  notificaties_gezien_tot, notificatie_instellingen
) on public.profiles to authenticated;

notify pgrst, 'reload schema';
