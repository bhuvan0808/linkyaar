// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

import { CONSENT_COOKIE, CONSENT_VALUE } from '@/features/consent/shared'

/**
 * Lets a visitor see and withdraw their analytics consent — DPDP
 * requires withdrawal to be as easy as granting it.
 */
export function ConsentControls() {
  const [mounted, setMounted] = useState(false)
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setConsented(
        document.cookie
          .split('; ')
          .some((c) => c === `${CONSENT_COOKIE}=${CONSENT_VALUE}`)
      )
      setMounted(true)
    })
  }, [])

  function withdraw() {
    document.cookie = `${CONSENT_COOKIE}=; path=/; max-age=0; SameSite=Lax`
    try {
      sessionStorage.removeItem('ly-consent-dismissed')
    } catch {
      // ignore
    }
    setConsented(false)
  }

  if (!mounted) return null

  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
      <p className="text-sm font-medium">
        Analytics consent:{' '}
        <span className={consented ? 'text-success' : 'text-muted-foreground'}>
          {consented ? 'granted' : 'not granted'}
        </span>
      </p>
      {consented ? (
        <button
          onClick={withdraw}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Withdraw consent
        </button>
      ) : (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Check className="size-4" aria-hidden /> Nothing is collected
        </span>
      )}
    </div>
  )
}
