// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { recordProfileView } from '@/features/consent/actions'
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  CONSENT_VALUE,
} from '@/features/consent/shared'
import { type ThemeTokens } from '@/features/themes/tokens'

function hasConsent(): boolean {
  return document.cookie
    .split('; ')
    .some((c) => c === `${CONSENT_COOKIE}=${CONSENT_VALUE}`)
}

function grantConsent() {
  const maxAge = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${CONSENT_COOKIE}=${CONSENT_VALUE}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
}

/**
 * DPDP-compliant analytics consent.
 *
 * No view or click is recorded until the visitor taps Accept. The chip
 * auto-dismisses after 5s (treated as "no consent" — nothing collected).
 * Consent is stored in a first-party cookie, which also gates click
 * logging server-side. Suppressed inside the dashboard preview iframe.
 */
export function ConsentGate({
  profileId,
  tokens,
}: {
  profileId: string
  tokens: ThemeTokens
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Never prompt or record inside the dashboard live-preview iframe.
    if (window.self !== window.top) return

    if (hasConsent()) {
      // Already consented on a previous visit — record silently.
      void recordProfileView(profileId)
      return
    }
    // Don't re-nag within the same tab session once dismissed.
    if (sessionStorage.getItem('ly-consent-dismissed') === '1') return

    let timer: ReturnType<typeof setTimeout>
    queueMicrotask(() => {
      setShow(true)
      timer = setTimeout(() => dismiss(), 5500)
    })
    return () => clearTimeout(timer)
  }, [profileId])

  function accept() {
    grantConsent()
    setShow(false)
    void recordProfileView(profileId)
  }

  function dismiss() {
    sessionStorage.setItem('ly-consent-dismissed', '1')
    setShow(false)
  }

  const surface = `color-mix(in oklab, ${tokens.foreground} 10%, ${tokens.background})`

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          role="dialog"
          aria-label="Analytics consent"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 font-sans shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:left-auto"
          style={{ background: surface, color: tokens.foreground }}
        >
          <p className="flex-1 text-[12.5px] leading-snug">
            Share anonymous visit stats (country &amp; device — no cookies-tracking, no
            IP) so this creator sees their analytics?{' '}
            <Link
              href="/privacy"
              target="_blank"
              className="underline underline-offset-2 opacity-80"
            >
              Learn more
            </Link>
          </p>
          <button
            onClick={accept}
            aria-label="Accept — allow anonymous analytics"
            className="flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
            style={{
              background: tokens.accent,
              color: tokens.mode === 'dark' ? 'oklch(0.16 0.01 286)' : '#fff',
            }}
          >
            <Check className="size-4" aria-hidden />
          </button>
          <button
            onClick={dismiss}
            aria-label="No thanks — do not collect any data"
            className="shrink-0 opacity-50 transition-opacity hover:opacity-90"
          >
            <X className="size-4" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
