// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import Link from 'next/link'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'What LinkYaar collects, why, and the rights you have over it.',
}

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy Notice"
      updated="August 3, 2026"
      intro="Short version: we collect the minimum needed to run your page, we sell nothing, and you can export or erase everything yourself."
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — your email and password hash (managed by
          Supabase Auth), or your Google account identity if you sign in with Google.
        </li>
        <li>
          <strong>Profile content</strong> — the username, name, bio, photo, links, and
          socials you choose to publish. This is public by design.
        </li>
        <li>
          <strong>Analytics events (consent-based)</strong> — a page view or link click is
          recorded <em>only after the visitor explicitly agrees</em> via the consent
          prompt. When they do, we store a timestamp, the referring site, a country-level
          location, and a coarse device type. We never record IP addresses, and if the
          visitor declines (or ignores the prompt), nothing is collected at all. This is
          our approach to consent under India&apos;s Digital Personal Data Protection Act,
          2023.
        </li>
      </ul>

      <h2>What we never do</h2>
      <ul>
        <li>Sell or rent your data to anyone</li>
        <li>Run third-party advertising or cross-site trackers</li>
        <li>Read analytics about your page — only you can see them</li>
      </ul>

      <h2>Where it lives</h2>
      <p>
        Data is stored in Supabase (PostgreSQL) protected by row-level security, and the
        site is served by Vercel. Both process data on our behalf under their own privacy
        commitments.
      </p>

      <h2>Cookies &amp; consent</h2>
      <p>
        We use session cookies to keep you signed in, and — only if a visitor opts in —
        one cookie to remember their analytics consent. No tracking cookies, ever. You can
        review or withdraw analytics consent at any time on the{' '}
        <Link href="/cookies">Cookie Notice</Link>.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>
          <strong>Export</strong> — download everything we store about you as JSON from
          Settings → Your data.
        </li>
        <li>
          <strong>Erase</strong> — delete your account from Settings; this permanently
          removes your profile, links, and analytics.
        </li>
        <li>
          <strong>Correct</strong> — edit any profile field at any time.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Privacy questions? Open a discussion on{' '}
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        . For sensitive reports use private vulnerability reporting described in our
        security policy.
      </p>
    </ProsePage>
  )
}
