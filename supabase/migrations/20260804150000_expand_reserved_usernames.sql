-- SPDX-License-Identifier: AGPL-3.0-or-later
-- Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

-- New static routes must never be claimable as usernames.
alter table public.profiles drop constraint username_reserved;
alter table public.profiles add constraint username_reserved check (
  username::text not in (
    'admin', 'api', 'app', 'auth', 'blog', 'dashboard', 'docs',
    'help', 'legal', 'login', 'logout', 'privacy', 'root',
    'settings', 'signup', 'support', 'terms', 'www', 'linkyaar',
    'about', 'cookies', 'onboarding', 'roadmap', 'changelog',
    'contribute', 'conduct', 'security', 'license', 'brand', 'hello'
  )
);
