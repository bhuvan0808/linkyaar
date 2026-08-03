import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'

export const metadata: Metadata = {
  title: 'Cookie Notice',
  description: 'The (very short) list of cookies LinkYaar uses.',
}

export default function CookiesPage() {
  return (
    <ProsePage
      title="Cookie Notice"
      updated="August 3, 2026"
      intro="This is a short page, because we use almost no cookies — and zero tracking ones."
    >
      <h2>Cookies we set</h2>
      <ul>
        <li>
          <strong>Auth session cookies</strong> (<code>sb-*</code>) — set by Supabase Auth
          when you sign in, so you stay signed in between visits. Strictly necessary;
          removed on sign-out.
        </li>
      </ul>

      <h2>Cookies we do not set</h2>
      <ul>
        <li>No advertising or cross-site tracking cookies</li>
        <li>No third-party analytics cookies</li>
        <li>No cookies at all for visitors browsing public profiles</li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        Because the only cookies are strictly necessary for signing in, there is no
        consent banner to click and nothing to configure. Blocking these cookies in your
        browser simply means you cannot stay signed in.
      </p>
    </ProsePage>
  )
}
