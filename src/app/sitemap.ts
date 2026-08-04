// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type MetadataRoute } from 'next'

import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: 'weekly', priority: 1 },
    ...[
      '/about',
      '/help',
      '/terms',
      '/privacy',
      '/cookies',
      '/roadmap',
      '/changelog',
      '/contribute',
      '/conduct',
      '/security',
      '/license',
    ].map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ]

  const supabase = await createClient()
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('is_public', true)
    .not('username', 'is', null)
    .limit(5000)

  for (const profile of profiles ?? []) {
    entries.push({
      url: `${siteConfig.url}/${profile.username}`,
      lastModified: profile.updated_at,
      changeFrequency: 'daily',
      priority: 0.8,
    })
  }

  return entries
}
