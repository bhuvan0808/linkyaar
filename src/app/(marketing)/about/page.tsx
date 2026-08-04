// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import { siInstagram } from 'simple-icons'
import { siGithub } from 'simple-icons'

import { BrandIcon } from '@/components/shared/brand-icon'
import { ProsePage } from '@/features/marketing/components/prose-page'
import { PLATFORM_MAP } from '@/features/socials/platforms'
import { siteConfig } from '@/config/site'

const MAINTAINER_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/bhuvan0808', path: siGithub.path },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/bhuvanboddu/',
    path: PLATFORM_MAP.get('linkedin')!.path,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/buildwithbhuvan',
    path: siInstagram.path,
  },
]

export const metadata: Metadata = {
  title: 'About',
  description: 'Why LinkYaar exists and the principles it is built on.',
}

export default function AboutPage() {
  return (
    <ProsePage
      title="About LinkYaar"
      intro="Yaar means friend. LinkYaar is the friendly, open-source home for everything you are on the internet."
    >
      <h2>Why we built this</h2>
      <p>
        A creator&apos;s link-in-bio page is often the single most visited page they own —
        yet it usually lives on a closed platform that charges for basic features,
        watermarks the free tier, and holds the audience hostage. We think the front door
        to your internet life should belong to you.
      </p>

      <h2>Principles</h2>
      <ul>
        <li>
          <strong>Open source, AGPL-3.0.</strong> Read it, fork it, self-host it. Anyone
          who runs a modified version publicly must share their changes back — the
          community always benefits.
        </li>
        <li>
          <strong>Design is a feature.</strong> Every theme, easing curve, and pixel of
          spacing is deliberate. A free page should not look cheap.
        </li>
        <li>
          <strong>Privacy by default.</strong> No trackers, no cookies for visitors, no IP
          logging, analytics visible only to you.
        </li>
        <li>
          <strong>Own your exit.</strong> One-click JSON export and one-click account
          deletion, forever.
        </li>
      </ul>

      <h2 id="maintainer" className="scroll-mt-28">
        Meet the maintainer
      </h2>
      <div className="mt-2 rounded-[2rem] border border-brand-ink/10 bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)] sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-brand-ink font-display text-2xl font-black"
            style={{ color: '#F5EBD3' }}
            aria-hidden
          >
            BB
          </div>
          <div className="min-w-0">
            <p className="font-display text-2xl font-black tracking-tight text-brand-ink">
              Bhuvan Boddu
            </p>
            <p className="mt-0.5 text-sm font-bold tracking-wide text-brand-red uppercase">
              Founder · solo maintainer &amp; coder
            </p>
          </div>
        </div>
        <p className="mt-5 text-[15px] leading-relaxed font-medium text-brand-ink/70">
          LinkYaar is built and maintained by one person — every feature, every deploy,
          every support email. That means replies can take a day or two, but every single
          message gets read. Say hi, share feedback, or just follow along as this gets
          built in the open.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {MAINTAINER_SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-brand-ink px-5 py-2.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.04]"
              style={{ color: '#ffffff', textDecoration: 'none' }}
            >
              <BrandIcon path={s.path} className="size-4" />
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <h2>The project</h2>
      <p>
        LinkYaar is developed in the open at{' '}
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
          github.com/bhuvan0808/linkyaar
        </a>
        . The roadmap, changelog, and contribution guide live there too — issues and pull
        requests are welcome.
      </p>
    </ProsePage>
  )
}
