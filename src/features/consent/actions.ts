// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use server'

import { cookies, headers } from 'next/headers'
import { z } from 'zod'

import { CONSENT_COOKIE, CONSENT_VALUE } from '@/features/consent/shared'
import { allow } from '@/lib/ratelimit'
import { createAnonClient } from '@/lib/supabase/anon'
import { parseUserAgent } from '@/lib/ua'

/**
 * Records a profile view — ONLY when the visitor has consented.
 * Re-checks the consent cookie server-side (never trust the client),
 * so a spoofed call without real consent records nothing.
 */
export async function recordProfileView(profileId: string): Promise<void> {
  const parsed = z.uuid().safeParse(profileId)
  if (!parsed.success) return

  const cookieStore = await cookies()
  if (cookieStore.get(CONSENT_COOKIE)?.value !== CONSENT_VALUE) return

  const headerList = await headers()
  const ip =
    headerList.get('x-real-ip') ??
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (!(await allow('view', ip))) return

  const ua = parseUserAgent(headerList.get('user-agent'))
  const supabase = createAnonClient()
  await supabase.from('profile_views').insert({
    profile_id: parsed.data,
    referrer: headerList.get('referer'),
    country: headerList.get('x-vercel-ip-country'),
    device: ua.device,
    browser: ua.browser,
    os: ua.os,
  })
}
