'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const nav = [
  { label: 'Features', href: '/#features' },
  { label: 'Themes', href: '/#themes' },
  { label: 'FAQs', href: '/help' },
  { label: 'GitHub', href: siteConfig.links.github, external: true },
]

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-white py-2.5 pr-2.5 pl-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display text-[22px] font-black tracking-tight text-brand-ink"
            aria-label="LinkYaar home"
          >
            LinkYaar<span className="text-brand-violet">*</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {nav.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-4 py-2 text-[15px] font-medium text-brand-ink/70 transition-colors duration-200 hover:bg-brand-ink/5 hover:text-brand-ink"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-[15px] font-medium text-brand-ink/70 transition-colors duration-200 hover:bg-brand-ink/5 hover:text-brand-ink"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            asChild
            className="h-11 rounded-2xl bg-[oklch(0.95_0.005_95)] px-5 text-[15px] font-semibold text-brand-ink hover:bg-[oklch(0.92_0.005_95)]"
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
