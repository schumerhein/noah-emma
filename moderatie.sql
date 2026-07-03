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
