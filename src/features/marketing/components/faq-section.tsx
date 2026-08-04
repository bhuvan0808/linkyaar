// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import Link from 'next/link'

import { FadeIn } from '@/components/shared/fade-in'

const faqs = [
  {
    q: 'Is LinkYaar really free?',
    a: 'Yes — every feature that exists is free. LinkYaar is AGPL-licensed open source: no paywalls, no watermark-removal fees, no locked analytics. You can even self-host it.',
  },
  {
    q: 'How is this different from Linktree?',
    a: 'LinkYaar is an open-source alternative. Your data is exportable in one click, analytics are collected without cookies or IP logging, and the entire codebase is public on GitHub for anyone to audit or improve.',
  },
  {
    q: 'How do I create my page?',
    a: 'Sign up with your email, claim your username, and add your first link — your page is live at linkyaar/yourname in under a minute.',
  },
  {
    q: 'Can I change how my page looks?',
    a: 'Pick any of 15 hand-tuned themes in the Appearance tab. Each restyles your background, text, and button shapes in one tap — no CSS needed.',
  },
  {
    q: 'What analytics do I get?',
    a: 'Views, clicks, click-through rate, a 30-day trend, and your top links. Only you can see them, and we never sell or share the data.',
  },
  {
    q: 'Can I leave whenever I want?',
    a: 'Always. Settings → Your data gives you a full JSON export, and account deletion is one click and truly permanent.',
  },
]

/** Deep plum FAQ block, Linktree-style. */
export function FaqSection() {
  return (
    <section className="bg-brand-red-deep py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn>
          <h2 className="text-center font-display text-4xl font-black tracking-tight text-balance text-brand-cream sm:text-6xl">
            Questions? Answered.
          </h2>
        </FadeIn>

        <div className="mt-14 flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <FadeIn key={faq.q} delay={Math.min(i * 0.05, 0.25)}>
              <details className="group rounded-[1.75rem] bg-brand-maroon px-7 py-6 transition-colors duration-200 open:pb-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-brand-cream sm:text-xl [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    className="text-2xl text-brand-cream/60 transition-transform duration-200 group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed font-medium text-brand-cream/75">
                  {faq.a}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-10 text-center">
          <p className="text-sm font-medium text-brand-cream/60">
            More questions in the{' '}
            <Link href="/help" className="text-brand-cream underline underline-offset-4">
              Help Center
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
