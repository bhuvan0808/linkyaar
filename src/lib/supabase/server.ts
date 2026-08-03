import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { env } from '@/lib/env'
import { type Database } from '@/types/database'

/**
 * Server Supabase client for Server Components, Server Actions,
 * and Route Handlers. Create a NEW client per request — never
 * share one across requests (it holds request-scoped cookies).
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component where cookies are read-only.
            // Safe to ignore: the proxy refreshes sessions before this runs.
          }
        },
      },
    }
  )
}
