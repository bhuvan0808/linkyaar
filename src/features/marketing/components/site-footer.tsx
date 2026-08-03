import Link from 'next/link'

import { siteConfig } from '@/config/site'

const footerLinks = [
  { label: 'GitHub', href: siteConfig.links.github, external: true },
  {
    label: 'Roadmap',
    href: `${siteConfig.links.github}/blob/main/ROADMAP.md`,
    external: true,
  },
  { label: 'Log in', href: '/login', external: false },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-[15px] font-semibold tracking-tight">
            Link<span className="text-accent">Yaar</span>
          </p>
          <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-6">
          {footerLinks.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <p className="text-xs text-muted-foreground">
          MIT licensed · open source forever
        </p>
      </div>
    </footer>
  )
}
