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
import { Separator } from '@/components/ui/separator'
import {
  DeleteAccountButton,
  EmailNotificationsToggle,
  ExportButton,
  PasswordForm,
  VisibilityToggle,
} from '@/features/settings/components/account-settings'
import { createClient } from '@/lib/supabase/server'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const profile = await getOwnProfile()
  if (!profile?.username) redirect('/onboarding')

  const supabase = await createClient()
  const [
    {
      data: { user },
    },
    { data: settings },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('user_settings').select('preferences').maybeSingle(),
  ])
  const prefs = settings?.preferences as { email_notifications?: boolean } | null
  const emailNotifications = prefs?.email_notifications !== false

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Account, privacy, and data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <VisibilityToggle isPublic={profile.is_public} />
          <Separator />
          <EmailNotificationsToggle enabled={emailNotifications} />
          <Separator />
          <PasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>
            Everything LinkYaar stores about you, in one portable file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExportButton />
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Permanent. No undo. No guilt trips.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  )
}
