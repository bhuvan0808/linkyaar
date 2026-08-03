import { GripVertical, Link2, QrCode, Search, Unlock } from 'lucide-react'

import { FadeIn } from '@/components/shared/fade-in'
import { RotatingWord } from '@/features/marketing/components/rotating-word'

/** Big pastel bento blocks, Linktree-style editorial sections. */
export function Features() {
  return (
    <section className="bg-brand-cream py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6">
        {/* Rotating-word statement */}
        <FadeIn className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl leading-[1.02] font-black tracking-tight text-balance text-brand-ink sm:text-6xl lg:text-7xl">
            The open-source link in bio built for <RotatingWord />
          </h2>
        </FadeIn>

        {/* Bento grid */}
        <div className="mt-20 grid gap-5 lg:grid-cols-2">
          {/* Links block — blush */}
          <FadeIn>
            <article className="rounded-[2.5rem] bg-brand-blush p-9 sm:p-12">
              <div className="max-w-md">
                <h3 className="font-display text-3xl leading-tight font-black tracking-tight text-brand-ink sm:text-4xl">
                  Unlimited links. Drag, drop, done.
                </h3>
                <p className="mt-4 text-lg font-medium text-brand-ink/70">
                  Reorder with a drag, feature what matters, schedule the rest, and toggle
                  anything off without deleting it.
                </p>
              </div>
              <div className="mt-9 flex max-w-sm flex-col gap-3">
                {['🔥 new drop — live now', '🎬 latest video', '📖 my newsletter'].map(
                  (label, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 rounded-full px-6 py-4 text-[15px] font-bold shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
                        i === 0 ? 'bg-brand-ink text-white' : 'bg-white text-brand-ink'
                      }`}
                    >
                      <GripVertical className="size-4 opacity-40" aria-hidden />
                      {label}
                    </div>
                  )
                )}
              </div>
            </article>
          </FadeIn>

          {/* Sharing block — lilac */}
          <FadeIn delay={0.08}>
            <article className="flex flex-col rounded-[2.5rem] bg-brand-lilac p-9 sm:p-12">
              <div className="max-w-md">
                <h3 className="font-display text-3xl leading-tight font-black tracking-tight text-brand-ink sm:text-4xl">
                  Share it everywhere. Even offline.
                </h3>
                <p className="mt-4 text-lg font-medium text-brand-ink/70">
                  One short URL for every bio, plus a crisp QR code you can drop on
                  posters, slides, and business cards.
                </p>
              </div>
              <div className="mt-9 flex flex-1 items-end gap-4">
                <div className="flex items-center gap-2.5 rounded-full bg-white px-6 py-4 text-[15px] font-bold text-brand-ink shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                  <Link2 className="size-4" aria-hidden />
                  linkyaar/maya
                </div>
                <div className="flex size-24 items-center justify-center rounded-3xl bg-brand-ink text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                  <QrCode className="size-12" aria-hidden />
                </div>
              </div>
            </article>
          </FadeIn>

          {/* SEO block — white */}
          <FadeIn>
            <article className="rounded-[2.5rem] bg-white p-9 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-12">
              <Search className="size-8 text-brand-violet" aria-hidden />
              <h3 className="mt-5 font-display text-3xl leading-tight font-black tracking-tight text-brand-ink sm:text-4xl">
                Found on Google, gorgeous on socials.
              </h3>
              <p className="mt-4 max-w-md text-lg font-medium text-brand-ink/70">
                Clean URLs, rich previews, and a custom social card generated for every
                profile — automatically.
              </p>
            </article>
          </FadeIn>

          {/* Open source block — ink */}
          <FadeIn delay={0.08}>
            <article className="rounded-[2.5rem] bg-brand-ink p-9 sm:p-12">
              <Unlock className="size-8 text-brand-lime" aria-hidden />
              <h3 className="mt-5 font-display text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl">
                Open source. No ransom. Ever.
              </h3>
              <p className="mt-4 max-w-md text-lg font-medium text-white/70">
                MIT licensed. Self-host it, fork it, audit every line. Your audience is
                yours — export everything with one click.
              </p>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
