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
          <strong>Analytics events</strong> — when someone views your page or clicks a
          link we record a timestamp, the referring site, and a country-level location
          derived from the request. We do not record IP addresses, and we set no tracking
          cookies on visitors.
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

      <h2>Cookies</h2>
      <p>
        We use only the session cookies required to keep you signed in. Visitors to public
        profiles get no cookies at all. Details in the{' '}
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
