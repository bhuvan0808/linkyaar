import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AudienceManager } from '@/features/audience/components/audience-manager'
import { createClient } from '@/lib/supabase/server'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = { title: 'Audience' }

export default async function AudiencePage() {
  const profile = await getOwnProfile()
  if (!profile?.username) redirect('/onboarding')

  const supabase = await createClient()
  const [{ data: contacts }, { data: reviews }] = await Promise.all([
    supabase
      .from('contacts')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(500),
    supabase
      .from('reviews')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audience</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          Subscribers and reviews — collected on your page, owned by you.
        </p>
      </div>
      <AudienceManager
        profile={profile}
        contacts={contacts ?? []}
        reviews={reviews ?? []}
      />
    </div>
  )
}
