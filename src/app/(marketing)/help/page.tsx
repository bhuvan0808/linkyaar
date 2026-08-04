// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Help & FAQs',
  description: 'Getting started with LinkYaar, and answers to common questions.',
}

const faqs = [
  {
    q: 'How do I get started?',
    a: 'Sign up with your email (or a magic link), claim your username, and add your first link. Your page is live immediately at linkyaar/yourname.',
  },
  {
    q: 'Is LinkYaar really free?',
    a: 'Yes. The software is AGPL-licensed open source. Every feature that exists today is free — there is no paywall, no branding-removal fee, no locked analytics.',
  },
  {
    q: 'How do I reorder my links?',
    a: 'On the Links page, grab the handle on the left of any link and drag it. The new order saves automatically and appears on your public page instantly.',
  },
  {
    q: 'How do I change how my page looks?',
    a: 'Dashboard → Appearance. Pick any of the 27 themes, or open the Studio tab to design your own — wallpapers, fonts, button styles, and colors, all with an instant live preview.',
  },
  {
    q: 'Can I hide a link without deleting it?',
    a: 'Yes — every link has a toggle. You can also schedule links to appear or disappear at a specific time from the link editor.',
  },
  {
    q: 'What analytics do I get?',
    a: 'Views, clicks, click-through rate, a 30-day daily trend, and your top links. Analytics are private to you, collected without cookies or IP addresses.',
  },
  {
    q: 'How do I share my page offline?',
    a: 'Use the QR button in the dashboard header — download your code as PNG or SVG for posters, slides, or business cards.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Settings → Danger zone → Delete account. It permanently removes your profile, links, and analytics. You can export everything as JSON first.',
  },
  {
    q: 'Can I self-host LinkYaar?',
    a: 'Yes — clone the repository, create a free Supabase project, apply the migrations, and deploy to Vercel. The README walks through every step.',
  },
]

export default function HelpPage() {
  return (
    <ProsePage
      title="Help & FAQs"
      intro="Everything you need to go from zero to a live page. Not covered here? Ask in GitHub Discussions."
    >
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className="group mt-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-soft)]"
        >
          <summary className="cursor-pointer list-none text-[15px] font-semibold marker:hidden">
            {faq.q}
          </summary>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {faq.a}
          </p>
        </details>
      ))}

      <h2>Still stuck?</h2>
      <p>
        Ask a question in{' '}
        <a
          href={`${siteConfig.links.github}/discussions`}
          target="_blank"
          rel="noreferrer"
        >
          GitHub Discussions
        </a>{' '}
        or report a bug via{' '}
        <a href={`${siteConfig.links.github}/issues`} target="_blank" rel="noreferrer">
          GitHub Issues
        </a>
        .
      </p>
    </ProsePage>
  )
}
