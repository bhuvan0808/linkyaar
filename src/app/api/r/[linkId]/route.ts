// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { NextResponse, type NextRequest } from 'next/server'

import { allow } from '@/lib/ratelimit'
import { createClient } from '@/lib/supabase/server'
import { parseUserAgent } from '@/lib/ua'

export const dynamic = 'force-dynamic'

/**
 * Click-through redirect: records the click, then 302s to the
 * destination. RLS permits the anonymous insert and only exposes
 * links whose parent profile is public.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  const { linkId } = await params
  const supabase = await createClient()

  const { data: link } = await supabase
    .from('links')
    .select('id, url, profile_id, is_enabled')
    .eq('id', linkId)
    .maybeSingle()

  if (!link?.is_enabled || !/^https?:\/\//i.test(link.url)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Rate limit protects ANALYTICS ONLY (60 logged clicks/min/ip) —
  // the redirect itself always goes through, no matter what.
  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  if (await allow('click', ip)) {
    // Await the insert (it is a lazy thenable), but ignore failures —
    // analytics must never block the redirect.
    await supabase.from('link_clicks').insert({
      link_id: link.id,
      profile_id: link.profile_id,
      referrer: request.headers.get('referer'),
      country: request.headers.get('x-vercel-ip-country'),
      device: parseUserAgent(request.headers.get('user-agent')).device,
    })
  }

  return NextResponse.redirect(link.url, { status: 302 })
}
