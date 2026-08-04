// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

/**
 * Product analytics (PostHog). Loads only when the key is configured,
 * so self-hosters without PostHog run clean. Anonymous-first:
 * person profiles only for identified (signed-in) users.
 */
export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key || posthog.__loaded) return
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      defaults: '2026-05-30',
      person_profiles: 'identified_only',
      respect_dnt: true,
    })
  }, [])

  return null
}
