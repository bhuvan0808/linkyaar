// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { UsernameForm } from '@/features/auth/components/username-form'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = {
  title: 'Claim your link',
  robots: { index: false },
}

export default async function OnboardingPage() {
  const profile = await getOwnProfile()
  if (!profile) redirect('/login')
  if (profile.username) redirect('/dashboard')

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.16_293/0.15),transparent_60%)]"
        aria-hidden
      />
      <div className="relative w-full max-w-md text-center">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">
          One last thing
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Claim your name
        </h1>
        <p className="mx-auto mt-3 mb-10 max-w-sm text-[15px] text-muted-foreground">
          This becomes your public address. Short, memorable, permanent-ish — you can
          change it later, but old links will not follow.
        </p>
        <UsernameForm />
      </div>
    </main>
  )
}
