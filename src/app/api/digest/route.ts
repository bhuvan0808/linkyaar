import { NextResponse, type NextRequest } from 'next/server'

import { emailTemplate, sendEmail } from '@/lib/email'
import { createAdminClient } from '@/lib/supabase/admin'
import { siteConfig } from '@/config/site'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Weekly analytics digest, triggered by Vercel Cron (vercel.json).
 * Sends each active creator their last-7-days numbers. Fail-soft per
 * recipient; capped per run to stay inside limits.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const admin = createAdminClient()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // Profiles with any views this week — no activity, no email.
  const { data: views } = await admin
    .from('profile_views')
    .select('profile_id')
    .gte('created_at', since)
    .limit(10000)

  const activeIds = [...new Set((views ?? []).map((v) => v.profile_id))].slice(0, 100)
  let sent = 0

  for (const profileId of activeIds) {
    try {
      const [{ data: settings }, { count: viewCount }, { count: clickCount }, userRes] =
        await Promise.all([
          admin
            .from('user_settings')
            .select('preferences')
            .eq('user_id', profileId)
            .maybeSingle(),
          admin
            .from('profile_views')
            .select('id', { count: 'exact', head: true })
            .eq('profile_id', profileId)
            .gte('created_at', since),
          admin
            .from('link_clicks')
            .select('id', { count: 'exact', head: true })
            .eq('profile_id', profileId)
            .gte('created_at', since),
          admin.auth.admin.getUserById(profileId),
        ])

      const prefs = settings?.preferences as { email_notifications?: boolean } | null
      const email = userRes.data.user?.email
      if (prefs?.email_notifications === false || !email) continue

      const ok = await sendEmail({
        to: email,
        subject: `Your week on LinkYaar: ${viewCount ?? 0} views, ${clickCount ?? 0} clicks`,
        html: emailTemplate({
          heading: 'Your week in numbers',
          body: `<p>Last 7 days on your page:</p>
            <p style="font-size:28px;font-weight:800;color:#2E1065;margin:8px 0;">
              ${(viewCount ?? 0).toLocaleString()} views · ${(clickCount ?? 0).toLocaleString()} clicks
            </p>
            <p>Keep sharing your link — every view is a person who found all of you at once.</p>`,
          ctaLabel: 'Open analytics',
          ctaUrl: `${siteConfig.url}/dashboard/analytics`,
        }),
      })
      if (ok) sent += 1
    } catch {
      // next profile
    }
  }

  return NextResponse.json({ ok: true, active: activeIds.length, sent })
}
