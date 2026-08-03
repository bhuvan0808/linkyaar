import { type MetadataRoute } from 'next'

import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
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
