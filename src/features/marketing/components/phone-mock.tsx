'use client'

import { motion, useReducedMotion } from 'motion/react'
import { BarChart3, Palette } from 'lucide-react'

const demoLinks = [
  { emoji: '🎬', label: 'New video — behind the scenes' },
  { emoji: '🎨', label: 'Print shop' },
  { emoji: '🎙️', label: 'Podcast — ep. 42' },
  { emoji: '☕', label: 'Buy me a coffee' },
]

const demoSocials = ['IG', 'YT', 'X', 'GH']

/** Floating phone preview of a themed creator profile. */
export function PhoneMock() {
  const reduce = useReducedMotion()

  return (
    <div className="relative" aria-hidden>
      {/* Floating stat card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="absolute top-16 -right-6 z-10 hidden items-center gap-2.5 rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:flex dark:border-white/10 dark:bg-white/10"
      >
        <BarChart3 className="size-4 text-accent" />
        <div>
          <p className="text-sm leading-none font-semibold">12,480</p>
          <p className="mt-1 text-[11px] leading-none text-muted-foreground">
            views this week
          </p>
        </div>
      </motion.div>

      {/* Floating theme card */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="absolute bottom-24 -left-8 z-10 hidden items-center gap-2.5 rounded-2xl border border-white/50 bg-white/80 px-4 py-3 shadow-[var(--shadow-lift)] backdrop-blur-xl sm:flex dark:border-white/10 dark:bg-white/10"
      >
        <Palette className="size-4 text-accent" />
        <div>
          <p className="text-sm leading-none font-semibold">15 themes</p>
          <p className="mt-1 text-[11px] leading-none text-muted-foreground">
            one-tap restyle
          </p>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto w-[280px] rounded-[2.75rem] border border-white/20 bg-gradient-to-b from-[oklch(0.22_0.06_300)] to-[oklch(0.13_0.04_265)] p-5 shadow-[var(--shadow-float)] sm:w-[300px]"
      >
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/20" />

        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.18_293)] to-[oklch(0.55_0.24_292)] text-2xl shadow-[var(--shadow-glow)]">
            🪄
          </div>
          <p className="mt-3 text-[15px] font-semibold text-white">Maya Draws</p>
          <p className="mt-1 text-xs text-white/60">
            Illustrator · 200k friends on the internet
          </p>
          <div className="mt-3 flex gap-2">
            {demoSocials.map((s) => (
              <span
                key={s}
                className="flex size-7 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold text-white/80"
              >
                {s}
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
              className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <span className="text-base">{link.emoji}</span>
              <span className="truncate text-[13px] font-medium text-white/90">
                {link.label}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] tracking-wide text-white/40">
          linkyaar / maya
        </p>
      </motion.div>
    </div>
  )
}
