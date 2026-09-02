-- Fix: geblokkeerde gebruikers konden toch berichten sturen in een gesprek
-- dat al bestond vóór de blokkade.
--
-- De client checkt een blokkade alleen bij het STARTEN van een nieuw gesprek
-- (product/[id]/page.tsx, "Neem contact op"), niet bij het versturen van een
-- bericht in een bestaand gesprek (messages/[id]/page.tsx). Dat is op
-- zichzelf al een bug, maar erger: er was ook geen enkele RLS-restrictie op
-- de messages-tabel die dit blokkeert. Getest op 2 sep 2026: met een
-- rechtstreekse insert (buiten de UI om, met een geldig sessie-token) kon de
-- geblokkeerde gebruiker gewoon een bericht plaatsen.
--
-- Deze policy is RESTRICTIVE (niet permissive): in tegenstelling tot de
-- eerdere additieve policies in dit project (die met OR een extra toegestane
-- situatie toevoegen), trekt een restrictive policy juist een grens die
-- ALTIJD moet gelden, ongeacht welke permissive insert-policy al bestaat.
-- Daarom is dit veilig toe te voegen zonder de bestaande insert-policy op
-- messages te hoeven kennen of aan te passen.
create policy "Geen berichten tussen geblokkeerde gebruikers"
on public.messages
as restrictive
for insert
to authenticated
with check (
  not exists (
    select 1
    from public.conversations c
    join public.blocks b
      on (b.blokkeerder_id = c.buyer_id and b.geblokkeerd_id = c.seller_id)
      or (b.blokkeerder_id = c.seller_id and b.geblokkeerd_id = c.buyer_id)
    where c.id = messages.conversation_id
  )
);
