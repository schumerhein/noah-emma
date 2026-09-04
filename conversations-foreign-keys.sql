-- Fix: Transacties-pagina (/orders) toont altijd "Gekocht (0)" / "Verkocht (0)",
-- ook als er echt afgeronde deals zijn.
--
-- Twee stapelende oorzaken, gevonden tijdens een herhaalde testronde na de
-- deploy van vandaag:
-- 1. src/app/orders/page.tsx gebruikte niet-bestaande kolomnamen
--    (koper_id/verkoper_id i.p.v. buyer_id/seller_id) — de hele query
--    faalde stil, dus altijd 0 resultaten. Los opgelost in de code.
-- 2. Zelfs met de juiste kolomnamen: er is geen foreign-key-constraint
--    tussen conversations en profiles, dus de naam-embed voor koper/
--    verkoper (nodig om "Gekocht van {naam}" te tonen) zou alsnog stuk
--    blijven — exact hetzelfde probleem als eerder gevonden bij reviews.
--
-- Voor het toevoegen is gecontroleerd dat er geen wees-rijen zijn
-- (conversations die verwijzen naar een niet-bestaand profiel) — dat was
-- niet het geval. Veilig om vaker te draaien.

alter table public.conversations drop constraint if exists conversations_buyer_id_fkey;
alter table public.conversations
  add constraint conversations_buyer_id_fkey
  foreign key (buyer_id) references public.profiles(id) on delete cascade;

alter table public.conversations drop constraint if exists conversations_seller_id_fkey;
alter table public.conversations
  add constraint conversations_seller_id_fkey
  foreign key (seller_id) references public.profiles(id) on delete cascade;

notify pgrst, 'reload schema';
