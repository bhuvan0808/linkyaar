// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import Link from 'next/link'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Code of Conduct',
  description: 'The standards that keep the LinkYaar community welcoming.',
}

export default function ConductPage() {
  return (
    <ProsePage
      title="Code of Conduct"
      intro="Short version: be kind, be respectful, and remember there is a person on the other side of every username."
    >
      <h2>Our pledge</h2>
      <p>
        We are committed to making participation in LinkYaar a harassment-free experience
        for everyone — regardless of age, body size, disability, ethnicity, sex
        characteristics, gender identity and expression, level of experience, education,
        socio-economic status, nationality, appearance, race, religion, or sexual identity
        and orientation.
      </p>

      <h2>Expected behavior</h2>
      <ul>
        <li>Empathy and kindness toward other people</li>
        <li>Respect for differing opinions, viewpoints, and experiences</li>
        <li>Giving — and gracefully accepting — constructive feedback</li>
        <li>Owning mistakes and learning from them</li>
        <li>Prioritizing what is best for the community as a whole</li>
      </ul>

      <h2>Unacceptable behavior</h2>
      <ul>
        <li>Sexualized language or imagery; unwelcome advances of any kind</li>
        <li>Trolling, insults, and personal or political attacks</li>
        <li>Public or private harassment</li>
        <li>Publishing others&apos; private information without permission</li>
      </ul>

      <h2>Enforcement</h2>
      <p>
        Report violations privately via the process in our{' '}
        <Link href="/security">security policy</Link>. Reports are reviewed promptly and
        reporter privacy is respected. Maintainers may remove content and contributors
        that violate these standards.
      </p>

      <p>
        Adapted from the{' '}
        <a href="https://www.contributor-covenant.org" target="_blank" rel="noreferrer">
          Contributor Covenant
        </a>{' '}
        v2.1 — full text in{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/CODE_OF_CONDUCT.md`}
          target="_blank"
          rel="noreferrer"
        >
          CODE_OF_CONDUCT.md
        </a>
        .
      </p>
    </ProsePage>
  )
}
