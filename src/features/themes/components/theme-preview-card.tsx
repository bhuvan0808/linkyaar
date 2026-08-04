// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { themedButtonStyle } from '@/features/themes/button-style'
import { THEME_FONTS } from '@/features/themes/fonts'
import { type ThemeTokens } from '@/features/themes/tokens'

interface PreviewProps {
  tokens: ThemeTokens
  headerLayout: 'classic' | 'portrait' | 'minimal'
  name: string
  headline?: string | null
  avatarUrl?: string | null
  linkTitles: string[]
}

/** Instant, client-side preview of the public page — no iframe lag. */
export function ThemePreviewCard({
  tokens,
  headerLayout,
  name,
  headline,
  avatarUrl,
  linkTitles,
}: PreviewProps) {
  const font = THEME_FONTS[tokens.font]?.className ?? 'font-sans'

  return (
    <div
      className={`flex h-[540px] w-full flex-col items-center overflow-hidden rounded-[2.2rem] px-5 py-8 shadow-inner ${font}`}
      style={{ background: tokens.background, color: tokens.foreground }}
      aria-label="Live preview of your page"
    >
      {headerLayout !== 'minimal' &&
        (avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage host
          <img
            src={avatarUrl}
            alt=""
            className={
              headerLayout === 'portrait'
                ? 'h-28 w-24 rounded-2xl object-cover shadow-lg'
                : 'size-16 rounded-full object-cover shadow-lg'
            }
          />
        ) : (
          <div
            className={`flex items-center justify-center text-xl font-bold shadow-lg ${
              headerLayout === 'portrait'
                ? 'h-28 w-24 rounded-2xl'
                : 'size-16 rounded-full'
            }`}
            style={{
              background: `color-mix(in oklab, ${tokens.accent} 25%, transparent)`,
            }}
            aria-hidden
          >
            {name.slice(0, 2)}
          </div>
        ))}

      <p className="mt-3 max-w-full truncate text-lg font-bold">{name}</p>
      {headline ? (
        <p
          className="mt-1 line-clamp-2 max-w-full text-center text-xs"
          style={{ color: tokens.muted }}
        >
          {headline}
        </p>
      ) : null}

      <div className="mt-5 flex w-full flex-col gap-2.5">
        {(linkTitles.length > 0
          ? linkTitles
          : ['My latest project', 'Newsletter', 'Say hi']
        ).map((title) => (
          <div
            key={title}
            style={themedButtonStyle(tokens)}
            className="w-full truncate px-4 py-3 text-center text-[13px] font-semibold"
          >
            {title}
          </div>
        ))}
      </div>

      <p className="mt-auto pt-4 text-[10px] tracking-wide opacity-50">
        linkyaar.com/you
      </p>
    </div>
  )
}
