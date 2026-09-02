-- Fix: notificaties-tab toont geen favorieten/biedingen op je eigen advertenties.
--
-- Oorzaak: de bestaande RLS SELECT-policies op favorites/biedingen/followers
-- laten een gebruiker alleen rijen zien die over hemzelf gaan (bv. zijn eigen
-- favorieten-lijst, zijn eigen geplaatste biedingen). Maar messages/page.tsx
-- (laadNotificaties) heeft ook toegang nodig tot rijen die *anderen* op JOUW
-- advertentie hebben gezet, om je te kunnen laten zien "iemand heeft je
-- artikel geliked / erop geboden". Die toegang ontbrak, waardoor de tab
-- altijd leeg leek terwijl de onderliggende data wél klopte.
--
-- Deze policies zijn additief (CREATE POLICY, geen DROP): Postgres combineert
-- meerdere permissive policies voor dezelfde actie met OR, dus de bestaande
-- "eigen rijen"-policy blijft intact en dit voegt er alleen "of het is een
-- reactie op mijn eigen advertentie" aan toe.

-- 1. Favorieten op je eigen advertenties zichtbaar maken
create policy "Eigenaar ziet favorieten op eigen advertentie"
on public.favorites
for select
to authenticated
using (
  listing_id in (
    select id from public.listings where user_id = auth.uid()
  )
);

-- 2. Biedingen op je eigen advertenties zichtbaar maken
create policy "Eigenaar ziet biedingen op eigen advertentie"
on public.biedingen
for select
to authenticated
using (
  listing_id in (
    select id from public.listings where user_id = auth.uid()
  )
);

-- 3. Zien wie jou volgt (niet alleen wie jij volgt)
create policy "Gebruiker ziet eigen volgers"
on public.followers
for select
to authenticated
using (
  following_id = auth.uid()
);
