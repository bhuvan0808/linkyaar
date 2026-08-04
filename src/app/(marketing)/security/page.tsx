// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Security',
  description: 'How to report vulnerabilities, and how LinkYaar protects data.',
}

export default function SecurityPage() {
  return (
    <ProsePage
      title="Security"
      intro="Found a vulnerability? Thank you — here is exactly what to do (and what not to)."
    >
      <h2>Reporting a vulnerability</h2>
      <p>
        <strong>Please do not open a public GitHub issue for security problems.</strong>{' '}
        Instead, use GitHub&apos;s private vulnerability reporting:
      </p>
      <ul>
        <li>
          Go to the{' '}
          <a
            href={`${siteConfig.links.github}/security/advisories/new`}
            target="_blank"
            rel="noreferrer"
          >
            report form
          </a>{' '}
          (repository → Security tab → Report a vulnerability)
        </li>
        <li>Include reproduction steps and impact assessment if you can</li>
      </ul>
      <p>
        You can expect acknowledgement within 72 hours, a status update within 7 days, and
        credit in the release notes once a fix ships (unless you prefer to stay
        anonymous).
      </p>

      <h2>How LinkYaar protects data</h2>
      <ul>
        <li>
          <strong>Row Level Security</strong> — every database table enforces access at
          the Postgres level; even a compromised client cannot read another user&apos;s
          data
        </li>
        <li>
          <strong>Moderation-by-default</strong> — visitor-submitted content (reviews) is
          invisible until the owner approves it, enforced in the database, not just the UI
        </li>
        <li>
          <strong>Minimal collection</strong> — no visitor cookies, no IP storage,
          country-level analytics only
        </li>
        <li>
          <strong>Open source</strong> — the entire codebase is publicly auditable, and
          CodeQL scanning plus Dependabot run on every change
        </li>
      </ul>

      <p>
        Formal policy:{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/SECURITY.md`}
          target="_blank"
          rel="noreferrer"
        >
          SECURITY.md
        </a>
      </p>
    </ProsePage>
  )
}
