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

function BreakdownCard({
  title,
  rows,
  empty,
}: {
  title: string
  rows: { label: string; count: number }[]
  empty: string
}) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {rows.map((row) => (
              <li key={row.label}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">{row.label}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {row.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[#7C3AED]"
                    style={{ width: `${(row.count / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

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
  const [dailyRes, topRes, breakdownRes] = await Promise.all([
    supabase.rpc('analytics_daily', { p_days: 30 }),
    supabase.rpc('analytics_top_links', { p_days: 30 }),
    supabase.rpc('analytics_breakdown', { p_days: 30 }),
  ])

  const daily = dailyRes.data ?? []
  const topLinks = (topRes.data ?? []).filter((l) => l.clicks > 0)
  const breakdown = breakdownRes.data ?? []
  const countries = breakdown.filter((b) => b.kind === 'country' && b.count > 0)
  const sources = breakdown.filter((b) => b.kind === 'source' && b.count > 0)
  const devices = breakdown.filter((b) => b.kind === 'device' && b.count > 0)

  const totalViews = daily.reduce((sum, d) => sum + d.views, 0)
  const totalClicks = daily.reduce((sum, d) => sum + d.clicks, 0)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0'
  const maxTopClicks = Math.max(1, ...topLinks.map((l) => l.clicks))

  // Linktree-style plain-language insight from the top of each breakdown.
  const topCountry = countries[0]?.label
  const topSource = sources[0]?.label
  const topDevice = devices[0]?.label
  const insight =
    totalViews > 0 && topCountry
      ? `Most of your visitors are in ${topCountry}${
          topSource && topSource !== 'Direct'
            ? `, find you via ${topSource}`
            : ', arrive directly'
        }${topDevice ? `, on ${topDevice} devices` : ''}.`
      : null

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

      {insight && (
        <div className="rounded-2xl bg-secondary/60 px-5 py-4 text-[15px] text-secondary-foreground">
          💡 {insight}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daily trend</CardTitle>
          <CardDescription>Views and clicks, day by day.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendChart data={daily} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownCard
          title="Top countries"
          rows={countries.map((c) => ({ label: c.label, count: c.count }))}
          empty="Country data appears as visits come in."
        />
        <BreakdownCard
          title="Traffic sources"
          rows={sources.map((s) => ({ label: s.label, count: s.count }))}
          empty="Sources appear when visitors arrive via other sites."
        />
        <BreakdownCard
          title="Devices"
          rows={devices.map((d) => ({
            label: d.label.charAt(0).toUpperCase() + d.label.slice(1),
            count: d.count,
          }))}
          empty="Device data appears as visits come in."
        />
      </div>

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
