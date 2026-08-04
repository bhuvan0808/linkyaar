// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Json } from '@/types/json'

export type ButtonVariant = 'filled' | 'outline' | 'glass' | 'soft' | 'gradient'
export type ButtonRadius = 'pill' | 'rounded' | 'square'
export type FontKey = 'sans' | 'display' | 'serif' | 'rounded' | 'mono' | 'elegant'

export const FONT_KEYS: readonly FontKey[] = [
  'sans',
  'display',
  'serif',
  'rounded',
  'mono',
  'elegant',
]

/** The contract stored in themes.tokens (jsonb). */
export interface ThemeTokens {
  mode: 'light' | 'dark'
  /** Any CSS background value — solid color or gradient. */
  background: string
  foreground: string
  muted: string
  accent: string
  buttonVariant: ButtonVariant
  buttonRadius: ButtonRadius
  font: FontKey
}

export const FALLBACK_TOKENS: ThemeTokens = {
  mode: 'dark',
  background: 'oklch(0.165 0.014 285)',
  foreground: 'oklch(0.955 0.006 85)',
  muted: 'oklch(0.68 0.015 286)',
  accent: 'oklch(0.64 0.21 293)',
  buttonVariant: 'glass',
  buttonRadius: 'rounded',
  font: 'sans',
}

const BUTTON_VARIANTS: readonly ButtonVariant[] = [
  'filled',
  'outline',
  'glass',
  'soft',
  'gradient',
]
const BUTTON_RADII: readonly ButtonRadius[] = ['pill', 'rounded', 'square']

/** Defensively parse a jsonb tokens value into a complete ThemeTokens. */
export function parseThemeTokens(raw: Json | null | undefined): ThemeTokens {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return FALLBACK_TOKENS
  const t = raw as Record<string, Json | undefined>
  const str = (v: Json | undefined, fallback: string) =>
    typeof v === 'string' && v.length > 0 ? v : fallback

  const variant = str(t.buttonVariant, FALLBACK_TOKENS.buttonVariant)
  const radius = str(t.buttonRadius, FALLBACK_TOKENS.buttonRadius)
  const font = str(t.font, FALLBACK_TOKENS.font)

  return {
    mode: t.mode === 'light' ? 'light' : 'dark',
    background: str(t.background, FALLBACK_TOKENS.background),
    foreground: str(t.foreground, FALLBACK_TOKENS.foreground),
    muted: str(t.muted, FALLBACK_TOKENS.muted),
    accent: str(t.accent, FALLBACK_TOKENS.accent),
    buttonVariant: BUTTON_VARIANTS.includes(variant as ButtonVariant)
      ? (variant as ButtonVariant)
      : FALLBACK_TOKENS.buttonVariant,
    buttonRadius: BUTTON_RADII.includes(radius as ButtonRadius)
      ? (radius as ButtonRadius)
      : FALLBACK_TOKENS.buttonRadius,
    font: FONT_KEYS.includes(font as FontKey) ? (font as FontKey) : 'sans',
  }
}

/**
 * Effective tokens = preset theme tokens overlaid with the profile's
 * custom overrides (Theme Studio edits win field-by-field).
 */
export function mergeThemeTokens(
  base: Json | null | undefined,
  custom: Json | null | undefined
): ThemeTokens {
  const b = base && typeof base === 'object' && !Array.isArray(base) ? base : {}
  const c = custom && typeof custom === 'object' && !Array.isArray(custom) ? custom : {}
  return parseThemeTokens({ ...(b as object), ...(c as object) } as Json)
}
