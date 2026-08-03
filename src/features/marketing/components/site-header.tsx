'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { siGithub } from 'simple-icons'

import { BrandIcon } from '@/components/shared/brand-icon'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 flex max-w-5xl items-center justify-between rounded-2xl border border-white/40 bg-white/60 px-4 py-2.5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-6 dark:border-white/10 dark:bg-black/40">
        <Link
          href="/"
          className="flex items-center gap-2 text-[17px] font-semibold tracking-tight"
          aria-label="LinkYaar home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- 28px brand glyph */}
          <img
            src="/brand/glyph.png"
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-lg"
          />
          Link<span className="-ml-1.5 text-accent">Yaar</span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Main">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <BrandIcon path={siGithub.path} />
              <span>GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-accent text-accent-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-px hover:bg-accent/90"
          >
            <Link href="/login?mode=signup">Claim your link</Link>
          </Button>
        </nav>
      </div>
    </motion.header>
  )
}
