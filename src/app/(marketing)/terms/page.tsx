// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that govern your use of LinkYaar.',
}

export default function TermsPage() {
  return (
    <ProsePage
      title="Terms & Conditions"
      updated="August 3, 2026"
      intro="Short version: be a decent human, your content stays yours, and the service is provided as-is."
    >
      <h2>1. The service</h2>
      <p>
        LinkYaar lets you create a public profile page that gathers your links, social
        accounts, and information in one place. The software is open source under the
        AGPL-3.0 license; this hosted instance is operated by the LinkYaar maintainers.
      </p>

      <h2>2. Your account</h2>
      <p>
        You are responsible for your account credentials and everything published under
        your username. You must be at least 13 years old (or the minimum age of digital
        consent in your country) to use LinkYaar.
      </p>

      <h2>3. Your content</h2>
      <p>
        Everything you publish remains yours. By publishing it on LinkYaar you grant us
        the limited license needed to host and display it at your public URL. You can
        export or delete all of it at any time from Settings.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You may not use LinkYaar to publish or link to:</p>
      <ul>
        <li>Content that is illegal, or that promotes illegal activity</li>
        <li>Malware, phishing, scams, or deceptive impersonation</li>
        <li>Harassment, hate, or content sexualizing minors (zero tolerance)</li>
        <li>Spam or automated bulk account creation</li>
      </ul>
      <p>
        We may remove content or suspend accounts that violate these rules. Report
        violations via{' '}
        <a href={`${siteConfig.links.github}/issues`} target="_blank" rel="noreferrer">
          GitHub issues
        </a>{' '}
        or the security policy for sensitive reports.
      </p>

      <h2>5. Usernames</h2>
      <p>
        Usernames are first-come, first-served. We may reclaim usernames that impersonate
        others, infringe trademarks, or sit unused on deleted accounts.
      </p>

      <h2>6. No warranty</h2>
      <p>
        LinkYaar is provided “as is”, without warranty of any kind, as described in the
        AGPL-3.0 license. We work hard to keep it fast and available, but we do not
        guarantee uninterrupted service.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may update these terms as the project evolves. Material changes will be
        announced in the project changelog. Continuing to use the service after a change
        means you accept the updated terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these terms? Open a discussion on{' '}
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </p>
    </ProsePage>
  )
}
