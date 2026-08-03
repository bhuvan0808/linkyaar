import { BarChart3, GripVertical, Palette, QrCode, Search, Unlock } from 'lucide-react'

import { FadeIn } from '@/components/shared/fade-in'

const features = [
  {
    icon: GripVertical,
    title: 'Links that behave',
    body: 'Unlimited links with drag-and-drop ordering, featured pins, schedules, and one-tap show/hide.',
  },
  {
    icon: Palette,
    title: 'Themes with taste',
    body: 'Fifteen hand-tuned themes — from AMOLED black to sunrise gradients. Your page, your mood.',
  },
  {
    icon: BarChart3,
    title: 'Analytics that respect you',
    body: 'Views, clicks, top links, and trends — collected anonymously, owned by you, sold to no one.',
  },
  {
    icon: QrCode,
    title: 'QR everywhere',
    body: 'A crisp QR code for your page, downloadable in PNG or SVG. Posters, slides, business cards.',
  },
  {
    icon: Search,
    title: 'Found on Google',
    body: 'Clean URLs, Open Graph previews, and per-profile social cards generated automatically.',
  },
  {
    icon: Unlock,
    title: 'Open source, no ransom',
    body: 'MIT licensed. Self-host it, fork it, audit it. Your audience is not a hostage.',
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28" id="features">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Everything a creator page should do
        </h2>
        <p className="mt-4 text-lg text-pretty text-muted-foreground">
          Built with the polish of a design studio and the openness of a public commons.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 0.06}>
            <article className="group h-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-accent transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-[17px] font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
