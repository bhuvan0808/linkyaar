import { SiteFooter } from '@/features/marketing/components/site-footer'
import { SiteHeader } from '@/features/marketing/components/site-header'

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
