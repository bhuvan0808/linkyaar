// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { redirect } from 'next/navigation'

import { DashNav } from '@/features/dashboard/components/dash-nav'
import { DashTopbar } from '@/features/dashboard/components/dash-topbar'
import { getOwnProfile } from '@/services/profiles'

export const metadata = {
  robots: { index: false },
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getOwnProfile()
  if (!profile) redirect('/login')
  if (!profile.username) redirect('/onboarding')

  return (
    <div className="min-h-dvh bg-background">
      <DashTopbar username={profile.username} avatarUrl={profile.avatar_url} />
      <div className="mx-auto flex max-w-6xl gap-8 px-4 pt-6 pb-24 sm:px-6 lg:pb-10">
        <DashNav />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
