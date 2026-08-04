// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type ThemeTokens } from '@/features/themes/tokens'

const RADIUS: Record<ThemeTokens['buttonRadius'], string> = {
  pill: '9999px',
  rounded: '16px',
  square: '8px',
}

/** Inline style for a themed link button — shared by the public page
 * and the Theme Studio live preview so they can never drift apart. */
export function themedButtonStyle(tokens: ThemeTokens): React.CSSProperties {
  // Dark themes carry light accents (dark text on them); light themes
  // carry vivid/dark accents (white text on them).
  const onAccent = tokens.mode === 'dark' ? 'oklch(0.16 0.01 286)' : '#ffffff'
  const base: React.CSSProperties = { borderRadius: RADIUS[tokens.buttonRadius] }

  switch (tokens.buttonVariant) {
    case 'filled':
      return { ...base, background: tokens.accent, color: onAccent }
    case 'outline':
      return {
        ...base,
        background: 'transparent',
        color: tokens.foreground,
        border: `1.5px solid color-mix(in oklab, ${tokens.foreground} 35%, transparent)`,
      }
    case 'glass':
      return {
        ...base,
        background: `color-mix(in oklab, ${tokens.foreground} 9%, transparent)`,
        color: tokens.foreground,
        border: `1px solid color-mix(in oklab, ${tokens.foreground} 14%, transparent)`,
        backdropFilter: 'blur(12px)',
      }
    case 'soft':
      return {
        ...base,
        background: `color-mix(in oklab, ${tokens.accent} 16%, transparent)`,
        color: tokens.foreground,
      }
    case 'gradient':
      return {
        ...base,
        background: `linear-gradient(120deg, ${tokens.accent}, color-mix(in oklab, ${tokens.accent} 55%, ${tokens.foreground} 45%))`,
        color: onAccent,
      }
  }
}
