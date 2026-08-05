import type { NextConfig } from 'next'

/**
 * Baseline security headers applied to every response.
 * No CSP here yet: Next's inline styles/scripts + Supabase/PostHog/Sentry
 * origins make a strict CSP high-risk to ship blind. HSTS, framing, MIME,
 * referrer, and permissions cover the highest-value protections safely.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
