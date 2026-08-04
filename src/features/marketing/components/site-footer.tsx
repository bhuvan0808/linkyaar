// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

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
      { label: 'Meet the maintainer 👋', href: '/about#maintainer' },
      { label: 'Roadmap', href: '/roadmap' },
      { label: "What's new", href: '/changelog' },
      { label: 'Support us 💛', href: '/support' },
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
      { label: 'Contribute', href: '/contribute' },
      { label: 'Code of Conduct', href: '/conduct' },
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
      { label: 'Security', href: '/security' },
    ],
  },
  {
    heading: 'Trust & Legal',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Notice', href: '/privacy' },
      { label: 'Cookie Notice', href: '/cookies' },
      { label: 'License (AGPL-3.0)', href: '/license' },
    ],
  },
  {
    heading: 'Our products',
    links: [
      { label: 'LinkYaar', href: '/' },
      {
        label: 'Buy Me a Goddie',
        href: 'https://goddie.linkyaar.com',
        external: true,
      },
      { label: 'More coming soon ✨', href: '/support' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <div className="mb-14">
          <div className="flex items-center gap-2.5">
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
          <p className="mt-3 max-w-md text-[15px] font-medium text-white/60">
            LinkYaar is a free, open-source link-in-bio platform: one page for all your
            links, socials, and work, with private analytics and an audience that belongs
            to you.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
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

        {/* Community build-with-us band */}
        <div className="mt-16 flex flex-col items-start gap-4 rounded-3xl bg-white/5 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-black tracking-tight text-white">
              We build free, open-source products with the community.
            </p>
            <p className="mt-1.5 text-sm font-medium text-white/55">
              Got a product idea? Let&apos;s build it together and give it to everyone —
              that&apos;s the whole point.
            </p>
          </div>
          <a
            href="mailto:ideas@linkyaar.com?subject=Product%20idea%20for%20the%20LinkYaar%20community"
            className="shrink-0 rounded-full bg-brand-cream px-6 py-3 text-sm font-bold text-brand-ink transition-transform duration-200 hover:scale-[1.03]"
          >
            💡 Build it with us
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-sm font-medium text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LinkYaar contributors · AGPL-3.0 licensed · open source forever</p>
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
