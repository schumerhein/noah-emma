-- ============================================
-- Meld- en blokkeerfunctie: database-aanpassingen
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

-- 1. Reports: kolom toevoegen om ook GEBRUIKERS te kunnen melden
--    (naast advertenties via listing_id)
alter table public.reports
  add column if not exists reported_user_id uuid references public.profiles(id) on delete cascade;

-- listing_id mag leeg zijn bij een gebruikersmelding
alter table public.reports
  alter column listing_id drop not null;

-- 2. Blocks-tabel (als die nog niet bestaat)
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blokkeerder_id uuid not null references public.profiles(id) on delete cascade,
  geblokkeerd_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blokkeerder_id, geblokkeerd_id)
);

-- 3. RLS aanzetten en policies
alter table public.blocks enable row level security;

drop policy if exists "Gebruikers zien eigen blokkades" on public.blocks;
create policy "Gebruikers zien eigen blokkades"
  on public.blocks for select
  using (auth.uid() = blokkeerder_id or auth.uid() = geblokkeerd_id);

drop policy if exists "Gebruikers blokkeren zelf" on public.blocks;
create policy "Gebruikers blokkeren zelf"
  on public.blocks for insert
  with check (auth.uid() = blokkeerder_id);

drop policy if exists "Gebruikers deblokkeren zelf" on public.blocks;
create policy "Gebruikers deblokkeren zelf"
  on public.blocks for delete
  using (auth.uid() = blokkeerder_id);

-- 4. Reports RLS: melders mogen alleen zelf melden
alter table public.reports enable row level security;

drop policy if exists "Gebruikers melden zelf" on public.reports;
create policy "Gebruikers melden zelf"
  on public.reports for insert
  with check (auth.uid() = reporter_id);
-- Kolom voor geboortedatum (leeftijdsverificatie) op profielen.
-- Plak dit in de Supabase SQL-editor en klik Run.
alter table public.profiles
  add column if not exists geboortedatum date;
-- ============================================
-- Handmatige moderatiewachtrij
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

-- 1. Moderatiestatus op advertenties
--    'wachtend'     → net geplaatst, nog niet beoordeeld
--    'goedgekeurd'  → zichtbaar voor iedereen
--    'afgekeurd'    → verborgen, verkoper ziet de reden
alter table public.listings
  add column if not exists moderatie_status text not null default 'wachtend'
  check (moderatie_status in ('wachtend', 'goedgekeurd', 'afgekeurd'));

alter table public.listings
  add column if not exists moderatie_reden text;

-- 2. Bestaande advertenties direct goedkeuren (eenmalig)
update public.listings set moderatie_status = 'goedgekeurd' where moderatie_status = 'wachtend';

-- 3. Admin-vlag op profielen
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Maak jezelf admin (pas het e-mailadres aan als je een ander account gebruikt)
update public.profiles set is_admin = true
where id in (select id from auth.users where email = 'hein0307@hotmail.com');

-- 4. Admins mogen alle advertenties bijwerken (voor goed-/afkeuren)
drop policy if exists "Admins modereren advertenties" on public.listings;
create policy "Admins modereren advertenties"
  on public.listings for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));
-- Verkocht-status op advertenties, los van "verborgen".
-- Plak dit in de Supabase SQL-editor en klik Run.
alter table public.listings
  add column if not exists verkocht boolean not null default false;

-- Advertenties van al afgeronde deals eenmalig als verkocht markeren
update public.listings set verkocht = true
where id in (select listing_id from public.conversations where afgerond = true and listing_id is not null);
