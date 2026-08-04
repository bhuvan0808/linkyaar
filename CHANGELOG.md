# Changelog

All notable changes to LinkYaar are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added (August 5, 2026)

- Theme Studio: per-profile custom design (wallpapers, gradients, 6 fonts,
  5 button styles, accents) with instant client-side live preview
- 12 new premium themes (27 total); flagship default "Sunset Club"
- Header layouts: Classic, Portrait, Minimal
- AI bio & headline writer — free-tier provider chain (Gemini → Groq →
  OpenRouter), hard-capped at 25 drafts/user/day
- Platform-wide rate limiting via Upstash Redis (fail-open)
- PostHog product analytics and Sentry error monitoring
- Welcome emails, branded Supabase auth email templates
- Support page with UPI donations; maintainer page; products footer
- Socials editor redesigned as a tappable platform grid; pronoun presets

### Changed (August 5, 2026)

- Rebrand: chili red / forest green / cream palette; chart colors
  re-validated for color-vision deficiency

### Changed

- **License changed from MIT to AGPL-3.0-or-later** — see docs/LICENSING.md
  for what this means for users, self-hosters, and contributors
- Production domain is now [linkyaar.com](https://linkyaar.com)

### Added

- Custom domain, Resend email (auth emails, owner notifications, weekly digest)
- Audience tools: subscriber collection and moderated reviews
- Analytics breakdowns: countries, traffic sources, devices
- Google sign-in
- SPDX license headers enforced in CI; Dependabot and CodeQL scanning

- Project foundation: Next.js App Router, TypeScript strict, Tailwind CSS v4
- "Midnight Violet" design token system (colors, radius, elevation, motion)
- Supabase integration: browser/server clients, session proxy, typed database
- Initial database schema with Row Level Security, triggers, and seed themes
- Tooling: ESLint, Prettier, Husky, lint-staged, commitlint
- Open-source governance docs and GitHub templates
