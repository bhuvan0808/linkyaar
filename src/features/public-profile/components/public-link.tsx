// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { themedButtonStyle } from '@/features/themes/button-style'
import { type ThemeTokens } from '@/features/themes/tokens'
import { type Link } from '@/types/database'

export function PublicLink({ link, tokens }: { link: Link; tokens: ThemeTokens }) {
  return (
    <a
      href={`/api/r/${link.id}`}
      target="_blank"
      rel="noopener"
      style={themedButtonStyle(tokens)}
      className={`group flex w-full items-center gap-3 px-5 py-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-[0_8px_28px_rgba(0,0,0,0.16)] active:scale-[0.99] ${
        link.is_featured ? 'ring-2 ring-current/20' : ''
      }`}
    >
      {link.emoji ? (
        <span className="text-lg" aria-hidden>
          {link.emoji}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] leading-snug font-semibold">
          {link.title}
        </span>
        {link.description ? (
          <span className="mt-0.5 block truncate text-[12.5px] leading-snug opacity-70">
            {link.description}
          </span>
        ) : null}
      </span>
      {link.emoji ? <span className="w-[1.125rem]" aria-hidden /> : null}
    </a>
  )
}
