-- Fix: Accountinstellingen laadde na profiel-voorkeuren-kolommen.sql nog
-- steeds niets (zelfs de naam niet), en Privacy-instellingen/Feed-voorkeuren
-- laadden ook niks — console toonde 403's op de profiles-select.
--
-- Oorzaak: beveiliging-rls-profielen.sql zet column-level SELECT-rechten op
-- profiles via een expliciete whitelist (om het e-mailadres af te schermen).
-- Een SELECT die ook maar één kolom buiten die whitelist opvraagt wordt door
-- Postgres in zijn geheel geweigerd — dus zodra de app ook geslacht,
-- telefoonnummer, privacy_instellingen of feed_voorkeuren opvroeg (naast de
-- wél toegestane kolommen zoals naam), faalde de hele query.
--
-- Voegt de vier nieuwe kolommen toe aan diezelfde whitelist. Veilig om
-- vaker te draaien.

grant select (
  id, naam, avatar_url, stad, bio, verified, created_at,
  aantalvolgers, gemiddelde_beoordeling, totaal_beoordelingen,
  totaal_verkopen, lid_sinds, vakantiestand, is_premium,
  premium_verloopdatum, geboortedatum, is_admin,
  geslacht, telefoonnummer, privacy_instellingen, feed_voorkeuren
) on public.profiles to anon, authenticated;

notify pgrst, 'reload schema';
