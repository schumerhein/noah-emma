-- Fix: leesbevestigingen (het dubbele vinkje "✓✓") werken nooit.
--
-- Gevonden tijdens een systematische RLS-audit van alle 14 tabellen (niet
-- via handmatig klikken — dit was tot nu toe onopgemerkt gebleven).
--
-- messages/[id]/page.tsx markeert bij het openen van een gesprek de
-- berichten van de ANDER als gelezen:
--   supabase.from("messages").update({ gelezen: true })
--     .eq("conversation_id", id).neq("sender_id", user.id)
--
-- Maar de bestaande policy "Users can manage messages in own conversations"
-- (FOR ALL) heeft een CHECK van (auth.uid() = sender_id) — die geldt voor
-- ELKE update, dus ook wanneer je enkel het bericht van de ANDER als
-- gelezen probeert te markeren. Empirisch bevestigd op 2 sep 2026: een
-- rechtstreekse update door de ontvanger faalt met 42501 "new row violates
-- row-level security policy".
--
-- Oplossing in twee delen:
-- 1. Kolom-specifiek UPDATE-recht: authenticated mag alleen de kolom
--    "gelezen" bijwerken. Dit is nodig VOORDAT de policy hieronder wordt
--    verruimd — anders zou een gespreksdeelnemer ineens ook de "tekst" of
--    "sender_id" van andermans bericht kunnen wijzigen (want de bestaande
--    krappe CHECK was toevallig ook de enige bescherming daartegen).
-- 2. Extra UPDATE-policy die toestaat dat een gespreksdeelnemer (koper of
--    verkoper in die conversation) een bericht bijwerkt, ongeacht wie de
--    afzender is — additief naast de bestaande ALL-policy, dus die blijft
--    intact voor de overige gevallen (eigen bericht versturen etc.).
--
-- Veilig om vaker te draaien.

revoke update on public.messages from authenticated;
grant update (gelezen) on public.messages to authenticated;

create policy "Deelnemer mag bericht als gelezen markeren"
on public.messages
for update
to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
    and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
)
with check (
  exists (
    select 1 from public.conversations c
    where c.id = messages.conversation_id
    and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

notify pgrst, 'reload schema';
