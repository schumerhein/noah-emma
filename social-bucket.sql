-- Openbare opslag-bucket "social" voor social media (Instagram-carrousels).
-- Meta haalt carrousel-foto's alleen op van een openbare link. marketing/tiktok/upload_meta.py
-- zet de slides hier tijdelijk neer (met de service role key) en verwijdert ze na het plaatsen.
-- Alleen JPEG, max 10 MB. Schrijven kan alleen met de service role key (geen policies voor anon).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('social', 'social', true, 10485760, array['image/jpeg'])
on conflict (id) do nothing;
