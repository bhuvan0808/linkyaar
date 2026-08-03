'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { PhoneMock } from '@/features/marketing/components/phone-mock'

const EASE = [0.32, 0.72, 0, 1] as const

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-brand-ink">
      {/* Soft aurora depth on the midnight block */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          animate={reduce ? undefined : { x: [0, 36, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 left-1/3 h-[560px] w-[760px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.5_0.24_310/0.35),transparent_62%)] blur-3xl"
        />
        <motion.div
          animate={reduce ? undefined : { x: [0, -28, 0], y: [0, 26, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.7_0.19_45/0.22),transparent_62%)] blur-3xl"
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pt-36 pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-44 lg:pb-32">
        <div className="flex max-w-2xl flex-col items-start">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="font-display text-[2.75rem] leading-[1.02] font-extrabold tracking-tight text-balance text-brand-cream sm:text-6xl lg:text-[5.25rem]"
          >
            Everything you are.{' '}
            <span className="text-brand-pink">One beautiful link.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
            className="mt-6 max-w-lg text-lg text-pretty text-brand-cream/70 sm:text-xl"
          >
            Join creators using LinkYaar for their links, socials, work, and vibe — one
            page that actually feels like you. Free and open source, forever.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="flex h-14 flex-1 items-center rounded-2xl bg-white pr-2 pl-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <span className="text-sm font-medium text-black/40">linkyaar/</span>
              <span className="ml-0.5 flex-1 text-sm font-semibold text-black/80">
                yourname
              </span>
              <Button
                asChild
                className="h-10 rounded-xl bg-brand-pink px-5 font-semibold text-white transition-transform duration-300 hover:scale-[1.03] hover:bg-brand-pink/90"
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
            className="mt-5 text-[13px] text-brand-cream/45"
          >
            No credit card. No lock-in. MIT licensed — read every line on GitHub.
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
        >
          <PhoneMock />
        </motion.div>
      </div>

      {/* Curved seam into the next section */}
      <div
        className="h-8 rounded-t-[2.5rem] bg-background sm:h-12 sm:rounded-t-[4rem]"
        aria-hidden
      />
    </section>
  )
}
