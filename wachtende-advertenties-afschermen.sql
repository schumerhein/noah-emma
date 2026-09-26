-- ============================================
-- PRIVACY: advertenties die nog niet zijn goedgekeurd, zijn alleen
-- zichtbaar voor de eigenaar en voor admins.
--
-- Probleem: de leesregel uit rls-reparatie.sql keek niet naar
-- moderatie_status. Alleen de app verborg wachtende advertenties; via een
-- rechtstreekse aanroep aan de database kon iedereen ze (met foto's)
-- opvragen — ook advertenties die nog niet door de moderatie waren, of die
-- na het toevoegen van nieuwe foto's terug in de wachtrij stonden.
--
-- Oplossing: voor anderen dan de eigenaar/admin geldt nu dat een
-- advertentie ook 'goedgekeurd' moet zijn. De rest van de regel blijft
-- gelijk (actief of verkocht; eigenaar en admin zien alles).
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

drop policy if exists "Listings zijn publiek leesbaar" on public.listings;
create policy "Listings zijn publiek leesbaar"
  on public.listings for select
  using (
    ((actief = true or verkocht = true) and moderatie_status = 'goedgekeurd')
    or auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Controle: hier hoort precies één regel uit te komen, met
-- moderatie_status in de "qual"-kolom.
select policyname, qual from pg_policies
where tablename = 'listings' and cmd = 'SELECT';
