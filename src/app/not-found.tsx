// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-brand-cream px-6 text-center">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element -- brand glyph */}
        <img
          src="/brand/glyph-ink.png"
          alt=""
          width={34}
          height={34}
          className="h-8.5 w-auto"
        />
        <span className="font-display text-2xl font-black tracking-tight text-brand-ink">
          LinkYaar
        </span>
      </div>
      <h1 className="mt-8 font-display text-7xl font-black tracking-tight text-brand-ink sm:text-9xl">
        404
      </h1>
      <p className="mt-4 max-w-sm text-lg font-medium text-brand-ink/70">
        This page doesn&apos;t exist — but that username might still be free.
      </p>
      <div className="mt-8 flex gap-3">
        <Button
          asChild
          className="h-12 rounded-full bg-brand-ink px-6 font-bold text-white hover:bg-brand-ink/90"
        >
          <Link href="/login?mode=signup">Claim your LinkYaar</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-full border-brand-ink/20 px-6 font-bold text-brand-ink hover:bg-brand-ink/5"
        >
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  )
}
