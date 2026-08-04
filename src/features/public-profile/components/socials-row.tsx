// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { BrandIcon } from '@/components/shared/brand-icon'
import { PLATFORM_MAP } from '@/features/socials/platforms'
import { type ThemeTokens } from '@/features/themes/tokens'
import { type SocialLink } from '@/types/database'

export function SocialsRow({
  socials,
  tokens,
}: {
  socials: SocialLink[]
  tokens: ThemeTokens
}) {
  if (socials.length === 0) return null

  return (
    <ul className="flex flex-wrap items-center justify-center gap-1.5">
      {socials.map((social) => {
        const def = PLATFORM_MAP.get(social.platform)
        if (!def) return null
        return (
          <li key={social.id}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener"
              aria-label={def.label}
              className="flex size-10 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-110"
              style={{
                color: tokens.foreground,
                background: `color-mix(in oklab, ${tokens.foreground} 8%, transparent)`,
              }}
            >
              <BrandIcon path={def.path} className="size-[18px]" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
