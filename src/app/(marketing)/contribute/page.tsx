// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'How to contribute to LinkYaar — from first clone to merged PR.',
}

export default function ContributePage() {
  return (
    <ProsePage
      title="Contribute"
      intro="LinkYaar is built in the open, and contributions of every size are welcome — code, design, docs, bug reports, ideas."
    >
      <h2>Quick start</h2>
      <ul>
        <li>
          Fork and clone{' '}
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
            the repository
          </a>
        </li>
        <li>
          <code>pnpm install</code>, copy <code>.env.example</code> to{' '}
          <code>.env.local</code>, add free Supabase credentials
        </li>
        <li>
          Apply <code>supabase/migrations/</code> and run <code>pnpm dev</code>
        </li>
      </ul>

      <h2>The rules of the road</h2>
      <ul>
        <li>
          <strong>Conventional Commits</strong> — <code>feat(links): add pin action</code>
          ; enforced by commitlint on every commit
        </li>
        <li>
          <strong>Strict TypeScript</strong> — <code>any</code> is a lint error
        </li>
        <li>
          <strong>Design tokens only</strong> — no hard-coded colors or shadows
        </li>
        <li>
          <strong>SPDX headers</strong> — run <code>pnpm license:fix</code> for new files
        </li>
        <li>PRs need green CI (lint, typecheck, build, license check) and one review</li>
      </ul>

      <h2>Where to start</h2>
      <p>
        Issues labeled{' '}
        <a
          href={`${siteConfig.links.github}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
          target="_blank"
          rel="noreferrer"
        >
          good first issue
        </a>{' '}
        are scoped for newcomers. Not sure where something goes? Ask in{' '}
        <a
          href={`${siteConfig.links.github}/discussions`}
          target="_blank"
          rel="noreferrer"
        >
          Discussions
        </a>{' '}
        first — happy to point you in the right direction.
      </p>

      <h2>Licensing</h2>
      <p>
        By contributing you agree your work is licensed under{' '}
        <strong>AGPL-3.0-or-later</strong>, same as the project. You keep your copyright;
        there is no CLA. Details in{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/docs/LICENSING.md`}
          target="_blank"
          rel="noreferrer"
        >
          docs/LICENSING.md
        </a>
        .
      </p>

      <p>
        Full guide:{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
          target="_blank"
          rel="noreferrer"
        >
          CONTRIBUTING.md
        </a>
      </p>
    </ProsePage>
  )
}
