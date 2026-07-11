-- ============================================
-- BEVEILIGINGSFIX: profielen waren volledig publiek leesbaar
-- (inclusief e-mailadressen) omdat RLS nooit was aangezet op
-- de profiles-tabel. Getest op 11 jul 2026 met de publieke anon-key:
-- alle e-mailadressen van alle gebruikers waren op te vragen zonder
-- in te loggen.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

-- 1. RLS aanzetten op profiles
alter table public.profiles enable row level security;

-- Iedereen mag profielen lezen (nodig voor verkopersprofielen, reviews, etc.)
drop policy if exists "Profielen zijn publiek leesbaar" on public.profiles;
create policy "Profielen zijn publiek leesbaar"
  on public.profiles for select
  using (true);

-- Alleen de eigenaar mag het eigen profiel aanpassen
drop policy if exists "Gebruiker past eigen profiel aan" on public.profiles;
create policy "Gebruiker past eigen profiel aan"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Alleen de eigenaar mag het eigen profiel aanmaken (bij registratie)
drop policy if exists "Gebruiker maakt eigen profiel aan" on public.profiles;
create policy "Gebruiker maakt eigen profiel aan"
  on public.profiles for insert
  with check (auth.uid() = id);

-- E-mailadres blijft verborgen voor iedereen, ook ingelogde gebruikers.
-- Je eigen e-mailadres haalt de app op via supabase.auth.getUser(),
-- niet via deze tabel — daarom kan dit veilig geblokkeerd worden.
revoke select (email) on public.profiles from anon, authenticated;

-- 2. RLS aanzetten op children (geboortedata van kinderen — gevoelig)
alter table public.children enable row level security;

drop policy if exists "Gebruiker ziet eigen kinderen" on public.children;
create policy "Gebruiker ziet eigen kinderen"
  on public.children for select
  using (auth.uid() = user_id);

drop policy if exists "Gebruiker voegt eigen kind toe" on public.children;
create policy "Gebruiker voegt eigen kind toe"
  on public.children for insert
  with check (auth.uid() = user_id);

drop policy if exists "Gebruiker past eigen kind aan" on public.children;
create policy "Gebruiker past eigen kind aan"
  on public.children for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Gebruiker verwijdert eigen kind" on public.children;
create policy "Gebruiker verwijdert eigen kind"
  on public.children for delete
  using (auth.uid() = user_id);

-- 3. RLS aanzetten op favorites
alter table public.favorites enable row level security;

drop policy if exists "Gebruiker ziet eigen favorieten" on public.favorites;
create policy "Gebruiker ziet eigen favorieten"
  on public.favorites for select
  using (auth.uid() = user_id);

drop policy if exists "Gebruiker voegt eigen favoriet toe" on public.favorites;
create policy "Gebruiker voegt eigen favoriet toe"
  on public.favorites for insert
  with check (auth.uid() = user_id);

drop policy if exists "Gebruiker verwijdert eigen favoriet" on public.favorites;
create policy "Gebruiker verwijdert eigen favoriet"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ============================================
-- AANVULLING 11 jul 2026: bovenstaande revoke van alleen de
-- e-mailkolom bleek geen effect te hebben. Postgres kan een
-- kolom niet "aftrekken" van een tabelbrede toegang die er al was
-- (GRANT SELECT ON profiles TO anon/authenticated dekt standaard
-- alle kolommen). Daarom hier expliciet opnieuw instellen: precies
-- welke kolommen wél leesbaar zijn (alles, behalve email).
-- ============================================

revoke select on public.profiles from anon, authenticated;

grant select (
  id, naam, avatar_url, stad, bio, verified, created_at,
  aantalvolgers, gemiddelde_beoordeling, totaal_beoordelingen,
  totaal_verkopen, lid_sinds, vakantiestand, is_premium,
  premium_verloopdatum, geboortedatum, is_admin
) on public.profiles to anon, authenticated;

notify pgrst, 'reload schema';
