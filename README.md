<div align="center">

<img src="src/app/icon.png" width="96" alt="LinkYaar logo" />

# LinkYaar

**Everything you are. One beautiful link.**

A free, open-source link-in-bio platform — every "premium" feature, given away.
Built with the polish of Linear and the openness of a public commons.

[**linkyaar.com**](https://linkyaar.com) · [Roadmap](https://linkyaar.com/roadmap) · [What's new](https://linkyaar.com/changelog) · [Support us 💛](https://linkyaar.com/support)

[![CI](https://github.com/bhuvan0808/linkyaar/actions/workflows/ci.yml/badge.svg)](https://github.com/bhuvan0808/linkyaar/actions/workflows/ci.yml)
[![CodeQL](https://github.com/bhuvan0808/linkyaar/actions/workflows/codeql.yml/badge.svg)](https://github.com/bhuvan0808/linkyaar/actions/workflows/codeql.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-2f6b3c)](LICENSE)
[![Stars](https://img.shields.io/github/stars/bhuvan0808/linkyaar?color=c13a2a)](https://github.com/bhuvan0808/linkyaar/stargazers)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-f5ebd3)](CONTRIBUTING.md)

</div>

---

## Why LinkYaar?

A creator's link-in-bio page is often the most-visited page they own — yet it
usually lives on a closed platform that charges for basics, watermarks the
free tier, and holds the audience hostage. LinkYaar gives all of it away:

|                                                | LinkYaar (free) | Typical "Pro" plans |
| ---------------------------------------------- | :-------------: | :-----------------: |
| Unlimited links, drag & drop, scheduling       |       ✅        |         ✅          |
| 27 themes **+ full custom Theme Studio**       |       ✅        |         💰          |
| Custom fonts, button styles, header layouts    |       ✅        |         💰          |
| Analytics: countries, sources, devices, CTR    |       ✅        |         💰          |
| Subscriber collection + CSV export             |       ✅        |         💰          |
| Moderated audience reviews                     |       ✅        |          —          |
| AI bio & headline writer                       |       ✅        |         💰          |
| QR codes (PNG/SVG), dynamic OG images, SEO     |       ✅        |         💰          |
| Email notifications + weekly digests           |       ✅        |         💰          |
| Remove branding ransom, data export, self-host |       ✅        |         💰          |

## Features

- 🔗 **Links that behave** — unlimited, drag-and-drop, featured pins, schedules, one-tap hide
- 🎨 **Theme Studio** — 27 hand-tuned themes plus a full editor: wallpapers, gradients, 6 fonts, 5 button styles, accent colors, header layouts — all with an **instant live preview**
- ✨ **Free AI writer** — bio & headline drafts (25/day) on a 4-provider free-tier chain
- 📈 **Private analytics** — views, clicks, CTR, countries, traffic sources, devices; no cookies, no IP logging, visible only to the owner
- 👥 **Audience tools** — email subscribers (exportable) and owner-moderated reviews
- 📬 **Email built in** — branded welcome, notification, and weekly digest emails (Resend)
- 🔐 **Auth done right** — email, magic links, Google sign-in, forgot-password, RLS everywhere
- 🛡️ **Production hardening** — Redis rate limiting (fail-open), Sentry, PostHog, CodeQL, Dependabot
- 🌐 **SEO-first public pages** — `linkyaar.com/yourname` with JSON-LD, sitemaps, per-profile social cards

## Tech Stack

| Layer         | Choice                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | [Next.js](https://nextjs.org) (App Router) + React, strict TypeScript     |
| Styling       | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com), OKLCH design tokens |
| Backend       | [Supabase](https://supabase.com) — Postgres (RLS), Auth, Storage          |
| Email         | [Resend](https://resend.com)                                              |
| Rate limiting | [Upstash Redis](https://upstash.com) (optional, fail-open)                |
| AI            | Gemini → Groq → OpenRouter free-tier chain (optional)                     |
| Observability | PostHog + Sentry (optional)                                               |
| Deploy        | Vercel                                                                    |

## Self-hosting / Quick Start

Everything below the first three vars is **optional** — LinkYaar degrades
gracefully when a service isn't configured.

```bash
# 1. Clone and install (Node 20+, pnpm)
git clone https://github.com/bhuvan0808/linkyaar.git
cd linkyaar && pnpm install

# 2. Configure — copy and fill (Supabase URL + key are the only requirements)
cp .env.example .env.local

# 3. Apply the database schema to your free Supabase project
pnpm dlx supabase link --project-ref <your-ref>
pnpm dlx supabase db push   # or paste supabase/migrations/*.sql into the SQL editor

# 4. Run
pnpm dev
```

Full architecture notes live in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) —
including why there is no API server (Postgres RLS _is_ the authorization
layer).

## Scripts

| Command                                  | Purpose                                  |
| ---------------------------------------- | ---------------------------------------- |
| `pnpm dev`                               | Dev server (Turbopack)                   |
| `pnpm build`                             | Production build                         |
| `pnpm lint` / `pnpm typecheck`           | ESLint / strict TS                       |
| `pnpm license:check` / `license:fix`     | SPDX header enforcement                  |
| `node scripts/generate-brand-assets.cjs` | Regenerate favicon/OG from brand sources |

## Contributing

Contributions of every size are welcome — code, design, docs, ideas.
Start with [CONTRIBUTING.md](CONTRIBUTING.md), grab a
[good first issue](https://github.com/bhuvan0808/linkyaar/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22),
or open a [Discussion](https://github.com/bhuvan0808/linkyaar/discussions).
Conventional Commits, strict TypeScript, and design tokens are enforced by
hooks and CI.

Got a whole product idea? We build free, open-source tools with the
community — email **ideas@linkyaar.com**.

## Maintainer

Built and maintained by **[Bhuvan Boddu](https://github.com/bhuvan0808)** —
solo maintainer, so replies can take a day or two, but every message gets
read. [LinkedIn](https://www.linkedin.com/in/bhuvanboddu/) ·
[Instagram](https://www.instagram.com/buildwithbhuvan) ·
[Say hi](mailto:hello@linkyaar.com)

If LinkYaar saves you a Linktree subscription,
[consider supporting it](https://linkyaar.com/support) — donations pay for
servers and a bigger free AI pool.

## License

**AGPL-3.0-or-later** — use it, self-host it, even charge for hosting it; but
if you run a modified version as a public service, you must share your source.
Open source with teeth, the same license as Cal.com and Grafana. Plain-language
guide in [docs/LICENSING.md](docs/LICENSING.md) · full text in [LICENSE](LICENSE).

Copyright © 2026 Bhuvan Boddu and LinkYaar contributors.

<div align="center">
<sub>⭐ If this repo is useful to you, a star helps more creators find it.</sub>
</div>
