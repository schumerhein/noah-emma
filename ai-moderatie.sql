-- ============================================
-- AUTOMATISCHE AI-MODERATIE van advertenties
--
-- Zodra een advertentie op 'wachtend' komt te staan, roept de database de
-- app aan (/api/webhooks/ai-moderatie). Een AI bekijkt foto's en tekst en
-- keurt goed, keurt af (verkoper ziet de reden), of laat de advertentie bij
-- twijfel in de handmatige wachtrij (/admin/moderatie) staan.
--
-- Wanneer start een beoordeling?
--   - bij een nieuwe advertentie (trigger ai_moderatie_nieuw)
--   - als een advertentie terug naar 'wachtend' gaat, bv. door nieuwe foto's
--     (zie herbeoordeling-bij-nieuwe-fotos.sql) of door aanpassen na
--     afkeuring (zie onderaan) (trigger ai_moderatie_herbeoordeling)
--
-- LET OP: vervang <SUPABASE_WEBHOOK_SECRET> door dezelfde waarde als in
-- Vercel (en in de webhooks nieuw-bod / nieuw-bericht). Gebruik het
-- www-adres: noah-emma.nl redirect, en dan gaat de POST verloren.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

-- 1. Wat de AI besloot, voor in het moderatiescherm.
--    Gebruikers krijgen geen update-recht op deze kolommen (alleen de
--    server schrijft ze, zie beveiliging-profiel-update.sql).
alter table public.listings
  add column if not exists ai_oordeel text
  check (ai_oordeel in ('goedkeuren', 'afkeuren', 'twijfel', 'fout'));
alter table public.listings add column if not exists ai_toelichting text;
alter table public.listings add column if not exists ai_beoordeeld_op timestamptz;

-- 2. Webhooks naar de app
create or replace trigger ai_moderatie_nieuw
  after insert on public.listings
  for each row execute function supabase_functions.http_request(
    'https://www.noah-emma.nl/api/webhooks/ai-moderatie', 'POST',
    '{"Content-type":"application/json","x-webhook-secret":"<SUPABASE_WEBHOOK_SECRET>"}',
    '{}', '5000'
  );

create or replace trigger ai_moderatie_herbeoordeling
  after update on public.listings
  for each row
  when (
    new.moderatie_status = 'wachtend'
    and (old.moderatie_status is distinct from 'wachtend' or new.foto_urls is distinct from old.foto_urls)
  )
  execute function supabase_functions.http_request(
    'https://www.noah-emma.nl/api/webhooks/ai-moderatie', 'POST',
    '{"Content-type":"application/json","x-webhook-secret":"<SUPABASE_WEBHOOK_SECRET>"}',
    '{}', '5000'
  );

-- 3. Aanpassen na afkeuring = opnieuw indienen.
--    Past de verkoper een afgekeurde advertentie aan, dan gaat die terug
--    naar 'wachtend' (en weer actief — afkeuren zette 'm op inactief), zodat
--    de AI hem opnieuw beoordeelt. Wijzigingen door de server (auth.uid()
--    is dan leeg) of door een admin tellen niet mee.
create or replace function public.herbeoordeel_na_afkeuring()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.moderatie_status = 'afgekeurd'
     -- 'wachtend' kan al gezet zijn door herbeoordeel_bij_nieuwe_fotos
     and new.moderatie_status in ('afgekeurd', 'wachtend')
     and auth.uid() is not null
     and (new.titel, new.beschrijving, new.categorie, new.subcategorie, new.maat,
          new.conditie, new.prijs, new.merk, new.kleur, new.foto_urls)
         is distinct from
         (old.titel, old.beschrijving, old.categorie, old.subcategorie, old.maat,
          old.conditie, old.prijs, old.merk, old.kleur, old.foto_urls)
     and not exists (
       select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true
     )
  then
    new.moderatie_status := 'wachtend';
    new.moderatie_reden := null;
    new.actief := true;
  end if;
  return new;
end;
$$;

revoke execute on function public.herbeoordeel_na_afkeuring() from public, anon, authenticated;

create or replace trigger herbeoordeel_na_afkeuring
  before update on public.listings
  for each row execute function public.herbeoordeel_na_afkeuring();

notify pgrst, 'reload schema';
