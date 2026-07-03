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
