-- Beveiliging: search_path vastzetten en directe uitvoering blokkeren voor
-- interne trigger-/beheerfuncties (naar aanleiding van Supabase's Security
-- Advisor-waarschuwingen "Function Search Path Mutable" en "Public/Signed In
-- Users Can Execute SECURITY DEFINER Function").
--
-- 1. SET search_path voorkomt dat een functie objecten uit een andere,
--    mogelijk kwaadwillend aangemaakte schema oppikt in plaats van de
--    bedoelde tabellen uit "public".
-- 2. REVOKE EXECUTE zorgt dat alleen de database zelf deze functies mag
--    aanroepen (via triggers), niet een ingelogde of anonieme gebruiker
--    rechtstreeks via de API. Triggers blijven gewoon werken — die lopen
--    buiten de normale rechtencontrole om.
--
-- handle_new_user, update_gemiddelde_beoordeling en update_aantalvolgers
-- zijn pure trigger-functies (geen enkele client-aanroep mogelijk of nodig).
-- rls_auto_enable wordt nergens vanuit de app aangeroepen.

ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.update_gemiddelde_beoordeling() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.update_gemiddelde_beoordeling() FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.update_aantalvolgers() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.update_aantalvolgers() FROM PUBLIC, anon, authenticated;

ALTER FUNCTION public.rls_auto_enable() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
