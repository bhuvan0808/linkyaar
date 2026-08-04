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
          <Link
            href="/"
            className="font-display text-xl font-black tracking-tight text-white"
          >
            LinkYaar<span className="text-brand-lime">*</span>
          </Link>
          <blockquote className="max-w-md">
            <p className="font-display text-4xl leading-tight font-black text-balance text-brand-lime">
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
            className="mb-8 inline-block text-lg font-semibold tracking-tight lg:hidden"
          >
            Link<span className="text-accent">Yaar</span>
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
