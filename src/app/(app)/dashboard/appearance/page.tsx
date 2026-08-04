// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AvatarUpload } from '@/features/profile/components/avatar-upload'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { SocialsEditor } from '@/features/socials/components/socials-editor'
import { ThemePicker } from '@/features/themes/components/theme-picker'
import { createClient } from '@/lib/supabase/server'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = { title: 'Appearance' }

export default async function AppearancePage() {
  const profile = await getOwnProfile()
  if (!profile?.username) redirect('/onboarding')

  const supabase = await createClient()
  const [{ data: themes }, { data: socials }] = await Promise.all([
    supabase.from('themes').select('*').order('created_at'),
    supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', profile.id)
      .order('position'),
  ])

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Appearance</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Who you are and how your page feels.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Shown at the top of your public page.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <AvatarUpload
            userId={profile.id}
            avatarUrl={profile.avatar_url}
            fallback={profile.username.slice(0, 2)}
          />
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Socials</CardTitle>
          <CardDescription>
            Icon row under your bio — where else people can find you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SocialsEditor socials={socials ?? []} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Applied instantly to your public page.</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePicker themes={themes ?? []} activeThemeId={profile.theme_id} />
        </CardContent>
      </Card>
    </div>
  )
}
