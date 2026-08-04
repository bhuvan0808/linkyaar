// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { NextResponse } from 'next/server'
import { after } from 'next/server'

import { sendWelcomeEmail } from '@/features/notifications/send'
import { createClient } from '@/lib/supabase/server'

/**
 * OAuth / magic-link / email-confirmation landing point.
 * Exchanges the auth code for a session, then routes the user to
 * onboarding (no username yet) or their intended destination.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, display_name')
          .eq('id', user.id)
          .maybeSingle()

        // First arrival: account created in the last 15 minutes and no
        // username claimed yet → greet them once.
        const isNew =
          !profile?.username &&
          Date.now() - new Date(user.created_at).getTime() < 15 * 60 * 1000
        if (isNew && user.email) {
          const email = user.email
          const displayName = profile?.display_name
          after(() => sendWelcomeEmail(email, displayName))
        }

        const destination = profile?.username ? next : '/onboarding'
        return NextResponse.redirect(`${origin}${destination}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
