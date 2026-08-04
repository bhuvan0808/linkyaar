import { emailTemplate, sendEmail } from '@/lib/email'
import { createAdminClient } from '@/lib/supabase/admin'
import { siteConfig } from '@/config/site'

/**
 * Owner notifications. Server-only, always fail-soft — callers fire
 * these inside `after()` and never await UI on them.
 */
async function getOwnerEmail(profileId: string): Promise<string | null> {
  try {
    const admin = createAdminClient()

    // Respect the owner's notification preference (default: on).
    const { data: settings } = await admin
      .from('user_settings')
      .select('preferences')
      .eq('user_id', profileId)
      .maybeSingle()
    const prefs = settings?.preferences as { email_notifications?: boolean } | null
    if (prefs?.email_notifications === false) return null

    const { data } = await admin.auth.admin.getUserById(profileId)
    return data.user?.email ?? null
  } catch {
    return null
  }
}

export async function notifyNewSubscriber(profileId: string, subscriberEmail: string) {
  const to = await getOwnerEmail(profileId)
  if (!to) return

  await sendEmail({
    to,
    subject: 'New subscriber on your LinkYaar 🎉',
    html: emailTemplate({
      heading: 'Someone joined your list',
      body: `<p><strong>${subscriberEmail}</strong> just subscribed for updates on your page. Your audience is growing — it now belongs to you, not an algorithm.</p>`,
      ctaLabel: 'View your audience',
      ctaUrl: `${siteConfig.url}/dashboard/audience`,
    }),
  })
}

export async function notifyNewReview(
  profileId: string,
  review: { authorName: string; rating: number; body?: string }
) {
  const to = await getOwnerEmail(profileId)
  if (!to) return

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
  await sendEmail({
    to,
    subject: 'New review waiting for your approval',
    html: emailTemplate({
      heading: `${stars} from ${review.authorName}`,
      body: `${review.body ? `<p>“${review.body}”</p>` : ''}<p>It stays hidden until you approve it.</p>`,
      ctaLabel: 'Review and approve',
      ctaUrl: `${siteConfig.url}/dashboard/audience`,
    }),
  })
}
