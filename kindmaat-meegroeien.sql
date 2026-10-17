-- ============================================
-- GROEIFUNCTIE: de maat van een kind groeit automatisch mee.
--
-- Elke nacht vergelijkt de database de ingestelde maat van elk kind met de
-- verwachte maat bij de leeftijd (uit de geboortedatum). Is het kind eruit
-- gegroeid, dan gaat de maat omhoog — en daarmee ook het filter in
-- Ontdekken. De maat gaat nooit vanzelf omlaag: kiest een ouder bewust een
-- maat groter, dan blijft die staan tot de leeftijd hem inhaalt.
--
-- maat_gegroeid_op wordt gezet zodat het beginscherm een melding kan tonen
-- ("Annabel is gegroeid! We laten nu maat 92 zien").
--
-- De maattabel is dezelfde als schatMaatOpLeeftijd() in src/lib/groei.ts —
-- pas ze altijd samen aan.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

create extension if not exists pg_cron;

alter table public.children add column if not exists maat_gegroeid_op timestamptz;

-- Zelfde maatlijst als GROEI_MAATLIJST in src/lib/groei.ts
create or replace function public.groei_maatlijst()
returns text[]
language sql
immutable
as $$
  select array['50','56','62','68','74','80','86','92','98','104','110','116','122','128','134','140','146','152','158/164']
$$;

-- Zelfde berekening als leeftijdInMaanden() + schatMaatOpLeeftijd()
create or replace function public.schat_maat_op_geboortedatum(geboortedatum date)
returns text
language sql
stable
as $$
  with l as (
    select greatest(0,
      (extract(year from (now() at time zone 'Europe/Amsterdam'))::int - extract(year from geboortedatum)::int) * 12
      + (extract(month from (now() at time zone 'Europe/Amsterdam'))::int - extract(month from geboortedatum)::int)
    ) as maanden
  )
  select case
    when maanden <= 1 then '50'
    when maanden <= 2 then '56'
    when maanden <= 4 then '62'
    when maanden <= 6 then '68'
    when maanden <= 9 then '74'
    when maanden <= 12 then '80'
    when maanden <= 18 then '86'
    when maanden <= 24 then '92'
    when maanden <= 36 then '98'
    when maanden <= 48 then '104'
    when maanden <= 60 then '110'
    when maanden <= 72 then '116'
    when maanden <= 84 then '122'
    when maanden <= 96 then '128'
    when maanden <= 108 then '134'
    when maanden <= 120 then '140'
    when maanden <= 132 then '146'
    when maanden <= 144 then '152'
    else '158/164'
  end
  from l
$$;

-- Zet de maat van kinderen die eruit gegroeid zijn een stap (of meer) omhoog.
create or replace function public.werk_kindmaten_bij()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  aantal integer;
begin
  update public.children c
  set maat = v.verwacht,
      lengte = case when v.verwacht = '158/164' then 160 else v.verwacht::int end,
      maat_gegroeid_op = now()
  from (
    select id, public.schat_maat_op_geboortedatum(geboortedatum) as verwacht
    from public.children
    where geboortedatum is not null
  ) v
  where c.id = v.id
    and array_position(public.groei_maatlijst(), c.maat) is not null
    and array_position(public.groei_maatlijst(), v.verwacht)
        > array_position(public.groei_maatlijst(), c.maat);
  get diagnostics aantal = row_count;
  return aantal;
end;
$$;

revoke execute on function public.werk_kindmaten_bij() from public, anon, authenticated;

-- Elke nacht om 03:17 (UTC)
select cron.schedule('kindmaten-meegroeien', '17 3 * * *', 'select public.werk_kindmaten_bij()');
