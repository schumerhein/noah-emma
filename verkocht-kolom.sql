-- Verkocht-status op advertenties, los van "verborgen".
-- Plak dit in de Supabase SQL-editor en klik Run.
alter table public.listings
  add column if not exists verkocht boolean not null default false;

-- Advertenties van al afgeronde deals eenmalig als verkocht markeren
update public.listings set verkocht = true
where id in (select listing_id from public.conversations where afgerond = true and listing_id is not null);
