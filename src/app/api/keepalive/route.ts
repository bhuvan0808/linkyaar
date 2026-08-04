// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Pinged daily by Vercel Cron (see vercel.json) so the free-tier
 * Supabase project never hits its inactivity pause. The query is a
 * tiny RLS-guarded read on the public themes catalog.
 */
export async function GET() {
  const supabase = await createClient()
  const { error } = await supabase.from('themes').select('id').limit(1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
