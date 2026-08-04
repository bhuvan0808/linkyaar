'use client'

import { Check, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'

import { subscribe } from '@/features/audience/actions'
import { type ThemeTokens } from '@/features/themes/tokens'

export function SubscribeCard({
  profileId,
  tokens,
}: {
  profileId: string
  tokens: ThemeTokens
}) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const result = await subscribe({ profileId, email, website })
    if (result.error) {
      setState('error')
      setMessage(result.error)
      return
    }
    setState('done')
  }

  const surface = `color-mix(in oklab, ${tokens.foreground} 8%, transparent)`

  return (
    <section
      aria-label="Subscribe for updates"
      className="w-full rounded-3xl p-5"
      style={{ background: surface }}
    >
      {state === 'done' ? (
        <p className="flex items-center justify-center gap-2 py-2 text-sm font-semibold">
          <Check className="size-4" aria-hidden /> You are on the list!
        </p>
      ) : (
        <>
          <p className="flex items-center gap-2 text-sm font-bold">
            <Mail className="size-4" aria-hidden /> Get updates from me
          </p>
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            {/* Honeypot — hidden from humans */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Your email"
              className="h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-sm font-medium text-black outline-none placeholder:text-black/40"
            />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="flex h-11 items-center gap-1.5 rounded-full px-5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03] disabled:opacity-60"
              style={{
                background: tokens.accent,
                color: tokens.mode === 'dark' ? 'oklch(0.16 0.01 286)' : '#fff',
              }}
            >
              {state === 'sending' && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              Subscribe
            </button>
          </form>
          {state === 'error' && (
            <p className="mt-2 text-xs font-medium opacity-80">{message}</p>
          )}
        </>
      )}
    </section>
  )
}
