-- Kolom voor geboortedatum (leeftijdsverificatie) op profielen.
-- Plak dit in de Supabase SQL-editor en klik Run.
alter table public.profiles
  add column if not exists geboortedatum date;
