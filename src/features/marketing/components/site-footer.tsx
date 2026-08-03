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
    <footer className="bg-brand-ink">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="mb-14 flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- small brand glyph */}
          <img
            src="/brand/glyph-white.png"
            alt=""
            width={30}
            height={30}
            className="h-7.5 w-auto"
          />
          <span className="font-display text-2xl font-black tracking-tight text-white">
            LinkYaar
          </span>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="text-sm font-bold text-white">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((item) => (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[15px] font-medium text-white/55 transition-colors duration-200 hover:text-white"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-[15px] font-medium text-white/55 transition-colors duration-200 hover:text-white"
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

        <div className="mt-16 flex flex-col gap-3 text-sm font-medium text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LinkYaar contributors · MIT licensed · open source forever</p>
          <Link
            href="/login?mode=signup"
            className="transition-colors duration-200 hover:text-white"
          >
            Create your LinkYaar →
          </Link>
        </div>

        {/* Giant wordmark */}
        <p
          className="mt-12 -mb-4 text-center font-display text-[19vw] leading-[0.8] font-black tracking-tight text-white/10 select-none sm:text-[13rem]"
          aria-hidden
        >
          LinkYaar
        </p>
      </div>
    </footer>
  )
}
