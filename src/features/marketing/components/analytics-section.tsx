// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import Link from 'next/link'
import { BarChart3, Globe2, MousePointerClick } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/shared/fade-in'

/** Pale sage analytics showcase — stat tiles left, statement right. */
export function AnalyticsSection() {
  return (
    <section className="bg-brand-sage py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <FadeIn>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-[2rem] bg-brand-ink p-7 text-white">
              <div className="flex items-center gap-2 text-white/60">
                <BarChart3 className="size-4" aria-hidden />
                <span className="text-xs font-bold tracking-wide uppercase">
                  Views · 30 days
                </span>
              </div>
              <p className="mt-3 font-display text-5xl font-black">43,500</p>
              <div className="mt-5 flex h-14 items-end gap-1.5" aria-hidden>
                {[35, 55, 40, 70, 52, 80, 64, 92, 75, 100, 88, 96].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-brand-lime"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] bg-brand-violet p-6 text-white">
              <MousePointerClick className="size-5" aria-hidden />
              <p className="mt-2 font-display text-4xl font-black">2,362</p>
              <p className="mt-1 text-sm font-semibold text-white/70">link clicks</p>
            </div>
            <div className="rounded-[2rem] bg-white p-6 text-brand-ink shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <Globe2 className="size-5" aria-hidden />
              <p className="mt-2 font-display text-4xl font-black">27</p>
              <p className="mt-1 text-sm font-semibold text-brand-ink/60">countries</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-display text-4xl leading-[1.02] font-black tracking-tight text-balance text-brand-ink sm:text-6xl">
            Know your audience. Keep them coming back.
          </h2>
          <p className="mt-6 max-w-lg text-lg font-medium text-brand-ink/70">
            Views, clicks, and trends — private to you, collected without cookies or
            creepy tracking, and never sold to anyone.
          </p>
          <Button
            asChild
            className="mt-9 h-14 rounded-full bg-brand-lilac px-8 text-base font-bold text-brand-ink transition-transform duration-300 hover:scale-[1.02] hover:bg-brand-lilac/85"
          >
            <Link href="/login?mode=signup">Get started for free</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  )
}
