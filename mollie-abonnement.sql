-- ============================================
-- Premium wordt een echt doorlopend Mollie-abonnement (maandelijks
-- automatisch geïncasseerd, opzegbaar). Deze twee kolommen koppelen een
-- gebruiker aan de Mollie-klant en het actieve abonnement.
--
-- Alleen server-side (service role) mag deze twee kolommen schrijven —
-- daarom NIET toegevoegd aan de eerdere "grant update (...) to
-- authenticated" lijst voor profiles.
--
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

alter table public.profiles
  add column if not exists mollie_customer_id text,
  add column if not exists mollie_subscription_id text;
