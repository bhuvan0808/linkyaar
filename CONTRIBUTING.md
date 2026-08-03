# Contributing to LinkYaar

Thanks for considering a contribution! This document covers everything you
need to go from clone to merged PR.

## Development Setup

Follow the [Quick Start](README.md#quick-start) in the README. In short:
Node 20+, pnpm, a free Supabase project, `cp .env.example .env.local`,
`pnpm install`, `pnpm dev`.

## Branch & PR Workflow

- `main` — always releasable. **Never commit directly.**
- `develop` — integration branch; feature branches merge here first.
- `feature/<name>`, `fix/<name>`, `docs/<name>` — one branch per change.

1. Fork (or branch) from `develop`.
2. Make your change with focused commits.
3. Open a PR into `develop`. Fill in the PR template.
4. CI must pass (lint, typecheck, build) and one review is required.

## Commit Messages

We enforce [Conventional Commits](https://www.conventionalcommits.org) via
commitlint. Format:

```
<type>(<scope>): <subject>
```

Examples:

```
feat(auth): add google authentication
fix(profile): resolve avatar upload issue
refactor(button): simplify variant logic
docs(readme): improve setup instructions
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`build`, `ci`, `chore`, `revert`.

## Code Standards

- **TypeScript strict** — `any` is a lint error.
- **Feature-first** — new features live in `src/features/<feature>/`,
  not scattered across global folders.
- **Design tokens only** — never hard-code colors, shadows, or easing;
  use the tokens in `src/styles/globals.css`.
- **Accessibility** — keyboard operable, labelled, WCAG AA contrast.
- Pre-commit hooks run ESLint + Prettier on staged files; don't bypass them.

## Reporting Bugs & Requesting Features

Use the [issue templates](.github/ISSUE_TEMPLATE). Search existing issues
first. For security issues, see [SECURITY.md](SECURITY.md) — do **not** open
a public issue.

## Code of Conduct

Participation is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).
