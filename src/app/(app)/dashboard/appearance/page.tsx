// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AppearanceStudio } from '@/features/appearance/components/appearance-studio'
import { createClient } from '@/lib/supabase/server'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = { title: 'Appearance' }

export default async function AppearancePage() {
  const profile = await getOwnProfile()
  if (!profile?.username) redirect('/onboarding')

  const supabase = await createClient()
  const [{ data: themes }, { data: socials }, { data: links }] = await Promise.all([
    supabase
      .from('themes')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at'),
    supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profile.id)
      .order('position'),
    supabase
      .from('links')
      .select('title')
      .eq('profile_id', profile.id)
      .eq('is_enabled', true)
      .order('position')
      .limit(3),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Appearance</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Your identity, 27 themes, and a full design studio — changes preview instantly.
        </p>
      </div>
      <AppearanceStudio
        profile={profile}
        themes={themes ?? []}
        socials={socials ?? []}
        linkTitles={(links ?? []).map((l) => l.title)}
      />
    </div>
  )
}
