// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: "What's new",
  description: 'Everything recently shipped in LinkYaar.',
}

const releases = [
  {
    date: 'August 5, 2026',
    title: 'Theme Studio, free AI, and a whole new look',
    points: [
      'Brand-new identity: chili red, forest green, and warm cream',
      'Theme Studio: design your own look — wallpapers, gradients, 6 fonts, 5 button styles, accent colors — with instant live preview',
      '12 new premium themes (27 total); flagship "Sunset Club" is the new default',
      'Header layouts: Classic, Portrait, and Minimal',
      'AI bio & headline writer — free, 25 drafts/day, powered by a 4-provider free-tier chain',
      'Socials editor redesign: all 14 platforms visible as tappable icons',
      'Welcome emails, branded sign-in emails, and a support/donations page (UPI)',
      'Platform-wide rate limiting, product analytics, and error monitoring',
    ],
  },
  {
    date: 'August 4, 2026',
    title: 'linkyaar.com, email, and audience tools',
    points: [
      'LinkYaar moved to its own domain: linkyaar.com',
      'Email notifications: new subscribers, reviews to approve, weekly digests',
      'Collect subscribers on your page — exportable anytime as CSV',
      'Audience reviews with owner moderation',
      'Analytics breakdowns: countries, traffic sources, devices',
      'Google sign-in',
      'License changed to AGPL-3.0 — open source with teeth',
    ],
  },
  {
    date: 'August 3, 2026',
    title: 'The first release',
    points: [
      'Creator profiles with unlimited links, drag-and-drop, and scheduling',
      '15 hand-tuned themes',
      'Analytics: views, clicks, CTR, top links',
      'QR codes, SEO, and dynamic social cards',
      'Full data export and one-click account deletion',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <ProsePage
      title="What's new"
      intro="Ships early, ships often. The full commit-level history is on GitHub."
    >
      {releases.map((release) => (
        <section key={release.date}>
          <h2>{release.title}</h2>
          <p className="!mt-1 text-sm">{release.date}</p>
          <ul>
            {release.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        Machine-readable history:{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/CHANGELOG.md`}
          target="_blank"
          rel="noreferrer"
        >
          CHANGELOG.md
        </a>
        .
      </p>
    </ProsePage>
  )
}
