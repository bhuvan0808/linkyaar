'use client'

import { Check } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { setTheme } from '@/features/profile/actions'
import { parseThemeTokens } from '@/features/themes/tokens'
import { type Theme } from '@/types/database'

export function ThemePicker({
  themes,
  activeThemeId,
}: {
  themes: Theme[]
  activeThemeId: string | null
}) {
  const [selected, setSelected] = useState(activeThemeId)
  const [, startTransition] = useTransition()

  function choose(theme: Theme) {
    const previous = selected
    setSelected(theme.id)
    startTransition(async () => {
      const result = await setTheme(theme.id)
      if (result.error) {
        setSelected(previous)
        toast.error(result.error)
      } else {
        toast.success(`Theme: ${theme.name}`)
      }
    })
  }

  return (
    <div
      role="radiogroup"
      aria-label="Choose a theme"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {themes.map((theme) => {
        const tokens = parseThemeTokens(theme.tokens)
        const active = selected === theme.id
        return (
          <button
            key={theme.id}
            role="radio"
            aria-checked={active}
            onClick={() => choose(theme)}
            className={`group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] ${
              active
                ? 'border-accent ring-2 ring-accent/30'
                : 'border-black/5 dark:border-white/10'
            }`}
            style={{ background: tokens.background }}
          >
            <div className="flex flex-col gap-1.5">
              <span
                className="block h-2 w-12 rounded-full"
                style={{ background: tokens.accent }}
              />
              <span
                className="block h-2 w-8 rounded-full opacity-40"
                style={{ background: tokens.foreground }}
              />
            </div>
            <span
              className="text-sm font-semibold tracking-tight"
              style={{ color: tokens.foreground }}
            >
              {theme.name}
            </span>
            {active && (
              <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="size-3" aria-hidden />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
