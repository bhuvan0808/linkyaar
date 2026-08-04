// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'
import { type Database } from '@/types/database'

/**
 * Cookie-free anonymous client for work that outlives the request
 * (e.g. analytics inserts inside `after()`), where the cookie store
 * is no longer available. Never use this for user-scoped reads.
 */
export function createAnonClient() {
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
