-- ============================================
-- Betalingen: Mollie-koppeling voor Premium en Boost
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

create table if not exists public.betalingen (
  id uuid primary key default gen_random_uuid(),
  mollie_payment_id text unique not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('premium', 'boost')),
  listing_id uuid references public.listings(id) on delete cascade,
  tier text,
  bedrag numeric not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  betaald_op timestamptz
);

alter table public.betalingen enable row level security;

-- Gebruiker mag alleen zijn eigen betalingen zien.
-- Aanmaken/bijwerken gebeurt uitsluitend server-side (via de service role,
-- die RLS omzeilt) — geen insert/update policy nodig of gewenst hier.
drop policy if exists "Gebruiker ziet eigen betalingen" on public.betalingen;
create policy "Gebruiker ziet eigen betalingen"
  on public.betalingen for select
  using (auth.uid() = user_id);
