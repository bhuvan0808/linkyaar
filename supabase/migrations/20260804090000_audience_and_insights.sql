-- SPDX-License-Identifier: AGPL-3.0-or-later
-- Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

-- ============================================================
-- LinkYaar — Audience tools & richer insights
-- ============================================================
--  * contacts: email subscribers collected on public profiles
--  * reviews: audience reviews with owner moderation
--  * profiles: toggles to enable each block
--  * device/browser/os columns for analytics breakdowns
--  * analytics_breakdown RPC (countries / sources / devices)
-- ============================================================

-- ─── Contacts (subscribers) ─────────────────────────────────
create table public.contacts (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  email      extensions.citext not null
             constraint email_format check (email::text ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  name       text constraint contact_name_length check (char_length(name) <= 60),
  source     text not null default 'subscribe'
             constraint source_allowed check (source in ('subscribe', 'contact')),
  created_at timestamptz not null default now()
);

create unique index contacts_unique_subscriber
  on public.contacts (profile_id, email) where source = 'subscribe';
create index contacts_profile_time_idx
  on public.contacts (profile_id, created_at desc);

-- ─── Reviews ────────────────────────────────────────────────
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  author_name text not null
              constraint author_name_length check (char_length(author_name) between 1 and 60),
  rating      integer not null constraint rating_range check (rating between 1 and 5),
  body        text constraint body_length check (char_length(body) <= 280),
  is_approved boolean not null default false,
  created_at  timestamptz not null default now()
);

create index reviews_profile_idx
  on public.reviews (profile_id, is_approved, created_at desc);

-- ─── Profile toggles ────────────────────────────────────────
alter table public.profiles
  add column subscribe_enabled boolean not null default false,
  add column reviews_enabled   boolean not null default false;

-- ─── Device breakdown columns ───────────────────────────────
alter table public.profile_views
  add column device  text,
  add column browser text,
  add column os      text;

alter table public.link_clicks
  add column device text;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.contacts enable row level security;
alter table public.reviews  enable row level security;

-- Contacts: anyone may subscribe; only the owner may read/remove.
create policy "anyone can subscribe"
  on public.contacts for insert
  to anon, authenticated
  with check (true);

create policy "owners read own contacts"
  on public.contacts for select
  to authenticated
  using ((select auth.uid()) = profile_id);

create policy "owners delete own contacts"
  on public.contacts for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

-- Reviews: anyone may submit (always pending); approved ones are
-- public on public profiles; owners moderate.
create policy "anyone can submit pending reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (is_approved = false);

create policy "approved reviews on public profiles are readable"
  on public.reviews for select
  to anon, authenticated
  using (
    (select auth.uid()) = profile_id
    or (
      is_approved
      and exists (
        select 1 from public.profiles p
        where p.id = profile_id and p.is_public
      )
    )
  );

create policy "owners moderate own reviews"
  on public.reviews for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "owners delete own reviews"
  on public.reviews for delete
  to authenticated
  using ((select auth.uid()) = profile_id);

-- ============================================================
-- RPC: audience breakdown for the signed-in owner
-- ============================================================
create or replace function public.analytics_breakdown(p_days integer default 30)
returns table(kind text, label text, count bigint)
language sql
security definer set search_path = ''
stable
as $$
  with v as (
    select * from public.profile_views
    where profile_id = (select auth.uid())
      and created_at >= current_date - p_days
  )
  (
    select 'country', coalesce(country, 'Unknown'), count(*)::bigint
    from v group by 2 order by 3 desc limit 6
  )
  union all
  (
    select 'source',
      coalesce(substring(referrer from '^https?://(?:www\.)?([^/]+)'), 'Direct'),
      count(*)::bigint
    from v group by 2 order by 3 desc limit 6
  )
  union all
  (
    select 'device', coalesce(device, 'unknown'), count(*)::bigint
    from v group by 2 order by 3 desc limit 4
  );
$$;

grant execute on function public.analytics_breakdown(integer) to authenticated;
