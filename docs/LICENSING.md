# Licensing — what AGPL-3.0 means for you

LinkYaar is licensed under the
[GNU Affero General Public License v3.0](../LICENSE) (`AGPL-3.0-or-later`).
This page explains the practical implications in plain language. It is a
summary, not legal advice — the LICENSE file is the authoritative text.

## If you are a user

Nothing changes for you. Using linkyaar.com (or anyone's hosted instance)
carries no obligations. The license governs the software's code, not the
content you publish with it — **your links, bio, and data remain entirely
yours**.

## If you self-host LinkYaar

- Run it privately or publicly, for free or for profit. ✅
- Run it **unmodified**: no obligations beyond keeping the notices intact.
- Run it **modified** as a network service: you must offer the users of that
  service access to your modified source code, under AGPL-3.0. The simplest
  way to comply is to keep your fork public on GitHub and link to it from
  your instance.

This "network clause" is the whole point of choosing AGPL over MIT: a company
cannot take LinkYaar, improve it behind closed doors, and sell it as a closed
SaaS. Improvements flow back to everyone.

## If you contribute

- By submitting a pull request you license your contribution under
  `AGPL-3.0-or-later`, matching the project.
- You keep the copyright to your contribution — no copyright assignment, no
  CLA. The project's notice line ("Bhuvan Boddu and LinkYaar contributors")
  covers all contributors collectively.
- Every source file carries an SPDX header:

  ```
  // SPDX-License-Identifier: AGPL-3.0-or-later
  // Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors
  ```

  CI fails if a file is missing one. Run `pnpm license:fix` to add headers to
  new files automatically.

## Third-party code

- Dependencies keep their own licenses (MIT, Apache-2.0, etc.) — all of them
  are AGPL-compatible in the direction we use them.
- `src/components/ui/` contains primitives generated from
  [shadcn/ui](https://ui.shadcn.com) (MIT). They are intentionally excluded
  from our SPDX header sweep to preserve accurate attribution; the repository
  as a whole is distributed under AGPL-3.0.

## Why AGPL?

The same reason Cal.com, Grafana, and Plausible chose it: it keeps an
open-source product honest. Everyone can use and improve LinkYaar; nobody can
enclose it.
