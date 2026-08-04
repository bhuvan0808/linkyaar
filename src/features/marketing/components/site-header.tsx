// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { motion } from 'motion/react'
import { siGithub } from 'simple-icons'

import { BrandIcon } from '@/components/shared/brand-icon'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const nav = [
  { label: 'Features', href: '/#features' },
  { label: 'Themes', href: '/#themes' },
  { label: 'FAQs', href: '/help' },
]

function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return `${count}`
}

export function SiteHeader({ stars }: { stars: number | null }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white py-2.5 pr-2.5 pl-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="LinkYaar home">
            {/* eslint-disable-next-line @next/next/no-img-element -- small brand glyph */}
            <img
              src="/brand/glyph-ink.png"
              alt=""
              width={26}
              height={26}
              className="h-6.5 w-auto"
            />
            <span className="font-display text-[22px] font-black tracking-tight text-brand-ink">
              LinkYaar
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-[15px] font-medium text-brand-ink/70 transition-colors duration-200 hover:bg-brand-ink/5 hover:text-brand-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`Star LinkYaar on GitHub${stars !== null ? ` — ${stars} stars` : ''}`}
            className="hidden h-11 items-center gap-2 rounded-full border border-brand-ink/15 px-4 text-[14px] font-semibold text-brand-ink transition-all duration-200 hover:border-brand-ink/30 hover:bg-brand-ink/5 sm:flex"
          >
            <BrandIcon path={siGithub.path} className="size-4.5" />
            <span className="hidden lg:inline">Star</span>
            <span className="flex items-center gap-1 rounded-full bg-brand-lime px-2 py-0.5 text-[12.5px] font-bold text-brand-ink">
              <Star className="size-3 fill-current" aria-hidden />
              {stars !== null ? formatStars(stars) : '—'}
            </span>
          </a>
          <Button
            variant="secondary"
            asChild
            className="hidden h-11 rounded-2xl bg-[oklch(0.95_0.005_95)] px-5 text-[15px] font-semibold text-brand-ink hover:bg-[oklch(0.92_0.005_95)] sm:inline-flex"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-brand-ink px-6 text-[15px] font-semibold text-white transition-transform duration-300 hover:scale-[1.02] hover:bg-brand-ink/90"
          >
            <Link href="/login?mode=signup">Sign up free</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
