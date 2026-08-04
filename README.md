<div align="center">

# LinkYaar

**Everything you are. One beautiful link.**

An open-source creator profile platform. Bring your links, socials, portfolio,
and contact together in one beautiful page — designed with the care of Linear,
Vercel, and Arc.

[Roadmap](ROADMAP.md) · [Architecture](docs/ARCHITECTURE.md) · [Contributing](CONTRIBUTING.md)

</div>

---

## Features

- 🔗 **Unlimited links** with drag-and-drop reordering and per-link toggles
- 👤 **Creator profiles** — username, bio, avatar, socials
- 🎨 **Themes** — curated presets built on a token-based design system
- 🔐 **Google sign-in** via Supabase Auth
- 🌐 **SEO-first public pages** — `linkyaar.app/yourname`
- 📱 **Mobile-first, WCAG AA**, and fast (Lighthouse 95+ target)

## Tech Stack

| Layer     | Choice                                                     |
| --------- | ---------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) (App Router) + React         |
| Language  | TypeScript (strict, no `any`)                              |
| Styling   | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)       |
| Motion    | Motion (Framer Motion)                                     |
| Data      | TanStack Query · React Hook Form · Zod                     |
| Backend   | [Supabase](https://supabase.com) (Postgres, Auth, Storage) |
| Deploy    | Vercel                                                     |

## Quick Start

**Prerequisites:** Node 20+, [pnpm](https://pnpm.io), a [Supabase](https://supabase.com) project.

```bash
# 1. Clone and install
git clone https://github.com/bhuvan0808/linkyaar.git
cd linkyaar
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and publishable key (dashboard → Settings → API)

# 3. Apply the database schema
# Either paste supabase/migrations/*.sql into the Supabase SQL editor,
# or link the project and push:
pnpm dlx supabase link --project-ref <your-ref>
pnpm dlx supabase db push

# 4. Enable Google auth
# Supabase dashboard → Authentication → Providers → Google

# 5. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Purpose                |
| ---------------- | ---------------------- |
| `pnpm dev`       | Dev server (Turbopack) |
| `pnpm build`     | Production build       |
| `pnpm lint`      | ESLint                 |
| `pnpm typecheck` | TypeScript, no emit    |
| `pnpm format`    | Prettier write         |

## Project Structure

```
src/
├── app/          # Routes (App Router)
├── components/   # ui/ (shadcn primitives) + shared/
├── features/     # Feature modules (auth, profile, links, …)
├── hooks/        # Reusable hooks
├── lib/          # Framework glue (supabase clients, env, utils)
├── providers/    # React context providers
├── services/     # Data-access layer
├── styles/       # globals.css — design tokens live here
├── types/        # Shared types (database.ts mirrors the schema)
└── config/       # Site constants
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full picture.

## Contributing

We'd love your help — read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.
All commits follow [Conventional Commits](https://www.conventionalcommits.org);
hooks enforce lint, format, and message style automatically.

## Self-hosting

LinkYaar is fully self-hostable — the [Quick Start](#quick-start) above is the
complete recipe: a free Supabase project, a Vercel deployment (or any Node
host), and the SQL in `supabase/migrations/`. No license keys, no phone-home,
no feature gates.

## License

LinkYaar is licensed under the **GNU Affero General Public License v3.0**
([AGPL-3.0-or-later](LICENSE)).

**What that means in practice:**

- ✅ Use it, self-host it, modify it, and even charge money for hosting it —
  freely and forever.
- 🔁 If you run a **modified** version as a public service, you must make your
  modified source code available to its users under the same license.
- 🧾 Keep license and copyright notices intact; new source files carry an
  `SPDX-License-Identifier: AGPL-3.0-or-later` header (CI enforces this —
  run `pnpm license:fix` to add headers automatically).

**For contributors:** by submitting a pull request you agree that your
contribution is licensed under AGPL-3.0-or-later. See
[docs/LICENSING.md](docs/LICENSING.md) for the full explanation of what AGPL
means for users, self-hosters, and contributors.

Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors.
