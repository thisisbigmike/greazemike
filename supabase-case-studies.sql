-- ============================================================================
-- Case Studies table for the portfolio CMS.
-- Run AFTER supabase-setup.sql, same place: SQL Editor -> New query -> Run.
-- ============================================================================

create table if not exists public.case_studies (
    id           bigint generated always as identity primary key,
    title        text not null,
    description  text,
    image_url    text,
    role         text,          -- "My Role"
    tech_stack   text,          -- "Tech Stack"
    features     text,          -- "Key Features", one per line
    challenge    text,          -- "Challenge & Solution"
    live_url     text,
    sort_order   int  default 0,
    created_at   timestamptz default now()
);

alter table public.case_studies enable row level security;

create policy "public read case_studies"
    on public.case_studies for select using (true);

create policy "authenticated insert case_studies"
    on public.case_studies for insert to authenticated with check (true);

create policy "authenticated update case_studies"
    on public.case_studies for update to authenticated using (true) with check (true);

create policy "authenticated delete case_studies"
    on public.case_studies for delete to authenticated using (true);

-- Seed the 2 existing case studies (images re-upload via admin) ---------------
insert into public.case_studies (title, description, role, tech_stack, features, challenge, live_url, sort_order) values
    ('Deriverse Dashboard',
     'A professional on-chain trading analytics platform built for DeFi traders on the Solana ecosystem. The dashboard provides real-time portfolio tracking, P&L analysis, and historical trade data — all in a clean, intuitive interface.',
     'Full-Stack Developer',
     'Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma',
     E'Real-time portfolio value tracking with live crypto price feeds\nWallet-based authentication with Solana wallet adapter integration\nPersistent trade history & journal entries stored in PostgreSQL\nDark/light mode theming with responsive, mobile-first design',
     'Building a reliable real-time analytics layer on top of on-chain data required careful API design and caching strategies to deliver fast load times while keeping data accurate and up-to-date.',
     'https://deriversedashboard.vercel.app/', 0),
    ('Chimikinz',
     'A charming NFT collection website for 2,222 unique "lucky oddlings." The project required a storytelling-driven landing page that would captivate the community, communicate the brand''s lore, and drive mint engagement.',
     'Frontend Developer',
     'HTML, CSS, JavaScript, Vercel',
     E'Immersive storytelling sections with animated scroll reveals\nMulti-phase roadmap visualization with clear milestone markers\nTeam showcase & community-driven calls-to-action\nIntegrated mint link & Discord community onboarding flow',
     'The challenge was translating a whimsical, stardust-born brand identity into a web experience that felt authentic without sacrificing usability. Achieved this through a warm color palette, playful typography, and narrative-first layout.',
     'https://chimikinz.vercel.app/', 1);
