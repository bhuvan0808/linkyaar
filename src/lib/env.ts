import { z } from 'zod'

/**
 * Validated environment access. Fail fast at boot instead of
 * deep inside a request when a variable is missing.
 *
 * NEXT_PUBLIC_* vars are inlined into the client bundle by Next.js,
 * so they must be referenced statically (never via dynamic keys).
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({ message: 'NEXT_PUBLIC_SUPABASE_URL must be a URL' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})
