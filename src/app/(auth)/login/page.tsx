// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

import { AuthForm } from '@/features/auth/components/auth-form'

export const metadata: Metadata = {
  title: 'Log in',
  description: 'Log in to LinkYaar or create your free creator page.',
}

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Art panel */}
      <aside className="relative hidden overflow-hidden bg-brand-ink lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2" aria-label="LinkYaar home">
            {/* eslint-disable-next-line @next/next/no-img-element -- brand glyph */}
            <img
              src="/brand/glyph-white.png"
              alt=""
              width={26}
              height={26}
              className="h-6.5 w-auto"
            />
            <span className="font-display text-xl font-black tracking-tight text-white">
              LinkYaar
            </span>
          </Link>
          <blockquote className="max-w-md">
            <p className="font-display text-4xl leading-tight font-black text-balance text-brand-cream">
              “One page that finally feels like my whole self.”
            </p>
            <footer className="mt-5 text-sm font-medium text-white/50">
              — every creator, eventually
            </footer>
          </blockquote>
          <p className="text-xs font-medium text-white/40">
            Open source · AGPL-3.0 · no lock-in
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
            aria-label="LinkYaar home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- brand glyph */}
            <img
              src="/brand/glyph-ink.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-auto"
            />
            <span className="font-display text-lg font-black tracking-tight text-primary">
              LinkYaar
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="mt-1.5 mb-8 text-[15px] text-muted-foreground">
            Log in or claim your corner of the internet.
          </p>
          <Suspense>
            <AuthForm />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
