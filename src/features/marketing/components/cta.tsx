// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/shared/fade-in'

/** Full-bleed lime closer, mirroring the hero. */
export function Cta() {
  return (
    <section className="bg-brand-lime py-24 sm:py-32">
      <FadeIn className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-4xl leading-[1.02] font-black tracking-tight text-balance text-brand-ink sm:text-7xl">
          Jumpstart your corner of the internet today.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg font-medium text-brand-ink/70">
          Claim your name before someone else with your name does.
        </p>
        <Button
          size="lg"
          asChild
          className="mt-10 h-15 rounded-full bg-brand-ink px-9 text-base font-bold text-white shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-brand-ink/90"
        >
          <Link href="/login?mode=signup">Create your LinkYaar</Link>
        </Button>
      </FadeIn>
    </section>
  )
}
