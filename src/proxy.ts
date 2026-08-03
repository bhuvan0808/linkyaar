import { type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/proxy'

/**
 * Next.js 16 proxy (formerly middleware). Keeps Supabase sessions
 * fresh and guards protected routes before they render.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (build assets)
     * - favicon and common static files
     * Session refresh on every other route keeps auth cookies valid.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
}
