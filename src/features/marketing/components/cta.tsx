import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/shared/fade-in'

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <FadeIn>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-pink via-[oklch(0.55_0.22_330)] to-brand-indigo px-6 py-16 text-center shadow-[var(--shadow-float)] sm:px-16 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.76_0.16_55/0.35),transparent_55%)]"
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance text-white sm:text-6xl">
              Your corner of the internet
              <br className="hidden sm:block" /> is one click away.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-white/80">
              Claim your name before someone else with your name does.
            </p>
            <Button
              size="lg"
              asChild
              className="mt-9 h-13 rounded-full bg-white px-8 text-[15px] font-bold text-brand-ink shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95"
            >
              <Link href="/login?mode=signup">
                Create your LinkYaar
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
