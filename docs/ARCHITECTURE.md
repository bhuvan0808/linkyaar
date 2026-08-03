# Architecture

## Overview

LinkYaar is a Next.js App Router application backed entirely by Supabase
(Postgres + Auth + Storage). There is no separate API server: Server
Components and Server Actions talk to Supabase directly, and Postgres Row
Level Security is the authorization layer.

```
Browser ──► Next.js (Vercel)
              │  proxy.ts        refresh session, guard /dashboard
              │  RSC / Actions   server supabase client (cookies)
              │  Client comps    browser supabase client
              ▼
           Supabase ──► Postgres (RLS) · Auth (Google) · Storage (avatars)
```

## Why no API layer?

RLS makes the database self-defending: every query runs as the signed-in
user, so even a compromised client cannot read or write another user's rows.
This removes an entire tier of code (controllers, DTOs, auth middleware)
while being _more_ secure, not less. Server Actions cover the few cases that
need privileged orchestration.

## Directory Layout

| Path                     | Role                                                      |
| ------------------------ | --------------------------------------------------------- |
| `src/app/`               | Routes only — thin files that compose features            |
| `src/features/`          | Feature modules; each owns its components, hooks, actions |
| `src/components/ui/`     | shadcn/ui primitives (generated, then owned)              |
| `src/components/shared/` | Cross-feature composites (nav, footer, …)                 |
| `src/lib/`               | Framework glue: supabase clients, `env.ts`, `utils.ts`    |
| `src/services/`          | Data-access functions shared across features              |
| `src/providers/`         | React providers (TanStack Query, theme, …)                |
| `src/styles/`            | `globals.css` — the design token source of truth          |
| `src/types/`             | `database.ts` (mirrors schema), shared types              |
| `supabase/`              | SQL migrations — schema, RLS, triggers, seeds             |

**Rule of thumb:** code used by one feature lives in that feature's folder.
It graduates to `components/shared`, `hooks/`, or `services/` only when a
second feature needs it.

## Supabase Client Strategy

Three clients, one per runtime — this is the `@supabase/ssr` contract:

- `lib/supabase/client.ts` — browser (Client Components)
- `lib/supabase/server.ts` — RSC, Server Actions, Route Handlers
- `lib/supabase/proxy.ts` — session refresh inside `src/proxy.ts`
  (Next 16's successor to middleware)

Sessions live in cookies. The proxy refreshes tokens on every matched
request, so Server Components can always trust `auth.getUser()`.

## Design System

All visual decisions are tokens in `src/styles/globals.css` under
`@theme` — colors (OKLCH), radius ramp, elevation shadows, motion curves
and durations. Components must consume tokens (`bg-background`,
`shadow-lift`, `ease-apple`); hard-coded values are rejected in review.

Palette: **"Midnight Violet"** — warm white canvas, deep midnight ink,
electric violet accent, soft lavender surfaces; graphite in dark mode.

## Database

Schema lives in `supabase/migrations/` (SQL, versioned, append-only).
Key decisions:

- `profiles` is 1:1 with `auth.users`, auto-created by trigger on signup
- `username` is `citext` with a format constraint and reserved-name list
- `links.position` drives drag-and-drop ordering
- Analytics tables (`profile_views`, `link_clicks`) are insert-only for
  visitors and readable only by the owner — the future analytics feature
  needs no schema change
- Every table has RLS; public reads flow exclusively through
  `profiles.is_public`

After schema changes, regenerate types:
`pnpm dlx supabase gen types typescript --linked > src/types/database.ts`
