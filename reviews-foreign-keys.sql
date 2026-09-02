-- Fix: reviews van een verkoper/gebruiker worden nergens getoond
-- (verkopersprofiel, eigen profiel, productpagina), ook al bestaan ze echt.
--
-- Oorzaak: de reviews-tabel heeft geen foreign-key-constraints naar
-- profiles. De app-code embedt de naam van de reviewer via PostgREST-syntax
-- die zo'n FK vereist (bv. "reviewer:profiles!reviews_reviewer_id_fkey(naam)"
-- in src/app/seller/[id]/page.tsx, src/app/profile/page.tsx en
-- src/app/product/[id]/page.tsx). Zonder de FK faalt die query in zijn
-- geheel (PostgREST-foutcode PGRST200), en omdat de app die fout niet apart
-- afvangt, blijft de reviews-lijst gewoon leeg lijken.
--
-- Voor het toevoegen is gecontroleerd dat er geen wees-rijen zijn (reviews
-- die verwijzen naar een niet-bestaand profiel) — dat was niet het geval.
-- Veilig om vaker te draaien.

alter table public.reviews drop constraint if exists reviews_reviewer_id_fkey;
alter table public.reviews
  add constraint reviews_reviewer_id_fkey
  foreign key (reviewer_id) references public.profiles(id) on delete cascade;

alter table public.reviews drop constraint if exists reviews_reviewed_id_fkey;
alter table public.reviews
  add constraint reviews_reviewed_id_fkey
  foreign key (reviewed_id) references public.profiles(id) on delete cascade;

notify pgrst, 'reload schema';
