-- ============================================
-- PRIVACY: nieuwe foto's op een al goedgekeurde advertentie gaan opnieuw
-- door de moderatie.
--
-- Probleem: via "Artikel aanpassen" kon een verkoper na goedkeuring nieuwe
-- foto's toevoegen, die dan meteen zichtbaar waren — zonder dat een
-- moderator ernaar keek. De app controleert nieuwe foto's nu zelf op
-- gezichten, maar gezichtsdetectie is nooit 100% zeker; de moderatie is de
-- tweede controle en mag dus niet overgeslagen kunnen worden.
--
-- Oplossing: zodra foto_urls verandert (door iemand anders dan een admin),
-- zet deze trigger moderatie_status terug op 'wachtend'. Foto's weghalen
-- telt niet mee — dat maakt een advertentie nooit onveiliger.
--
-- Een trigger mag moderatie_status wijzigen, ook al hebben gebruikers zelf
-- geen update-recht op die kolom (zie beveiliging-profiel-update.sql).
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

create or replace function public.herbeoordeel_bij_nieuwe_fotos()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.foto_urls is distinct from old.foto_urls
     -- alleen als er een foto bij is gekomen die er eerst niet was
     and exists (
       select 1 from unnest(coalesce(new.foto_urls, '{}')) as url
       where url <> all (coalesce(old.foto_urls, '{}'))
     )
     and not exists (
       select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true
     )
  then
    new.moderatie_status := 'wachtend';
  end if;
  return new;
end;
$$;

revoke execute on function public.herbeoordeel_bij_nieuwe_fotos() from public, anon, authenticated;

drop trigger if exists herbeoordeel_bij_nieuwe_fotos on public.listings;
create trigger herbeoordeel_bij_nieuwe_fotos
  before update on public.listings
  for each row execute function public.herbeoordeel_bij_nieuwe_fotos();
