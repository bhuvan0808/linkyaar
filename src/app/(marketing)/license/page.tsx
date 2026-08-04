// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'License',
  description: 'LinkYaar is AGPL-3.0 licensed — what that means in plain language.',
}

export default function LicensePage() {
  return (
    <ProsePage
      title="License"
      intro="LinkYaar is free software under the GNU Affero General Public License v3.0 — open source with teeth."
    >
      <h2>The plain-language version</h2>
      <ul>
        <li>
          <strong>Use it freely</strong> — run it, self-host it, modify it, even charge
          money for hosting it.
        </li>
        <li>
          <strong>Share improvements</strong> — if you run a modified version as a public
          service, you must make your modified source available to its users under the
          same license.
        </li>
        <li>
          <strong>Keep the notices</strong> — copyright and license headers stay intact.
        </li>
      </ul>

      <h2>Why AGPL and not MIT?</h2>
      <p>
        The AGPL&apos;s &ldquo;network clause&rdquo; closes the loophole where a company
        takes an open-source project, improves it privately, and sells it as a closed
        service. With AGPL, improvements to LinkYaar flow back to everyone — the same
        license trusted by Cal.com, Grafana, and Plausible.
      </p>

      <h2>What it does not affect</h2>
      <p>
        Your content. The license governs the software&apos;s code — your links, bio,
        photos, and audience data belong to you, full stop. Using linkyaar.com carries no
        license obligations at all.
      </p>

      <h2>The authoritative text</h2>
      <p>
        This page is a summary, not the license. The binding document is the full{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/LICENSE`}
          target="_blank"
          rel="noreferrer"
        >
          AGPL-3.0 LICENSE file
        </a>
        , and the contributor-focused explanation lives in{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/docs/LICENSING.md`}
          target="_blank"
          rel="noreferrer"
        >
          docs/LICENSING.md
        </a>
        .
      </p>
      <p>Copyright © 2026 Bhuvan Boddu and LinkYaar contributors.</p>
    </ProsePage>
  )
}
