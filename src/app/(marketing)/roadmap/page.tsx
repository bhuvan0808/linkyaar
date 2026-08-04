// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'What LinkYaar has shipped, what is next, and what comes later.',
}

const sections: {
  title: string
  emoji: string
  items: { label: string; done?: boolean }[]
}[] = [
  {
    title: 'Shipped',
    emoji: '✅',
    items: [
      { label: 'Profiles, unlimited links, drag-and-drop, scheduling', done: true },
      {
        label: '27 themes + Theme Studio: custom wallpapers, fonts, buttons, colors',
        done: true,
      },
      {
        label: 'Header layouts and 6 font personalities with instant live preview',
        done: true,
      },
      { label: 'AI bio & headline writer — free, 25 drafts/day', done: true },
      { label: 'Email, magic link, and Google sign-in', done: true },
      { label: 'Analytics: views, clicks, CTR, countries, sources, devices', done: true },
      { label: 'Audience: subscribers and moderated reviews', done: true },
      { label: 'QR codes, SEO, dynamic social cards', done: true },
      { label: 'Email notifications, welcome emails, and weekly digests', done: true },
      { label: 'Platform-wide rate limiting and error monitoring', done: true },
      { label: 'GDPR export and one-click account deletion', done: true },
      { label: 'UPI donations to keep everything free', done: true },
    ],
  },
  {
    title: 'Next',
    emoji: '🔨',
    items: [
      { label: 'Content embeds: YouTube, Spotify, and more' },
      { label: 'Link thumbnails and custom icons' },
      { label: 'Link shortener with custom short codes' },
      { label: 'Digital business cards (vCard download)' },
      { label: 'Free digital downloads' },
      { label: 'Pattern and image wallpapers in the Studio' },
    ],
  },
  {
    title: 'Later',
    emoji: '🌅',
    items: [
      { label: 'Payments: tips and digital products (Stripe / Razorpay / UPI)' },
      { label: 'Instagram auto-reply and social follower tracking' },
      { label: 'AI theme generation from a text prompt' },
      { label: 'Custom domains per creator' },
      { label: 'Teams and workspaces' },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <ProsePage
      title="Roadmap"
      intro="Built in the open. Propose features in GitHub Discussions — the roadmap belongs to the community."
    >
      {sections.map((section) => (
        <section key={section.title}>
          <h2>
            {section.emoji} {section.title}
          </h2>
          <ul>
            {section.items.map((item) => (
              <li key={item.label} className={item.done ? 'list-none' : undefined}>
                {item.done ? '✓ ' : ''}
                {item.label}
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        The engineering-grade roadmap lives in{' '}
        <a
          href={`${siteConfig.links.github}/blob/main/ROADMAP.md`}
          target="_blank"
          rel="noreferrer"
        >
          ROADMAP.md
        </a>{' '}
        and is updated with every release.
      </p>
    </ProsePage>
  )
}
