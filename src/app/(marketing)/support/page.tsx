// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'

import { UpiSupport } from '@/features/marketing/components/upi-support'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Support LinkYaar',
  description:
    'LinkYaar is free and open source. Donations keep the servers running and the free AI pool growing.',
}

export default function SupportPage() {
  const upiId = process.env.NEXT_PUBLIC_SUPPORT_UPI
  const goddieUrl = process.env.NEXT_PUBLIC_SUPPORT_URL

  return (
    <div className="min-h-dvh bg-brand-cream">
      <div className="mx-auto max-w-3xl px-6 pt-36 pb-24 text-center">
        <p className="text-sm font-bold tracking-widest text-brand-red uppercase">
          Support LinkYaar
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.02] font-black tracking-tight text-balance text-brand-ink sm:text-6xl">
          Help keep every feature free.
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg font-medium text-brand-ink/70">
          LinkYaar has no paywalls, no watermark fees, and no locked analytics —
          everything Linktree charges for, we give away. Donations pay for servers, the
          domain, and a bigger free AI pool for everyone.
        </p>

        <div className="mx-auto mt-12 max-w-sm">
          {upiId ? (
            <UpiSupport upiId={upiId} />
          ) : (
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <p className="text-lg font-bold text-brand-ink">Donations open soon 💛</p>
              <p className="mt-2 text-sm font-medium text-brand-ink/60">
                Meanwhile, the best support is free: star us on GitHub and tell a creator
                friend.
              </p>
            </div>
          )}
        </div>

        {goddieUrl ? (
          <p className="mt-8 text-sm font-medium text-brand-ink/70">
            Prefer a checkout page?{' '}
            <a
              href={goddieUrl}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-brand-red underline underline-offset-4"
            >
              Support via Buy Me a Goddie →
            </a>
          </p>
        ) : null}

        <p className="mt-8 text-sm font-medium text-brand-ink/70">
          International donations, sponsorships, or investor conversations:{' '}
          <a
            href="mailto:help@linkyaar.com"
            className="font-bold text-brand-red underline underline-offset-4"
          >
            help@linkyaar.com
          </a>
        </p>

        <div className="mt-14 border-t border-brand-ink/10 pt-10">
          <p className="font-display text-xl font-black text-brand-ink">
            Can&apos;t donate? You can still help.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-sm font-bold">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-brand-ink transition-colors hover:bg-brand-ink/5"
            >
              ⭐ Star on GitHub
            </a>
            <a
              href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-brand-ink transition-colors hover:bg-brand-ink/5"
            >
              🛠️ Contribute code
            </a>
            <a
              href="https://twitter.com/intent/tweet?text=I%20use%20LinkYaar%20—%20a%20free%2C%20open-source%20Linktree%20alternative%20https%3A%2F%2Flinkyaar.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-brand-ink transition-colors hover:bg-brand-ink/5"
            >
              📣 Tell a friend
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
