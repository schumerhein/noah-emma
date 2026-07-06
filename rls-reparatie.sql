-- ============================================
-- RLS-reparatie listings (GEVONDEN TIJDENS TESTRONDE — al uitgevoerd op 6 jul 2026)
--
-- Probleem 1: afkeuren in de moderatiewachtrij faalde met
--   "new row violates row-level security policy"
-- Probleem 2: de leespolicy was `actief = true`, waardoor verborgen,
--   verkochte en afgekeurde advertenties voor NIEMAND meer leesbaar waren —
--   ook niet voor de eigenaar (Mijn items) of de admin (moderatie).
--   Dat brak ook de "Verkocht"-badges in zoeken en favorieten.
--
-- Oplossing: leespolicy verruimd (actief OF verkocht OF eigenaar OF admin)
-- en expliciete WITH CHECK op de update-policies.
-- Veilig om vaker te draaien.
-- ============================================

drop policy if exists "Listings zijn publiek leesbaar" on public.listings;
create policy "Listings zijn publiek leesbaar"
  on public.listings for select
  using (
    actief = true
    or verkocht = true
    or auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

drop policy if exists "Admins modereren advertenties" on public.listings;
create policy "Admins modereren advertenties"
  on public.listings for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

drop policy if exists "Gebruiker kan eigen listing aanpassen" on public.listings;
create policy "Gebruiker kan eigen listing aanpassen"
  on public.listings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
