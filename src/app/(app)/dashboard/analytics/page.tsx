import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendChart } from '@/features/analytics/components/trend-chart'
import { createClient } from '@/lib/supabase/server'
import { getOwnProfile } from '@/services/profiles'

export const metadata: Metadata = { title: 'Analytics' }

function StatTile({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

export default async function AnalyticsPage() {
  const profile = await getOwnProfile()
  if (!profile?.username) redirect('/onboarding')

  const supabase = await createClient()
  const [dailyRes, topRes] = await Promise.all([
    supabase.rpc('analytics_daily', { p_days: 30 }),
    supabase.rpc('analytics_top_links', { p_days: 30 }),
  ])

  const daily = dailyRes.data ?? []
  const topLinks = (topRes.data ?? []).filter((l) => l.clicks > 0)

  const totalViews = daily.reduce((sum, d) => sum + d.views, 0)
  const totalClicks = daily.reduce((sum, d) => sum + d.clicks, 0)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'
  const maxTopClicks = Math.max(1, ...topLinks.map((l) => l.clicks))

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          The last 30 days on your page. Collected anonymously, owned by you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label="Profile views"
          value={totalViews.toLocaleString()}
          hint="People who opened your page"
        />
        <StatTile
          label="Link clicks"
          value={totalClicks.toLocaleString()}
          hint="Taps on any of your links"
        />
        <StatTile label="Click-through rate" value={`${ctr}%`} hint="Clicks per view" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily trend</CardTitle>
          <CardDescription>Views and clicks, day by day.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart data={daily} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top links</CardTitle>
          <CardDescription>Your most-clicked links this month.</CardDescription>
        </CardHeader>
        <CardContent>
          {topLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No clicks yet — share your page and watch this fill up.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {topLinks.map((link) => (
                <li key={link.link_id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium">{link.title}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {link.clicks.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="presentation"
                    >
                      <div
                        className="h-full rounded-full bg-[#7C3AED]"
                        style={{ width: `${(link.clicks / maxTopClicks) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
