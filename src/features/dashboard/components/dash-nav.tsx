'use client'

import { BarChart3, LayoutGrid, Palette, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const items = [
  { href: '/dashboard', label: 'Links', icon: LayoutGrid, exact: true },
  { href: '/dashboard/appearance', label: 'Appearance', icon: Palette, exact: false },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
]

export function DashNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        aria-label="Dashboard"
        className="sticky top-24 hidden h-fit w-48 shrink-0 flex-col gap-1 lg:flex"
      >
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-secondary text-secondary-foreground shadow-[var(--shadow-soft)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom bar */}
      <nav
        aria-label="Dashboard"
        className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-around rounded-2xl border border-border bg-card/90 py-2 shadow-[var(--shadow-float)] backdrop-blur-xl lg:hidden"
      >
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-[11px] font-medium transition-colors duration-200',
                active ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              <item.icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
