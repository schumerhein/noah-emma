-- ============================================
-- Feedback van gebruikers (overal in de app te geven)
-- Plak dit in de Supabase SQL-editor en klik Run.
-- Veilig om meerdere keren uit te voeren.
-- ============================================

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Leeg bij gasten (niet ingelogd) of als het account later is verwijderd
  user_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('bug', 'verbetering', 'anders')),
  bericht text not null check (char_length(bericht) between 3 and 2000),
  -- Automatisch meegestuurde context, zodat jij niet hoeft door te vragen
  pagina text,
  apparaat text,
  scherm text,
  app_versie text,
  -- Optioneel: waar we een reactie naartoe kunnen sturen (vooral voor gasten)
  contact_email text,
  -- Alleen om spam van niet-ingelogde bezoekers te beperken (gehasht, geen echt IP)
  ip_hash text,
  status text not null default 'nieuw' check (status in ('nieuw', 'in_behandeling', 'afgehandeld')),
  admin_notitie text
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_user_id_idx on public.feedback (user_id);
create index if not exists feedback_ip_hash_idx on public.feedback (ip_hash, created_at desc);

alter table public.feedback enable row level security;

-- Geen insert-policy voor gebruikers: feedback gaat via /api/feedback
-- (service role), zodat ook gasten kunnen insturen mét spambeperking.

drop policy if exists "Admins lezen feedback" on public.feedback;
create policy "Admins lezen feedback"
  on public.feedback for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));

drop policy if exists "Admins beheren feedback" on public.feedback;
create policy "Admins beheren feedback"
  on public.feedback for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true));
