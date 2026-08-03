-- ============================================================
-- LinkYaar — Profile & Link Expansion
-- ============================================================
--  * Richer profile identity fields (headline, location, …)
--  * Richer links (description, thumbnail, emoji, featured,
--    scheduling window)
--  * Full theme catalog
--  * Analytics RPCs (owner-scoped) + username availability RPC
-- ============================================================

-- ─── Profiles: identity fields ──────────────────────────────
alter table public.profiles
  add column headline   text constraint headline_length   check (char_length(headline) <= 100),
  add column occupation text constraint occupation_length check (char_length(occupation) <= 60),
  add column location   text constraint location_length   check (char_length(location) <= 60),
  add column pronouns   text constraint pronouns_length   check (char_length(pronouns) <= 30),
  add column cover_url  text;

-- ─── Links: presentation + scheduling ───────────────────────
alter table public.links
  add column description   text constraint description_length check (char_length(description) <= 200),
  add column thumbnail_url text,
  add column emoji         text constraint emoji_length check (char_length(emoji) <= 16),
  add column is_featured   boolean not null default false,
  add column starts_at     timestamptz,
  add column ends_at       timestamptz;

-- ─── Theme catalog ──────────────────────────────────────────
-- tokens: { mode, background, foreground, muted, accent,
--           buttonVariant: filled|outline|glass|soft|gradient,
--           buttonRadius: pill|rounded|square }
insert into public.themes (key, name, description, tokens) values
  ('minimal', 'Minimal', 'Pure white, near-black ink, quiet confidence.',
   '{"mode":"light","background":"oklch(1 0 0)","foreground":"oklch(0.17 0.01 286)","muted":"oklch(0.55 0.01 286)","accent":"oklch(0.17 0.01 286)","buttonVariant":"outline","buttonRadius":"rounded"}'),
  ('elegant', 'Elegant', 'Warm ivory with deep espresso serif energy.',
   '{"mode":"light","background":"oklch(0.97 0.012 80)","foreground":"oklch(0.25 0.03 60)","muted":"oklch(0.5 0.02 70)","accent":"oklch(0.45 0.09 50)","buttonVariant":"soft","buttonRadius":"pill"}'),
  ('luxury', 'Luxury', 'Champagne on charcoal, gold-leaf accents.',
   '{"mode":"dark","background":"oklch(0.2 0.01 80)","foreground":"oklch(0.93 0.03 90)","muted":"oklch(0.65 0.03 85)","accent":"oklch(0.8 0.12 90)","buttonVariant":"outline","buttonRadius":"square"}'),
  ('soft', 'Soft', 'Powder blush and gentle rounded warmth.',
   '{"mode":"light","background":"oklch(0.96 0.015 20)","foreground":"oklch(0.3 0.05 20)","muted":"oklch(0.55 0.04 20)","accent":"oklch(0.62 0.14 15)","buttonVariant":"soft","buttonRadius":"pill"}'),
  ('editorial', 'Editorial', 'Newsprint white, brutal black, one red accent.',
   '{"mode":"light","background":"oklch(0.98 0 0)","foreground":"oklch(0.12 0 0)","muted":"oklch(0.45 0 0)","accent":"oklch(0.55 0.2 25)","buttonVariant":"filled","buttonRadius":"square"}'),
  ('graphite', 'Graphite', 'Matte charcoal with silver text.',
   '{"mode":"dark","background":"oklch(0.24 0.005 286)","foreground":"oklch(0.9 0.005 286)","muted":"oklch(0.65 0.008 286)","accent":"oklch(0.75 0.02 286)","buttonVariant":"soft","buttonRadius":"rounded"}'),
  ('amoled', 'AMOLED', 'True black. Maximum contrast, zero glow.',
   '{"mode":"dark","background":"oklch(0 0 0)","foreground":"oklch(0.98 0 0)","muted":"oklch(0.6 0 0)","accent":"oklch(0.98 0 0)","buttonVariant":"outline","buttonRadius":"pill"}'),
  ('noir', 'Noir', 'Smoky monochrome with a violet whisper.',
   '{"mode":"dark","background":"oklch(0.18 0.012 300)","foreground":"oklch(0.92 0.01 300)","muted":"oklch(0.6 0.02 300)","accent":"oklch(0.7 0.12 300)","buttonVariant":"glass","buttonRadius":"rounded"}'),
  ('space', 'Space', 'Deep indigo cosmos, aurora accent.',
   '{"mode":"dark","background":"oklch(0.17 0.05 275)","foreground":"oklch(0.95 0.01 275)","muted":"oklch(0.65 0.03 275)","accent":"oklch(0.75 0.15 190)","buttonVariant":"gradient","buttonRadius":"pill"}'),
  ('creator', 'Creator', 'Electric violet gradient — the signature look.',
   '{"mode":"dark","background":"linear-gradient(160deg, oklch(0.2 0.06 300), oklch(0.14 0.04 265))","foreground":"oklch(0.97 0.005 85)","muted":"oklch(0.72 0.03 290)","accent":"oklch(0.64 0.21 293)","buttonVariant":"glass","buttonRadius":"pill"}'),
  ('sunrise', 'Sunrise', 'Peach-to-rose gradient, warm and open.',
   '{"mode":"light","background":"linear-gradient(160deg, oklch(0.95 0.04 60), oklch(0.92 0.06 20))","foreground":"oklch(0.28 0.06 30)","muted":"oklch(0.5 0.05 30)","accent":"oklch(0.6 0.16 25)","buttonVariant":"filled","buttonRadius":"pill"}'),
  ('forest', 'Forest', 'Deep evergreen with morning-light text.',
   '{"mode":"dark","background":"oklch(0.22 0.04 160)","foreground":"oklch(0.95 0.01 140)","muted":"oklch(0.68 0.03 150)","accent":"oklch(0.75 0.13 150)","buttonVariant":"soft","buttonRadius":"rounded"}')
on conflict (key) do nothing;

-- Update the original three to the tokens contract
update public.themes set tokens = '{"mode":"dark","background":"oklch(0.165 0.014 285)","foreground":"oklch(0.955 0.006 85)","muted":"oklch(0.68 0.015 286)","accent":"oklch(0.64 0.21 293)","buttonVariant":"glass","buttonRadius":"rounded"}' where key = 'midnight';
update public.themes set tokens = '{"mode":"light","background":"oklch(0.984 0.004 85)","foreground":"oklch(0.19 0.022 286)","muted":"oklch(0.5 0.02 286)","accent":"oklch(0.565 0.235 292)","buttonVariant":"filled","buttonRadius":"rounded"}' where key = 'daylight';
update public.themes set tokens = '{"mode":"light","background":"oklch(0.945 0.026 295)","foreground":"oklch(0.24 0.05 289)","muted":"oklch(0.45 0.04 290)","accent":"oklch(0.5 0.2 292)","buttonVariant":"soft","buttonRadius":"pill"}' where key = 'lavender';

-- ─── RPC: username availability (bypasses RLS safely) ───────
create or replace function public.username_available(candidate text)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select not exists (
    select 1 from public.profiles where username = candidate::extensions.citext
  );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- ─── RPC: daily views + clicks for the signed-in owner ──────
create or replace function public.analytics_daily(p_days integer default 30)
returns table(day date, views bigint, clicks bigint)
language sql
security definer set search_path = ''
stable
as $$
  with series as (
    select generate_series(current_date - (p_days - 1), current_date, interval '1 day')::date as d
  )
  select
    s.d,
    coalesce((select count(*) from public.profile_views v
      where v.profile_id = (select auth.uid()) and v.created_at::date = s.d), 0),
    coalesce((select count(*) from public.link_clicks c
      where c.profile_id = (select auth.uid()) and c.created_at::date = s.d), 0)
  from series s
  order by s.d;
$$;

grant execute on function public.analytics_daily(integer) to authenticated;

-- ─── RPC: top links by clicks for the signed-in owner ───────
create or replace function public.analytics_top_links(p_days integer default 30)
returns table(link_id uuid, title text, clicks bigint)
language sql
security definer set search_path = ''
stable
as $$
  select l.id, l.title, count(c.id)::bigint
  from public.links l
  left join public.link_clicks c
    on c.link_id = l.id and c.created_at >= current_date - p_days
  where l.profile_id = (select auth.uid())
  group by l.id, l.title
  order by count(c.id) desc, l.position
  limit 10;
$$;

grant execute on function public.analytics_top_links(integer) to authenticated;
