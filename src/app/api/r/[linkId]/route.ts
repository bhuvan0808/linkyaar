import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

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

  // Await the insert (it is a lazy thenable), but ignore failures —
  // analytics must never block the redirect.
  await supabase.from('link_clicks').insert({
    link_id: link.id,
    profile_id: link.profile_id,
    referrer: request.headers.get('referer'),
    country: request.headers.get('x-vercel-ip-country'),
  })

  return NextResponse.redirect(link.url, { status: 302 })
}
