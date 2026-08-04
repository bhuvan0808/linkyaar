import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'
import { type Database } from '@/types/database'

/**
 * SERVER-ONLY service-role client. Bypasses RLS — use it exclusively
 * for narrow, owner-facing plumbing (email lookups, digests).
 * Never import from a client component and never expose its output
 * to a visitor-facing response.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')

  return createSupabaseClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
