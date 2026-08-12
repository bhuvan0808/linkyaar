// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'
import { mergeThemeTokens, type ThemeTokens } from '@/features/themes/tokens'
import {
  type Link,
  type LinkGroup,
  type Profile,
  type SocialLink,
  type Tables,
} from '@/types/database'

/** A category heading plus the links under it, in display order. */
export interface LinkSection {
  group: LinkGroup | null
  links: Link[]
}

export interface PublicProfileData {
  profile: Profile
  links: Link[]
  sections: LinkSection[]
  socials: SocialLink[]
  reviews: Tables<'reviews'>[]
  tokens: ThemeTokens
}

/**
 * Fetch everything the public profile page needs. Cached per request
 * so generateMetadata and the page share one round of queries.
 * Only enabled links inside their schedule window are returned.
 */
export const getPublicProfile = cache(
  async (username: string): Promise<PublicProfileData | null> => {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('is_public', true)
      .maybeSingle()

    if (!profile) return null

    const nowIso = new Date().toISOString()

    const [linksRes, groupsRes, socialsRes, reviewsRes, themeRes] = await Promise.all([
      supabase
        .from('links')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('is_enabled', true)
        .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .order('is_featured', { ascending: false })
        .order('position'),
      supabase
        .from('link_groups')
        .select('*')
        .eq('profile_id', profile.id)
        .order('position'),
      supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', profile.id)
        .order('position'),
      profile.reviews_enabled
        ? supabase
            .from('reviews')
            .select('*')
            .eq('profile_id', profile.id)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(8)
        : Promise.resolve({ data: [] }),
      profile.theme_id
        ? supabase.from('themes').select('*').eq('id', profile.theme_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ])

    const links = linksRes.data ?? []
    const groups = groupsRes.data ?? []

    // Ungrouped links first, then each group (in order) with its links.
    // Featured links stay pinned within their bucket by the query order.
    const sections: LinkSection[] = []
    const ungrouped = links.filter((l) => !l.group_id)
    if (ungrouped.length > 0) sections.push({ group: null, links: ungrouped })
    for (const group of groups) {
      const groupLinks = links.filter((l) => l.group_id === group.id)
      if (groupLinks.length > 0) sections.push({ group, links: groupLinks })
    }

    return {
      profile,
      links,
      sections,
      socials: socialsRes.data ?? [],
      reviews: reviewsRes.data ?? [],
      tokens: mergeThemeTokens(themeRes.data?.tokens ?? null, profile.custom_theme),
    }
  }
)

/** The signed-in user's own profile, or null when signed out. */
export const getOwnProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  return data
})
