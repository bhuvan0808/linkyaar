import { SiteFooter } from '@/features/marketing/components/site-footer'
import { SiteHeader } from '@/features/marketing/components/site-header'

/** Live star count keeps the open-source proof honest. Cached hourly. */
async function getGithubStars(): Promise<number | null> {
  try {
    const res = await fetch('https://api.github.com/repos/bhuvan0808/linkyaar', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    const repo = (await res.json()) as { stargazers_count?: number }
    return repo.stargazers_count ?? null
  } catch {
    return null
  }
}

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const stars = await getGithubStars()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader stars={stars} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
