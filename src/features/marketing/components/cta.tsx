// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/shared/fade-in'

/** Full-bleed chili-red closer. */
export function Cta() {
  return (
    <section className="bg-brand-red py-24 sm:py-32">
      <FadeIn className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-4xl leading-[1.02] font-black tracking-tight text-balance text-brand-cream sm:text-7xl">
          Jumpstart your corner of the internet today.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg font-medium text-brand-cream/85">
          Claim your name before someone else with your name does.
        </p>
        <Button
          size="lg"
          asChild
          className="mt-10 h-15 rounded-full bg-white px-9 text-base font-bold text-brand-red shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/95"
        >
          <Link href="/login?mode=signup">Create your LinkYaar</Link>
        </Button>
      </FadeIn>
    </section>
  )
}
