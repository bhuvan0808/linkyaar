import Link from 'next/link'

import { siteConfig } from '@/config/site'

const columns: {
  heading: string
  links: { label: string; href: string; external?: boolean }[]
}[] = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      {
        label: 'Roadmap',
        href: `${siteConfig.links.github}/blob/main/ROADMAP.md`,
        external: true,
      },
      {
        label: "What's new",
        href: `${siteConfig.links.github}/blob/main/CHANGELOG.md`,
        external: true,
      },
      { label: 'GitHub', href: siteConfig.links.github, external: true },
    ],
  },
  {
    heading: 'Community',
    links: [
      {
        label: 'Discussions',
        href: `${siteConfig.links.github}/discussions`,
        external: true,
      },
      {
        label: 'Contribute',
        href: `${siteConfig.links.github}/blob/main/CONTRIBUTING.md`,
        external: true,
      },
      {
        label: 'Code of Conduct',
        href: `${siteConfig.links.github}/blob/main/CODE_OF_CONDUCT.md`,
        external: true,
      },
      {
        label: 'Report a violation',
        href: `${siteConfig.links.github}/issues/new/choose`,
        external: true,
      },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help & FAQs', href: '/help' },
      { label: 'Getting started', href: '/help' },
      {
        label: 'Report a bug',
        href: `${siteConfig.links.github}/issues`,
        external: true,
      },
      {
        label: 'Security policy',
        href: `${siteConfig.links.github}/blob/main/SECURITY.md`,
        external: true,
      },
    ],
  },
  {
    heading: 'Trust & Legal',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Notice', href: '/privacy' },
      { label: 'Cookie Notice', href: '/cookies' },
      {
        label: 'License (MIT)',
        href: `${siteConfig.links.github}/blob/main/LICENSE`,
        external: true,
      },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2" aria-label="LinkYaar home">
              {/* eslint-disable-next-line @next/next/no-img-element -- 28px brand glyph */}
              <img
                src="/brand/glyph.png"
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-lg"
              />
              <span className="text-[17px] font-semibold tracking-tight">
                Link<span className="text-accent">Yaar</span>
              </span>
            </Link>
            <p className="mt-3 max-w-45 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-sm font-semibold">{column.heading}</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.links.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 LinkYaar contributors · MIT licensed · open source forever</p>
          <Link
            href="/login?mode=signup"
            className="font-medium transition-colors duration-200 hover:text-foreground"
          >
            Create your LinkYaar →
          </Link>
        </div>
      </div>
    </footer>
  )
}
