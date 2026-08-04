// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { FadeIn } from '@/components/shared/fade-in'
import { createClient } from '@/lib/supabase/server'
import { parseThemeTokens } from '@/features/themes/tokens'

/** Tall rounded theme cards in a scrollable row — reads the live catalog. */
export async function ThemeShowcase() {
  const supabase = await createClient()
  const { data: themes } = await supabase
    .from('themes')
    .select('id, key, name, tokens')
    .order('created_at')

  if (!themes?.length) return null

  return (
    <section className="bg-brand-cream py-24 sm:py-32" id="themes">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="max-w-3xl">
          <h2 className="font-display text-4xl leading-[1.02] font-black tracking-tight text-balance text-brand-ink sm:text-6xl">
            Fifteen moods. Zero CSS required.
          </h2>
          <p className="mt-5 text-lg font-medium text-brand-ink/70">
            Every theme hand-tuned for contrast, rhythm, and feel. Restyle your whole page
            in one tap.
          </p>
        </FadeIn>
      </div>

      <FadeIn className="mt-14">
        <div className="flex [scrollbar-width:none] scrollbar-none gap-4 overflow-x-auto px-6 pb-4 sm:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {themes.map((theme) => {
            const tokens = parseThemeTokens(theme.tokens)
            return (
              <div
                key={theme.id}
                className="flex h-72 w-52 shrink-0 flex-col justify-between rounded-[2rem] border border-black/5 p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-2"
                style={{ background: tokens.background }}
              >
                <div className="flex flex-col gap-2.5" aria-hidden>
                  <div
                    className="size-10 rounded-full opacity-90"
                    style={{ background: tokens.accent }}
                  />
                  <div
                    className="h-2.5 w-20 rounded-full opacity-70"
                    style={{ background: tokens.foreground }}
                  />
                  <div
                    className="h-2.5 w-14 rounded-full opacity-30"
                    style={{ background: tokens.foreground }}
                  />
                </div>
                <div>
                  <div
                    className="mb-4 h-9 w-full rounded-full opacity-90"
                    style={{ background: tokens.accent }}
                    aria-hidden
                  />
                  <p
                    className="font-display text-lg font-black"
                    style={{ color: tokens.foreground }}
                  >
                    {theme.name}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </FadeIn>
    </section>
  )
}
