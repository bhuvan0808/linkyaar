import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/shared/fade-in'

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[oklch(0.24_0.06_300)] via-[oklch(0.2_0.05_285)] to-[oklch(0.14_0.04_265)] px-6 py-16 text-center shadow-[var(--shadow-float)] sm:px-16 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.64_0.21_293/0.3),transparent_60%)]"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              Your corner of the internet
              <br className="hidden sm:block" /> is one click away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
              Claim your name before someone else with your name does.
            </p>
            <Button
              size="lg"
              asChild
              className="mt-8 h-12 rounded-full bg-accent px-7 text-[15px] text-accent-foreground shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
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
