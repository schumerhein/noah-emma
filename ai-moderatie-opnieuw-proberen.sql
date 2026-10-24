-- ============================================
-- AI-MODERATIE: mislukte beoordelingen automatisch opnieuw proberen,
-- en bijhouden wanneer een advertentie is afgekeurd.
--
-- Probleem: kwamen er veel advertenties tegelijk binnen, dan gaf Gemini
-- "te druk" (429) en bleven ze met "AI-controle mislukt" in de handmatige
-- wachtrij staan. Ook een webhook die nooit aankwam, bleef liggen.
--
-- Oplossing:
--   1. ai_pogingen telt mislukte AI-pogingen (drukte bij Gemini telt niet
--      mee, dat gaat vanzelf over); ai_wacht_sinds onthoudt sinds wanneer
--      een advertentie op de AI wacht.
--   2. Elke keer dat een advertentie (opnieuw) op 'wachtend' komt, begint
--      de AI met een schone lei: oordeel leeg, pogingen op 0.
--   3. Elke 2 minuten kijkt pg_cron of er advertenties liggen waarbij de
--      AI mislukte (of nooit begon). Zo ja, dan roept hij de app aan, die
--      er een paar per keer opnieuw beoordeelt. Na 6 mislukte pogingen
--      blijft de advertentie voor een admin in /admin/moderatie staan.
--   4. afgekeurd_op: wanneer de advertentie is afgekeurd (door AI of admin),
--      voor de melding in de Inbox van de verkoper.
--
-- Vereist: het webhook-geheim in de Vault (zie reviews-verplicht-na-deal.sql).
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

-- 1. Nieuwe kolommen. Gebruikers krijgen er geen update-recht op (de
--    update-rechten op listings zijn per kolom toegekend); alleen de server
--    en de trigger hieronder schrijven ze.
alter table public.listings add column if not exists ai_pogingen integer not null default 0;
alter table public.listings add column if not exists ai_wacht_sinds timestamptz default now();
alter table public.listings add column if not exists afgekeurd_op timestamptz;

-- Bestaande afgekeurde advertenties: beste schatting van het moment.
update public.listings
set afgekeurd_op = coalesce(ai_beoordeeld_op, created_at)
where moderatie_status = 'afgekeurd' and afgekeurd_op is null;

create index if not exists listings_wachtend_ai_idx
  on public.listings (ai_wacht_sinds)
  where moderatie_status = 'wachtend';

-- 2. Moderatiestatus bijhouden. Draait ná herbeoordeel_bij_nieuwe_fotos,
--    herbeoordeel_bij_tekstwijziging en herbeoordeel_na_afkeuring (Postgres
--    voert BEFORE-triggers op alfabetische naam uit), zodat ook een
--    'wachtend' dat zij net zetten hier meetelt. De voorwaarde is dezelfde
--    als die van de webhook ai_moderatie_herbeoordeling (ai-moderatie.sql).
create or replace function public.moderatie_bijhouden()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.moderatie_status = 'wachtend'
     and (old.moderatie_status is distinct from 'wachtend' or new.foto_urls is distinct from old.foto_urls)
  then
    new.ai_oordeel := null;
    new.ai_toelichting := null;
    new.ai_pogingen := 0;
    new.ai_wacht_sinds := now();
  end if;

  if new.moderatie_status = 'afgekeurd' and old.moderatie_status is distinct from 'afgekeurd' then
    new.afgekeurd_op := now();
  end if;
  return new;
end;
$$;

revoke execute on function public.moderatie_bijhouden() from public, anon, authenticated;

drop trigger if exists moderatie_bijhouden on public.listings;
create trigger moderatie_bijhouden
  before update on public.listings
  for each row execute function public.moderatie_bijhouden();

-- 3. Herhaalronde. Roept de app alleen aan als er echt iets ligt, dus
--    zonder achterstand gebeurt er niets. De voorwaarden moeten gelijk
--    blijven aan herhaalronde() in src/app/api/webhooks/ai-moderatie/route.ts.
create or replace function public.ai_moderatie_opnieuw_proberen()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.listings
    where moderatie_status = 'wachtend'
      and ai_pogingen < 6
      and (
        (ai_oordeel = 'fout' and ai_beoordeeld_op < now() - interval '2 minutes')
        or (ai_oordeel is null and ai_wacht_sinds < now() - interval '5 minutes')
      )
  ) then
    perform net.http_post(
      url := 'https://www.noah-emma.nl/api/webhooks/ai-moderatie',
      body := '{"taak":"opnieuw"}'::jsonb,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-webhook-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'webhook_secret')
      ),
      timeout_milliseconds := 5000
    );
  end if;
end;
$$;

revoke execute on function public.ai_moderatie_opnieuw_proberen() from public, anon, authenticated;

select cron.schedule('ai-moderatie-opnieuw', '*/2 * * * *', 'select public.ai_moderatie_opnieuw_proberen()');

notify pgrst, 'reload schema';
