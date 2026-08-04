// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BarChart3, Heart, Link2, QrCode } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { siGithub, siInstagram, siSpotify, siYoutube } from 'simple-icons'

import { BrandIcon } from '@/components/shared/brand-icon'
import { Button } from '@/components/ui/button'

const EASE = [0.32, 0.72, 0, 1] as const

/** Flat, editorial collage of product tiles — no device chrome. */
function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-105" aria-hidden>
      {/* Profile card */}
      <div className="relative z-10 rotate-[-2deg] rounded-[2rem] bg-brand-ink p-7 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
        <div className="flex size-16 items-center justify-center rounded-full bg-brand-lilac text-2xl">
          🎨
        </div>
        <p className="mt-4 font-display text-2xl font-black text-white">maya draws</p>
        <p className="text-sm text-white/60">illustrator · storyteller</p>
        <div className="mt-3 flex gap-1.5">
          {[siInstagram, siYoutube, siSpotify, siGithub].map((icon) => (
            <span
              key={icon.title}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/85"
            >
              <BrandIcon path={icon.path} className="size-3.5" />
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 rounded-full bg-brand-lime px-5 py-3.5 text-sm font-bold text-brand-ink">
            <Link2 className="size-4" /> new print drop 🔥
          </div>
          <div className="flex items-center gap-2.5 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-brand-ink">
            🎬 studio vlog — ep. 12
          </div>
          <div className="flex items-center gap-2.5 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-brand-ink">
            ☕ buy me a coffee
          </div>
        </div>
      </div>

      {/* Stats tile */}
      <div className="absolute top-6 -right-4 z-20 hidden rotate-3 rounded-3xl bg-brand-blush px-6 py-5 text-brand-ink shadow-[0_16px_40px_rgba(0,0,0,0.14)] sm:block">
        <BarChart3 className="size-5" />
        <p className="mt-2 font-display text-3xl leading-none font-black">12,480</p>
        <p className="mt-1 text-xs font-semibold opacity-70">views this week</p>
      </div>

      {/* QR tile */}
      <div className="absolute bottom-24 -left-6 z-20 hidden -rotate-6 rounded-3xl bg-brand-lilac px-5 py-4 text-brand-ink shadow-[0_16px_40px_rgba(0,0,0,0.14)] sm:block">
        <QrCode className="size-8" />
        <p className="mt-1.5 text-xs font-bold">scan me</p>
      </div>

      {/* Follower tile */}
      <div className="absolute right-8 -bottom-5 z-20 hidden rotate-2 rounded-3xl bg-white px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.14)] sm:flex sm:items-center sm:gap-2.5">
        <Heart className="size-5 fill-current text-brand-violet" />
        <p className="text-sm font-bold text-brand-ink">+214 clicks today</p>
      </div>
    </div>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const router = useRouter()
  const [name, setName] = useState('')

  function claim(e: React.FormEvent) {
    e.preventDefault()
    router.push(
      `/login?mode=signup${name ? `&username=${encodeURIComponent(name)}` : ''}`
    )
  }

  return (
    <section className="overflow-hidden bg-brand-lime">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 pt-40 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pt-48 lg:pb-32">
        <div className="max-w-2xl">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="font-display text-5xl leading-[0.98] font-black tracking-tight text-balance text-brand-ink sm:text-7xl lg:text-[5.5rem]"
          >
            Everything you are. One beautiful link.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
            className="mt-7 max-w-lg text-lg font-medium text-pretty text-brand-ink/80 sm:text-xl"
          >
            The open-source link in bio. Share everything you create, curate, and love —
            from one link that is completely, forever yours.
          </motion.p>

          <motion.form
            onSubmit={claim}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <div className="flex h-15 flex-1 items-center rounded-2xl bg-white pl-6 shadow-[0_8px_28px_rgba(0,0,0,0.12)] focus-within:ring-4 focus-within:ring-brand-ink/20">
              <span className="text-base font-semibold text-brand-ink/40">linkyaar/</span>
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                }
                className="h-full flex-1 bg-transparent px-1 text-base font-semibold text-brand-ink outline-none placeholder:text-brand-ink/30"
                placeholder="yourname"
                aria-label="Your username"
                maxLength={30}
              />
            </div>
            <Button
              type="submit"
              className="h-15 rounded-2xl bg-brand-ink px-8 text-base font-bold text-white transition-transform duration-300 hover:scale-[1.02] hover:bg-brand-ink/90"
            >
              Claim your LinkYaar
            </Button>
          </motion.form>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 text-sm font-medium text-brand-ink/60"
          >
            Free forever · open source · no watermarks, no ransom
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        >
          <HeroCollage />
        </motion.div>
      </div>
    </section>
  )
}
