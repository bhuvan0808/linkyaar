// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'

/**
 * Central rate limiting (Upstash Redis, sliding window).
 *
 * Philosophy: protective, never punitive —
 *  - fail-OPEN: if Redis is unreachable/unconfigured, requests pass
 *    (self-hosters without Upstash lose limits, not features);
 *  - user-facing flows are never blocked hard where a soft skip works
 *    (e.g. click redirects always redirect; only logging is skipped).
 */
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null

function makeLimiter(requests: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: 'ly',
  })
}

/** One limiter per surface — budgets documented where applied. */
export const limiters = {
  subscribe: makeLimiter(5, '10 m'), // per ip+profile
  subscribeIp: makeLimiter(20, '1 h'), // per ip across all profiles
  review: makeLimiter(3, '10 m'), // per ip+profile
  reviewIp: makeLimiter(10, '1 h'), // per ip across all profiles
  feedback: makeLimiter(5, '1 h'), // per user
  click: makeLimiter(60, '1 m'), // per ip (log-skip only)
  view: makeLimiter(30, '1 m'), // per ip (log-skip only)
  aiUser: makeLimiter(10, '1 d'), // per user per day
  aiBurst: makeLimiter(3, '1 m'), // per user burst
  aiGlobal: makeLimiter(300, '1 d'), // whole platform per day
}

export type LimiterName = keyof typeof limiters

/** True = allowed. Fail-open on any Redis error. */
export async function allow(name: LimiterName, key: string): Promise<boolean> {
  const limiter = limiters[name]
  if (!limiter) return true
  try {
    const { success } = await limiter.limit(key)
    return success
  } catch {
    return true
  }
}

/** Best-effort caller IP for keying anonymous limits. */
export async function clientIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  )
}
