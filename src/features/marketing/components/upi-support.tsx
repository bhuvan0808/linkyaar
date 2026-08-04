// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Check, Copy } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

/** UPI donation card: deep link + scannable QR, generated client-side. */
export function UpiSupport({ upiId }: { upiId: string }) {
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('LinkYaar')}&cu=INR&tn=${encodeURIComponent('Keep LinkYaar free')}`

  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      margin: 1,
      width: 440,
      color: { dark: '#254433', light: '#ffffff' },
    })
      .then(setQr)
      .catch(() => setQr(null))
  }, [upiUri])

  async function copyId() {
    await navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex flex-col items-center gap-5 rounded-[2rem] bg-white p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {qr ? (
        // eslint-disable-next-line @next/next/no-img-element -- data URL
        <img
          src={qr}
          alt={`UPI QR code for ${upiId}`}
          className="w-52 rounded-2xl border border-brand-ink/10"
        />
      ) : (
        <div className="h-52 w-52 animate-pulse rounded-2xl bg-brand-sand" />
      )}
      <button
        onClick={copyId}
        className="flex items-center gap-2 rounded-full border border-brand-ink/15 px-5 py-2.5 text-sm font-bold text-brand-ink transition-colors hover:bg-brand-ink/5"
      >
        {upiId}
        {copied ? (
          <Check className="size-4 text-emerald-600" aria-hidden />
        ) : (
          <Copy className="size-4 opacity-60" aria-hidden />
        )}
      </button>
      <a
        href={upiUri}
        className="rounded-full bg-brand-ink px-6 py-3 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-brand-ink/90 sm:hidden"
      >
        Open UPI app
      </a>
      <p className="max-w-xs text-center text-xs font-medium text-brand-ink/50">
        Scan with GPay, PhonePe, Paytm, or any UPI app. Any amount — every rupee goes to
        servers and the free AI pool.
      </p>
    </div>
  )
}
