-- ============================================================================
-- Supabase setup for the portfolio CMS.
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- ============================================================================

-- 1. PROJECTS TABLE -----------------------------------------------------------
create table if not exists public.projects (
    id           bigint generated always as identity primary key,
    title        text not null,
    tag          text,
    description  text,
    image_url    text,
    site_url     text,
    twitter_url  text,
    discord_url  text,
    telegram_url text,
    sort_order   int  default 0,
    created_at   timestamptz default now()
);

-- 2. ROW LEVEL SECURITY -------------------------------------------------------
-- Public can READ. Only logged-in (authenticated) users can write.
alter table public.projects enable row level security;

create policy "public read projects"
    on public.projects for select
    using (true);

create policy "authenticated insert projects"
    on public.projects for insert
    to authenticated with check (true);

create policy "authenticated update projects"
    on public.projects for update
    to authenticated using (true) with check (true);

create policy "authenticated delete projects"
    on public.projects for delete
    to authenticated using (true);

-- 3. STORAGE BUCKET FOR IMAGES ------------------------------------------------
-- Public bucket so images load on the site; only logged-in users can upload.
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "public read project images"
    on storage.objects for select
    using (bucket_id = 'project-images');

create policy "authenticated upload project images"
    on storage.objects for insert
    to authenticated with check (bucket_id = 'project-images');

create policy "authenticated update project images"
    on storage.objects for update
    to authenticated using (bucket_id = 'project-images');

create policy "authenticated delete project images"
    on storage.objects for delete
    to authenticated using (bucket_id = 'project-images');

-- 4. SEED EXISTING 4 PROJECTS -------------------------------------------------
-- image_url left null on purpose: re-upload each image through the admin panel
-- so it lives in Supabase storage. Until then the card shows a placeholder.
insert into public.projects (title, tag, description, site_url, sort_order) values
    ('Head Raider @ Wodsfun', 'Marketing',
     'Wolf of Dumb Street $WODS. A thrilling meme coin project built for degens.',
     'https://wods.fun', 0),
    ('Chimikinz', 'Web Dev',
     'A dynamic web application deployed on Vercel. Featuring responsive UI and seamless frontend integration.',
     'https://chimikinz.vercel.app/', 1),
    ('Deriverse Dashboard', 'Web Dev',
     'Professional on-chain trading analytics dashboard. Real-time data visualization for DeFi traders.',
     'https://deriversedashboard.vercel.app/', 2),
    ('BigSensei', 'Web Dev',
     'Web3 Growth & Marketing Strategist portfolio. A sleek, modern personal brand site.',
     'https://bigsensei.vercel.app/', 3);
