-- ============================================
-- REVIEWS: alleen na een echte deal, automatische e-mails en herinneringen.
--
-- 1. Een review mag alleen nog als er een afgeronde deal (conversations.
--    afgerond) is tussen reviewer en beoordeelde, voor dat product. Voorheen
--    controleerde alleen de app dat; via de database kon iedereen iedereen
--    beoordelen.
-- 2. Gesprekken beveiligen: alleen de verkoper rondt een deal af, alleen de
--    koper zegt "ik heb dit gekocht", en koper/verkoper/product van een
--    gesprek kunnen niet meer worden omgezet (anders kon je een deal met
--    jezelf in elkaar zetten en nepreviews geven).
-- 3. Webhooks naar /api/webhooks/reviews:
--    - deal afgerond → beide partijen krijgen een review-verzoek per mail
--    - koper zegt "gekocht" → verkoper krijgt een mail om te bevestigen
--    - nieuwe review → de beoordeelde krijgt een mail
-- 4. Elke dag een herinnering voor wie na 3 dagen nog geen review gaf, en
--    voor verkopers die een koop nog niet bevestigden.
-- 5. totaal_beoordelingen op profielen wordt bijgehouden.
--
-- LET OP: vervang <SUPABASE_WEBHOOK_SECRET> door dezelfde waarde als in
-- Vercel. Gebruik het www-adres (noah-emma.nl redirect → POST gaat verloren).
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

-- ---------- 1. Review alleen na afgeronde deal ----------
-- (alter policy i.p.v. drop/create: beide bestaande insert-policies zijn
-- 'permissive' en tellen als OF, dus ze moeten allebei strenger.)
create or replace function public.mag_review_geven(p_reviewer uuid, p_beoordeelde uuid, p_listing uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_listing is not null
     and p_reviewer <> p_beoordeelde
     and exists (
       select 1 from public.conversations c
       where c.listing_id = p_listing
         and c.afgerond
         and ((c.seller_id = p_reviewer and c.buyer_id = p_beoordeelde)
           or (c.buyer_id = p_reviewer and c.seller_id = p_beoordeelde))
     )
$$;

alter policy "Gebruikers kunnen eigen reviews plaatsen" on public.reviews
  with check (auth.uid() = reviewer_id and public.mag_review_geven(reviewer_id, reviewed_id, listing_id));
alter policy "ingelogde gebruiker mag review schrijven" on public.reviews
  with check (auth.uid() = reviewer_id and public.mag_review_geven(reviewer_id, reviewed_id, listing_id));

-- ---------- 2. Gesprekken beveiligen ----------
alter table public.conversations add column if not exists koper_bevestigd_op timestamptz;
alter table public.conversations add column if not exists review_verzoek_op timestamptz;
alter table public.conversations add column if not exists review_herinnering_op timestamptz;
alter table public.conversations add column if not exists bevestig_herinnering_op timestamptz;

create or replace function public.bewaak_gesprek_wijziging()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Server (service role) en database-taken mogen alles.
  if auth.uid() is null then
    return new;
  end if;

  if new.buyer_id is distinct from old.buyer_id
     or new.seller_id is distinct from old.seller_id
     or new.listing_id is distinct from old.listing_id then
    raise exception 'Koper, verkoper en product van een gesprek kunnen niet worden gewijzigd';
  end if;

  if new.afgerond is distinct from old.afgerond then
    if old.afgerond then
      raise exception 'Een afgeronde deal kan niet worden teruggedraaid';
    end if;
    if auth.uid() <> old.seller_id then
      raise exception 'Alleen de verkoper kan een deal afronden';
    end if;
  end if;
  if new.afgerond_door is distinct from old.afgerond_door and new.afgerond_door is distinct from auth.uid() then
    raise exception 'afgerond_door moet de verkoper zelf zijn';
  end if;

  if new.koper_bevestigd_op is distinct from old.koper_bevestigd_op and auth.uid() <> old.buyer_id then
    raise exception 'Alleen de koper kan aangeven dat het product gekocht is';
  end if;

  -- Mail-administratie is alleen voor de server.
  new.review_verzoek_op := old.review_verzoek_op;
  new.review_herinnering_op := old.review_herinnering_op;
  new.bevestig_herinnering_op := old.bevestig_herinnering_op;
  return new;
end;
$$;

revoke execute on function public.bewaak_gesprek_wijziging() from public, anon, authenticated;

create or replace trigger bewaak_gesprek_wijziging
  before update on public.conversations
  for each row execute function public.bewaak_gesprek_wijziging();

-- ---------- 3. Webhooks ----------
create or replace trigger reviews_deal_afgerond
  after update on public.conversations
  for each row
  when (new.afgerond and not coalesce(old.afgerond, false))
  execute function supabase_functions.http_request(
    'https://www.noah-emma.nl/api/webhooks/reviews', 'POST',
    '{"Content-type":"application/json","x-webhook-secret":"<SUPABASE_WEBHOOK_SECRET>"}',
    '{}', '5000'
  );

create or replace trigger reviews_koper_bevestigd
  after update on public.conversations
  for each row
  when (new.koper_bevestigd_op is not null and old.koper_bevestigd_op is null and not new.afgerond)
  execute function supabase_functions.http_request(
    'https://www.noah-emma.nl/api/webhooks/reviews', 'POST',
    '{"Content-type":"application/json","x-webhook-secret":"<SUPABASE_WEBHOOK_SECRET>"}',
    '{}', '5000'
  );

create or replace trigger reviews_nieuwe_review
  after insert on public.reviews
  for each row
  execute function supabase_functions.http_request(
    'https://www.noah-emma.nl/api/webhooks/reviews', 'POST',
    '{"Content-type":"application/json","x-webhook-secret":"<SUPABASE_WEBHOOK_SECRET>"}',
    '{}', '5000'
  );

-- ---------- 4. Dagelijkse herinneringen ----------
-- Het webhook-geheim staat in de Supabase Vault (niet leesbaar in cron.job).
select vault.create_secret('<SUPABASE_WEBHOOK_SECRET>', 'webhook_secret')
where not exists (select 1 from vault.secrets where name = 'webhook_secret');

create or replace function public.stuur_review_herinneringen()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url := 'https://www.noah-emma.nl/api/webhooks/reviews',
    body := '{"taak":"herinneringen"}'::jsonb,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'webhook_secret')
    ),
    timeout_milliseconds := 5000
  );
end;
$$;

revoke execute on function public.stuur_review_herinneringen() from public, anon, authenticated;

-- Elke dag om 16:47 (UTC) — tijdens de dag, niet midden in de nacht
select cron.schedule('review-herinneringen', '47 16 * * *', 'select public.stuur_review_herinneringen()');

-- ---------- 5. Aantal beoordelingen bijhouden ----------
create or replace function public.update_gemiddelde_beoordeling()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  beoordeelde uuid := coalesce(new.reviewed_id, old.reviewed_id);
begin
  update public.profiles
  set gemiddelde_beoordeling = (select round(avg(beoordeling)::numeric, 1) from public.reviews where reviewed_id = beoordeelde),
      totaal_beoordelingen = (select count(*) from public.reviews where reviewed_id = beoordeelde)
  where id = beoordeelde;
  return coalesce(new, old);
end;
$$;

update public.profiles p
set totaal_beoordelingen = (select count(*) from public.reviews r where r.reviewed_id = p.id);

notify pgrst, 'reload schema';
