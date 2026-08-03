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
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.24_0.06_300)] via-[oklch(0.19_0.05_285)] to-[oklch(0.13_0.04_265)] lg:block">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.64_0.21_293/0.35),transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            Link<span className="text-[oklch(0.75_0.15_293)]">Yaar</span>
          </Link>
          <blockquote className="max-w-md">
            <p className="text-2xl leading-snug font-medium text-balance text-white">
              “One page that finally feels like my whole self — not a menu of corporate
              buttons.”
            </p>
            <footer className="mt-4 text-sm text-white/60">
              — every creator, eventually
            </footer>
          </blockquote>
          <p className="text-xs text-white/40">Open source · MIT · no lock-in</p>
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
