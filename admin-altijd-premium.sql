-- ============================================
-- Admins zijn altijd Premium.
--
-- Premium wordt op veel plekken gecontroleerd (zoeken, AI-zoeken, swipe-
-- limiet, zoekwaarschuwingen-RLS). In plaats van overal "of admin" toe te
-- voegen, houdt deze trigger is_premium aan en de verloopdatum leeg zolang
-- iemand admin is — ook als een Mollie-betaling of opzegging die velden
-- later aanpast.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

create or replace function public.admin_altijd_premium()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_admin then
    new.is_premium := true;
    new.premium_verloopdatum := null;
  end if;
  return new;
end;
$$;

revoke execute on function public.admin_altijd_premium() from public, anon, authenticated;

create or replace trigger admin_altijd_premium
  before insert or update on public.profiles
  for each row execute function public.admin_altijd_premium();

-- Bestaande admins meteen Premium maken
update public.profiles set is_premium = true, premium_verloopdatum = null where is_admin;
