// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { PreviewFrame } from '@/features/dashboard/components/preview-frame'
import { LinksManager } from '@/features/links/components/links-manager'
import { createClient } from '@/lib/supabase/server'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = { title: 'Links' }

export default async function DashboardLinksPage() {
  const profile = await getOwnProfile()
  if (!profile?.username) redirect('/onboarding')

  const supabase = await createClient()
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position')

  return (
    <div className="flex gap-8">
      <section className="max-w-2xl min-w-0 flex-1">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
        <p className="mt-1 mb-6 text-[15px] text-muted-foreground">
          Drag to reorder. Toggle to hide. Star to feature.
        </p>
        <LinksManager links={links ?? []} />
      </section>
      <PreviewFrame username={profile.username} />
    </div>
  )
}
