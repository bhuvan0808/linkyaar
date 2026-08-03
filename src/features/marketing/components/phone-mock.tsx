'use client'

import { motion, useReducedMotion } from 'motion/react'
import { BarChart3, Palette } from 'lucide-react'
import { siGithub, siInstagram, siSpotify, siX, siYoutube } from 'simple-icons'

import { BrandIcon } from '@/components/shared/brand-icon'

const demoLinks = [
  { emoji: '🎬', label: 'New video — behind the scenes' },
  { emoji: '🎨', label: 'Print shop' },
  { emoji: '🎙️', label: 'Podcast — ep. 42' },
  { emoji: '☕', label: 'Buy me a coffee' },
]

const demoSocials = [siInstagram, siYoutube, siX, siSpotify, siGithub]

/** Floating phone preview of a creator profile, cream on the dark hero. */
export function PhoneMock() {
  const reduce = useReducedMotion()

  return (
    <div className="relative" aria-hidden>
      {/* Floating stat card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="absolute top-16 -right-6 z-10 hidden items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 text-[oklch(0.25_0.05_295)] shadow-[var(--shadow-float)] sm:flex"
      >
        <BarChart3 className="size-4 text-brand-pink" />
        <div>
          <p className="text-sm leading-none font-semibold">12,480</p>
          <p className="mt-1 text-[11px] leading-none opacity-60">views this week</p>
        </div>
      </motion.div>

      {/* Floating theme card */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="absolute bottom-24 -left-8 z-10 hidden items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-3 text-[oklch(0.25_0.05_295)] shadow-[var(--shadow-float)] sm:flex"
      >
        <Palette className="size-4 text-brand-orange" />
        <div>
          <p className="text-sm leading-none font-semibold">15 themes</p>
          <p className="mt-1 text-[11px] leading-none opacity-60">one-tap restyle</p>
        </div>
      </motion.div>

      {/* Phone — warm cream against the midnight hero */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto w-[280px] rounded-[2.75rem] bg-brand-cream p-5 shadow-[0_32px_80px_rgba(0,0,0,0.45)] ring-8 ring-white/10 sm:w-[300px]"
      >
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-black/10" />

        <div className="flex flex-col items-center text-center text-brand-ink">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink to-brand-indigo text-2xl shadow-[var(--shadow-glow)]">
            🪄
          </div>
          <p className="mt-3 text-[15px] font-bold">Maya Draws</p>
          <p className="mt-1 text-xs opacity-60">
            Illustrator · 200k friends on the internet
          </p>
          <div className="mt-3 flex gap-1.5">
            {demoSocials.map((icon) => (
              <span
                key={icon.title}
                className="flex size-7 items-center justify-center rounded-full bg-black/5 text-brand-ink/70"
              >
                <BrandIcon path={icon.path} className="size-3.5" />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          {demoLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.12,
                duration: 0.45,
                ease: [0.32, 0.72, 0, 1],
              }}
              className={`flex items-center gap-3 rounded-full px-4 py-3 ${
                i === 0
                  ? 'bg-brand-pink text-white shadow-[0_6px_20px_oklch(0.64_0.23_3/0.35)]'
                  : 'bg-white text-brand-ink shadow-[var(--shadow-soft)]'
              }`}
            >
              <span className="text-base">{link.emoji}</span>
              <span className="truncate text-[13px] font-semibold">{link.label}</span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] tracking-wide text-brand-ink/40">
          linkyaar / maya
        </p>
      </motion.div>
    </div>
  )
}
