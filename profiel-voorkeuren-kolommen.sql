-- Fix: Account- en Privacy-instellingen waren volledig kapot.
--
-- src/app/instellingen/account/page.tsx selecteert "naam, geslacht,
-- geboortedatum, telefoonnummer" in één query — PostgREST laat de HELE
-- query falen zodra één gevraagde kolom niet bestaat, dus zelfs de naam
-- laadde niet. src/app/instellingen/privacy-instelling/page.tsx faalt op
-- dezelfde manier bij het lezen/schrijven van privacy_instellingen.
--
-- Alle drie kolommen bleken nooit op profiles te zijn toegevoegd:
-- add-geslacht-column.sql voegde "geslacht" alleen toe aan children (het
-- geslacht van het kind, iets anders dan het geslacht van de gebruiker
-- zelf), en telefoonnummer/privacy_instellingen bestonden nergens.
--
-- Voegt ook feed_voorkeuren toe, nodig voor de "Personaliseer je feed"-
-- pagina (categorieën/maten/merken), die vóór deze fix niets opsloeg.
--
-- Veilig om vaker te draaien.

alter table public.profiles add column if not exists geslacht text;
alter table public.profiles add column if not exists telefoonnummer text;
alter table public.profiles add column if not exists privacy_instellingen jsonb;
alter table public.profiles add column if not exists feed_voorkeuren jsonb;

notify pgrst, 'reload schema';
