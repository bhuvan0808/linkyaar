import { FadeIn } from '@/components/shared/fade-in'
import { createClient } from '@/lib/supabase/server'
import { parseThemeTokens } from '@/features/themes/tokens'

/** Live theme strip — reads the real catalog so it never goes stale. */
export async function ThemeShowcase() {
  const supabase = await createClient()
  const { data: themes } = await supabase
    .from('themes')
    .select('id, key, name, tokens')
    .order('created_at')

  if (!themes?.length) return null

  return (
    <section className="border-y border-border bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Fifteen moods. Zero CSS required.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every theme is hand-tuned for contrast, rhythm, and feel.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {themes.map((theme, i) => {
            const tokens = parseThemeTokens(theme.tokens)
            return (
              <FadeIn key={theme.id} delay={Math.min(i * 0.04, 0.4)}>
                <div
                  className="group flex h-28 flex-col justify-between overflow-hidden rounded-2xl border border-black/5 p-4 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  style={{ background: tokens.background }}
                >
                  <div className="flex gap-1.5">
                    <span
                      className="block h-1.5 w-8 rounded-full opacity-90"
                      style={{ background: tokens.accent }}
                    />
                    <span
                      className="block h-1.5 w-4 rounded-full opacity-40"
                      style={{ background: tokens.foreground }}
                    />
                  </div>
                  <p
                    className="text-sm font-semibold tracking-tight"
                    style={{ color: tokens.foreground }}
                  >
                    {theme.name}
                  </p>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
