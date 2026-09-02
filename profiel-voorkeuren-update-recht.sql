-- Fix: opslaan in Accountinstellingen/Privacy-instellingen/Feed-voorkeuren
-- faalde met "Opslaan mislukt", ook na de SELECT-grant-fix.
--
-- Oorzaak: beveiliging-profiel-update.sql zet (terecht) een kolom-specifieke
-- UPDATE-whitelist op profiles, zodat een gebruiker nooit via een
-- rechtstreekse aanroep is_admin/is_premium/etc. van zichzelf kan wijzigen.
-- De vier nieuwe kolommen stonden daar niet op, dus elke update die ze
-- bevatte werd in zijn geheel geweigerd.
--
-- Voegt alleen de vier nieuwe, echt user-editable kolommen toe aan
-- diezelfde whitelist — de beveiligingsgrens zelf blijft ongewijzigd.
-- Veilig om vaker te draaien.

grant update (
  naam, stad, bio, avatar_url, geboortedatum, vakantiestand, totaal_verkopen,
  geslacht, telefoonnummer, privacy_instellingen, feed_voorkeuren
) on public.profiles to authenticated;

notify pgrst, 'reload schema';
