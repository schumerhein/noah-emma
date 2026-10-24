-- ============================================
-- Bod accepteren of afwijzen (24 okt 2026)
--
-- De app laat de verkoper nu in de chat een bod accepteren of afwijzen.
-- De status-waarden ('openstaand', 'geaccepteerd', 'afgewezen') en de
-- UPDATE-policy "verkoper mag reageren" bestonden al; dit bestand zet de
-- randen strak:
--
-- 1. Alleen de kolom status is aan te passen (voorheen kon een verkoper via
--    de API ook bedrag of bieder_id van een bod op z'n advertentie wijzigen).
-- 2. Een bod gaat alleen van 'openstaand' naar 'geaccepteerd' of
--    'afgewezen'; een eenmaal beantwoord bod blijft zoals het is.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

revoke update on public.biedingen from anon, authenticated;
grant update (status) on public.biedingen to authenticated;

drop policy if exists "verkoper mag reageren" on public.biedingen;
create policy "verkoper mag reageren"
  on public.biedingen for update
  using (auth.uid() in (select l.user_id from public.listings l where l.id = biedingen.listing_id))
  with check (auth.uid() in (select l.user_id from public.listings l where l.id = biedingen.listing_id));

create or replace function public.bod_status_overgang()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status is distinct from old.status
     and not (old.status = 'openstaand' and new.status in ('geaccepteerd', 'afgewezen')) then
    raise exception 'Dit bod is al beantwoord (%).', old.status;
  end if;
  return new;
end;
$$;

drop trigger if exists bod_status_overgang on public.biedingen;
create trigger bod_status_overgang
  before update on public.biedingen
  for each row execute function public.bod_status_overgang();

notify pgrst, 'reload schema';
