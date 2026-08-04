// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { createBrowserClient } from '@supabase/ssr'

import { env } from '@/lib/env'
import { type Database } from '@/types/database'

/**
 * Browser Supabase client. Safe to call in any Client Component —
 * `createBrowserClient` returns a singleton under the hood.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
