-- SPDX-License-Identifier: AGPL-3.0-or-later
-- Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

-- ============================================================
-- LinkYaar — Initial Schema
-- ============================================================
-- Design notes:
--  * profiles is 1:1 with auth.users, auto-created by trigger.
--  * All user-facing tables carry RLS. Public reads are allowed
--    only through profiles.is_public.
--  * links.position drives drag-and-drop ordering.
--  * Analytics tables are insert-only for visitors, readable
--    only by the profile owner.
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "citext" with schema extensions;

-- ─── Helper: updated_at maintenance ─────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Themes (preset catalog, managed via migrations) ────────
create table public.themes (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  name        text not null,
  description text,
  tokens      jsonb not null default '{}'::jsonb,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.themes is 'Preset visual themes selectable on a profile.';

-- ─── Profiles ───────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     extensions.citext unique
               constraint username_format check (
                 username::text ~ '^[a-z0-9_]{3,30}$'
               )
               constraint username_reserved check (
                 username::text not in (
                   'admin', 'api', 'app', 'auth', 'blog', 'dashboard', 'docs',
                   'help', 'legal', 'login', 'logout', 'privacy', 'root',
                   'settings', 'signup', 'support', 'terms', 'www', 'linkyaar'
                 )
               ),
  display_name text
               constraint display_name_length check (char_length(display_name) <= 60),
  bio          text
               constraint bio_length check (char_length(bio) <= 300),
  avatar_url   text,
  theme_id     uuid references public.themes (id) on delete set null,
  is_public    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Public creator profile, 1:1 with auth.users.';

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Links ──────────────────────────────────────────────────
create table public.links (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title      text not null
             constraint title_length check (char_length(title) between 1 and 100),
  url        text not null
             constraint url_format check (url ~* '^https?://'),
  position   integer not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index links_profile_position_idx on public.links (profile_id, position);

create trigger links_updated_at
  before update on public.links
  for each row execute function public.set_updated_at();

-- ─── Social links ───────────────────────────────────────────
create table public.social_links (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  platform   text not null
             constraint platform_allowed check (platform in (
               'twitter', 'instagram', 'youtube', 'github', 'linkedin',
               'tiktok', 'twitch', 'dribbble', 'behance', 'spotify',
               'facebook', 'threads', 'website', 'email'
             )),
  url        text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  unique (profile_id, platform)
);

create index social_links_profile_idx on public.social_links (profile_id, position);

-- ─── User settings ──────────────────────────────────────────
create table public.user_settings (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

-- ─── Analytics (future feature; schema ready now) ───────────
create table public.profile_views (
  id         bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  referrer   text,
  country    text,
  created_at timestamptz not null default now()
);

create index profile_views_profile_time_idx
  on public.profile_views (profile_id, created_at desc);

create table public.link_clicks (
  id         bigint generated always as identity primary key,
  link_id    uuid not null references public.links (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  referrer   text,
  country    text,
  created_at timestamptz not null default now()
);

create index link_clicks_link_time_idx
  on public.link_clicks (link_id, created_at desc);
create index link_clicks_profile_time_idx
  on public.link_clicks (profile_id, created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.themes         enable row level security;
alter table public.profiles       enable row level security;
alter table public.links          enable row level security;
alter table public.social_links   enable row level security;
alter table public.user_settings  enable row level security;
alter table public.profile_views  enable row level security;
alter table public.link_clicks    enable row level security;

-- Themes: everyone can read the catalog.
create policy "themes are readable by everyone"
  on public.themes for select
  to anon, authenticated
  using (true);

-- Profiles
create policy "public profiles are readable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (is_public or (select auth.uid()) = id);

create policy "users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Links (readable when parent profile is public, or own)
create policy "links on public profiles are readable"
  on public.links for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id
        and (p.is_public or p.id = (select auth.uid()))
    )
  );

create policy "users can insert own links"
  on public.links for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "users can update own links"
  on public.links for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "users can delete own links"
  on public.links for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

-- Social links (same shape as links)
create policy "social links on public profiles are readable"
  on public.social_links for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id
        and (p.is_public or p.id = (select auth.uid()))
    )
  );

create policy "users can insert own social links"
  on public.social_links for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "users can update own social links"
  on public.social_links for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "users can delete own social links"
  on public.social_links for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

-- Settings: strictly private.
create policy "users manage own settings"
  on public.user_settings for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Analytics: anyone may record an event; only owners may read.
create policy "anyone can record profile views"
  on public.profile_views for insert
  to anon, authenticated
  with check (true);

create policy "owners can read own profile views"
  on public.profile_views for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "anyone can record link clicks"
  on public.link_clicks for insert
  to anon, authenticated
  with check (true);

create policy "owners can read own link clicks"
  on public.link_clicks for select
  to authenticated
  using ((select auth.uid()) = profile_id);

-- ============================================================
-- Storage: avatars bucket
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

-- Each user owns a folder named by their user id: avatars/<uid>/…
create policy "avatar images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

create policy "users can upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users can delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- ============================================================
-- Seed: default themes
-- ============================================================
insert into public.themes (key, name, description, tokens, is_default) values
  ('midnight', 'Midnight', 'Deep graphite canvas with electric violet accents.',
   '{"background": "oklch(0.165 0.014 285)", "foreground": "oklch(0.955 0.006 85)", "accent": "oklch(0.64 0.21 293)"}', true),
  ('daylight', 'Daylight', 'Warm white canvas with midnight ink.',
   '{"background": "oklch(0.984 0.004 85)", "foreground": "oklch(0.19 0.022 286)", "accent": "oklch(0.565 0.235 292)"}', false),
  ('lavender', 'Lavender', 'Soft lavender wash, quiet and elegant.',
   '{"background": "oklch(0.945 0.026 295)", "foreground": "oklch(0.24 0.05 289)", "accent": "oklch(0.5 0.2 292)"}', false);
