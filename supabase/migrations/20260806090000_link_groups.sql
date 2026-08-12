-- SPDX-License-Identifier: AGPL-3.0-or-later
-- Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

-- ============================================================
-- Link groups (categories) — organize links under headings
-- ============================================================

create table public.link_groups (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title      text not null
             constraint group_title_length check (char_length(title) between 1 and 60),
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index link_groups_profile_position_idx
  on public.link_groups (profile_id, position);

-- Links may belong to one group. Deleting a group ungroups its links
-- (set null) rather than deleting them.
alter table public.links
  add column group_id uuid references public.link_groups (id) on delete set null;

create index links_group_idx on public.links (group_id);

-- ─── RLS ────────────────────────────────────────────────────
alter table public.link_groups enable row level security;

create policy "groups on public profiles are readable"
  on public.link_groups for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id
        and (p.is_public or p.id = (select auth.uid()))
    )
  );

create policy "users can insert own groups"
  on public.link_groups for insert
  to authenticated
  with check ((select auth.uid()) = profile_id);

create policy "users can update own groups"
  on public.link_groups for update
  to authenticated
  using ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

create policy "users can delete own groups"
  on public.link_groups for delete
  to authenticated
  using ((select auth.uid()) = profile_id);
