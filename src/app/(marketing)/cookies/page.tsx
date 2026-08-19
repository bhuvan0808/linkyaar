// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { ConsentControls } from '@/features/consent/components/consent-controls'
import { ProsePage } from '@/features/marketing/components/prose-page'

export const metadata: Metadata = {
  title: 'Cookie Notice',
  description: 'The (very short) list of cookies LinkYaar uses.',
}

export default function CookiesPage() {
  return (
    <ProsePage
      title="Cookie Notice"
      updated="August 6, 2026"
      intro="This is a short page, because we use almost no cookies — and zero tracking ones."
    >
      <h2>Cookies we set</h2>
      <ul>
        <li>
          <strong>Auth session cookies</strong> (<code>sb-*</code>) — set by Supabase Auth
          when you sign in, so you stay signed in between visits. Strictly necessary;
          removed on sign-out.
        </li>
        <li>
          <strong>Analytics consent</strong> (<code>ly_analytics_consent</code>) — set{' '}
          <em>only</em> if you tap “Accept” on the analytics prompt when visiting a
          creator&apos;s page. It records your choice so we don&apos;t ask again, and it
          is the switch that turns anonymous visit stats on. Never set without your
          explicit consent.
        </li>
      </ul>

      <h2>Cookies we do not set</h2>
      <ul>
        <li>No advertising or cross-site tracking cookies</li>
        <li>No third-party analytics cookies</li>
        <li>No IP logging, ever</li>
        <li>Nothing at all until you opt in</li>
      </ul>

      <h2>Your analytics consent</h2>
      <p>
        When you visit a creator&apos;s public page, a small prompt asks whether you agree
        to share anonymous visit stats (country and device type — no IP, no cross-site
        tracking) so the creator can see their analytics. It disappears on its own after a
        few seconds; if you don&apos;t tap Accept, <strong>nothing is collected</strong>.
        You can withdraw your consent at any time, right here — as easily as you gave it:
      </p>
      <ConsentControls />
    </ProsePage>
  )
}
