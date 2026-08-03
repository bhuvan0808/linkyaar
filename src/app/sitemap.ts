import { type MetadataRoute } from 'next'

import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // Public profile URLs are appended here once the profile feature lands.
  return [
    {
      url: siteConfig.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
