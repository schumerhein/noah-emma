-- ============================================
-- BEVEILIGING: een nieuwe advertentie begint altijd in de moderatiewachtrij
-- en nooit als gratis Boost.
--
-- Probleem: ingelogde gebruikers hebben INSERT-recht op álle kolommen van
-- listings, dus ook op moderatie_status en gepromoot. Via een rechtstreekse
-- aanroep aan de database (buiten de app om) kon iemand een advertentie
-- plaatsen die meteen 'goedgekeurd' was (moderatie overgeslagen) of
-- gepromoot (Boost zonder te betalen).
--
-- Oplossing: deze trigger zet die velden bij elke nieuwe advertentie terug
-- naar de veilige beginwaarden, wat er ook meegestuurd wordt. Boost wordt
-- alleen na betaling door de server aangezet (via een UPDATE, niet via
-- INSERT), dus dat blijft gewoon werken.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

create or replace function public.nieuwe_advertentie_veilige_start()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.moderatie_status := 'wachtend';
  new.moderatie_reden := null;
  new.gepromoot := false;
  new.promotie_verloopdatum := null;
  return new;
end;
$$;

revoke execute on function public.nieuwe_advertentie_veilige_start() from public, anon, authenticated;

drop trigger if exists nieuwe_advertentie_veilige_start on public.listings;
create trigger nieuwe_advertentie_veilige_start
  before insert on public.listings
  for each row execute function public.nieuwe_advertentie_veilige_start();
