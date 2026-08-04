-- SPDX-License-Identifier: AGPL-3.0-or-later
-- Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

-- ============================================================
-- Theme Studio: per-profile customization + premium catalog
-- ============================================================

-- Per-profile theme overrides (partial ThemeTokens json) and
-- header layout selection.
alter table public.profiles
  add column custom_theme jsonb,
  add column header_layout text not null default 'classic'
    constraint header_layout_allowed check (header_layout in ('classic', 'portrait', 'minimal'));

-- ─── Premium catalog v2 ─────────────────────────────────────
-- tokens: mode, background, foreground, muted, accent,
--         buttonVariant, buttonRadius, font
insert into public.themes (key, name, description, tokens) values
  ('sunset', 'Sunset Club', 'Teal to blush to burnt orange — the flagship look.',
   '{"mode":"light","background":"linear-gradient(175deg, oklch(0.92 0.06 200) 0%, oklch(0.88 0.09 340) 45%, oklch(0.62 0.17 40) 100%)","foreground":"oklch(0.25 0.05 300)","muted":"oklch(0.38 0.05 310)","accent":"oklch(0.28 0.06 320)","buttonVariant":"filled","buttonRadius":"pill","font":"sans"}'),
  ('mesh-berry', 'Berry Mesh', 'Deep berry mesh with soft glass buttons.',
   '{"mode":"dark","background":"radial-gradient(110% 80% at 15% 5%, oklch(0.45 0.16 340) 0%, transparent 55%), radial-gradient(120% 90% at 90% 20%, oklch(0.4 0.16 290) 0%, transparent 50%), oklch(0.2 0.06 315)","foreground":"oklch(0.96 0.01 340)","muted":"oklch(0.75 0.04 330)","accent":"oklch(0.7 0.14 350)","buttonVariant":"glass","buttonRadius":"pill","font":"display"}'),
  ('terracotta', 'Terracotta', 'Sun-baked clay and cream, editorial serif.',
   '{"mode":"light","background":"oklch(0.94 0.035 60)","foreground":"oklch(0.35 0.09 40)","muted":"oklch(0.5 0.07 45)","accent":"oklch(0.5 0.14 35)","buttonVariant":"filled","buttonRadius":"square","font":"serif"}'),
  ('matcha', 'Matcha', 'Whisked green tea calm, rounded and soft.',
   '{"mode":"light","background":"oklch(0.93 0.045 135)","foreground":"oklch(0.3 0.07 150)","muted":"oklch(0.45 0.05 145)","accent":"oklch(0.5 0.11 150)","buttonVariant":"soft","buttonRadius":"pill","font":"rounded"}'),
  ('midnight-gold', 'Midnight Gold', 'Near-black with gold-leaf accents.',
   '{"mode":"dark","background":"oklch(0.17 0.01 80)","foreground":"oklch(0.93 0.04 90)","muted":"oklch(0.65 0.04 88)","accent":"oklch(0.78 0.13 88)","buttonVariant":"outline","buttonRadius":"square","font":"elegant"}'),
  ('paper-press', 'Paper Press', 'Newsprint white, letterpress black, serif type.',
   '{"mode":"light","background":"oklch(0.98 0.004 90)","foreground":"oklch(0.15 0 0)","muted":"oklch(0.45 0 0)","accent":"oklch(0.15 0 0)","buttonVariant":"outline","buttonRadius":"rounded","font":"serif"}'),
  ('ocean', 'Ocean', 'Deep-sea blues with a cyan glow.',
   '{"mode":"dark","background":"linear-gradient(180deg, oklch(0.3 0.09 250) 0%, oklch(0.18 0.07 265) 100%)","foreground":"oklch(0.96 0.01 230)","muted":"oklch(0.72 0.04 240)","accent":"oklch(0.75 0.13 210)","buttonVariant":"glass","buttonRadius":"rounded","font":"sans"}'),
  ('bubblegum', 'Bubblegum', 'Pop pink with rounded everything.',
   '{"mode":"light","background":"oklch(0.9 0.07 350)","foreground":"oklch(0.32 0.12 355)","muted":"oklch(0.48 0.09 350)","accent":"oklch(0.55 0.19 5)","buttonVariant":"filled","buttonRadius":"pill","font":"rounded"}'),
  ('brutal', 'Brutalist', 'Hazard yellow, hard black, zero apologies.',
   '{"mode":"light","background":"oklch(0.9 0.16 100)","foreground":"oklch(0.12 0 0)","muted":"oklch(0.35 0.02 100)","accent":"oklch(0.12 0 0)","buttonVariant":"filled","buttonRadius":"square","font":"mono"}'),
  ('haze', 'Violet Haze', 'Soft violet wash, floaty and light.',
   '{"mode":"light","background":"linear-gradient(160deg, oklch(0.93 0.04 300) 0%, oklch(0.88 0.06 320) 100%)","foreground":"oklch(0.3 0.08 305)","muted":"oklch(0.48 0.06 305)","accent":"oklch(0.5 0.16 305)","buttonVariant":"soft","buttonRadius":"pill","font":"sans"}'),
  ('espresso', 'Espresso', 'Dark roast browns with steamed-milk text.',
   '{"mode":"dark","background":"oklch(0.24 0.03 60)","foreground":"oklch(0.94 0.02 80)","muted":"oklch(0.7 0.03 70)","accent":"oklch(0.68 0.09 65)","buttonVariant":"soft","buttonRadius":"rounded","font":"serif"}'),
  ('neon-noir', 'Neon Noir', 'Black on black with an electric cyan edge.',
   '{"mode":"dark","background":"oklch(0.13 0.01 260)","foreground":"oklch(0.96 0.01 200)","muted":"oklch(0.62 0.02 220)","accent":"oklch(0.8 0.13 195)","buttonVariant":"outline","buttonRadius":"pill","font":"mono"}')
on conflict (key) do nothing;

-- Flagship default: Sunset Club
update public.themes set is_default = false where is_default;
update public.themes set is_default = true where key = 'sunset';

-- New signups start on the flagship theme.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  default_theme uuid;
begin
  select id into default_theme from public.themes where is_default limit 1;
  insert into public.profiles (id, display_name, avatar_url, theme_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    default_theme
  );
  return new;
end;
$$;

-- Existing profiles without an explicit choice get the flagship too.
update public.profiles
set theme_id = (select id from public.themes where is_default limit 1)
where theme_id is null;
