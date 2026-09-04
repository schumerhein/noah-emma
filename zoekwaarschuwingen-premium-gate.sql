-- Bug: zoekwaarschuwingen instellen wordt overal geadverteerd als Premium-only
-- (Premium-modal op /search, FAQ, AI-assistent-prompt), maar was dat in de
-- praktijk niet: de enige "premium check" was een client-side overlay
-- (PremiumModal in src/app/search/page.tsx) die een niet-premium gebruiker
-- gewoon kan omzeilen door zelf de Supabase-insert aan te roepen (bijv. via
-- de browserconsole of een directe REST-call met hun eigen JWT) — de RLS-
-- policy op deze tabel checkte alleen eigenaarschap (auth.uid() = user_id),
-- niet premium-status. Bevestigd: een niet-premium testaccount kon zo een
-- echte zoekwaarschuwingen-rij aanmaken.
--
-- Fix: de ene ALL-policy wordt gesplitst per commando, en de INSERT-policy
-- krijgt een extra check dat de gebruiker actief premium is. SELECT/DELETE
-- blijven ongewijzigd (eigenaarschap volstaat — een gebruiker die premium
-- verliest mag zijn bestaande alerts nog zien/verwijderen, maar er geen
-- nieuwe meer aanmaken). Geen UPDATE-policy nodig: de app doet nooit een
-- update op deze tabel (alleen select/insert/delete).
--
-- Veilig om vaker te draaien.

drop policy if exists "zoekwaarschuwingen eigen" on public.zoekwaarschuwingen;

create policy "zoekwaarschuwingen select eigen"
  on public.zoekwaarschuwingen for select
  using (auth.uid() = user_id);

create policy "zoekwaarschuwingen insert premium"
  on public.zoekwaarschuwingen for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_premium = true
        and (p.premium_verloopdatum is null or p.premium_verloopdatum > now())
    )
  );

create policy "zoekwaarschuwingen delete eigen"
  on public.zoekwaarschuwingen for delete
  using (auth.uid() = user_id);
