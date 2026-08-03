'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { PhoneMock } from '@/features/marketing/components/phone-mock'

const EASE = [0.32, 0.72, 0, 1] as const

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 24, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.16_293/0.28),transparent_65%)] blur-3xl"
        />
        <motion.div
          animate={reduce ? undefined : { x: [0, -32, 0], y: [0, 32, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.85_0.08_320/0.35),transparent_65%)] blur-3xl"
        />
        <motion.div
          animate={reduce ? undefined : { x: [0, 28, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-64 -right-32 h-[380px] w-[380px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.8_0.1_190/0.25),transparent_65%)] blur-3xl"
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 pt-36 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-44 lg:pb-28">
        <div className="flex max-w-xl flex-col items-start">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[13px] font-medium shadow-[var(--shadow-soft)] backdrop-blur"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden />
            Open source · free forever
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Everything you are.
            <span className="block bg-gradient-to-r from-[oklch(0.55_0.24_292)] via-[oklch(0.62_0.22_310)] to-[oklch(0.65_0.18_260)] bg-clip-text text-transparent">
              One beautiful link.
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
            className="mt-6 text-lg text-pretty text-muted-foreground sm:text-xl"
          >
            Your links, your socials, your work, your vibe — gathered into one page that
            actually feels like you. Set up in minutes. Yours forever.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="flex h-12 flex-1 items-center rounded-full border border-border bg-card pr-1.5 pl-5 shadow-[var(--shadow-soft)] transition-shadow duration-300 focus-within:shadow-[var(--shadow-glow)]">
              <span className="text-sm text-muted-foreground">linkyaar/</span>
              <span className="ml-0.5 flex-1 text-sm font-medium text-foreground/80">
                yourname
              </span>
              <Button
                size="sm"
                asChild
                className="h-9 rounded-full bg-accent px-4 text-accent-foreground transition-transform duration-300 hover:scale-[1.03] hover:bg-accent/90"
              >
                <Link href="/login?mode=signup">
                  Claim it
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 text-[13px] text-muted-foreground"
          >
            No credit card. No lock-in. MIT licensed — read every line on GitHub.
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          <PhoneMock />
        </motion.div>
      </div>
    </section>
  )
}
