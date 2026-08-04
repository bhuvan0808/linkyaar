// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { Cormorant_Garamond, Fraunces, IBM_Plex_Mono, Nunito } from 'next/font/google'

import { type FontKey } from '@/features/themes/tokens'

const fraunces = Fraunces({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'] })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '700'] })

/**
 * Theme font choices. `sans` and `display` reuse the app fonts
 * (Geist / Bricolage) already mounted on <body>; the rest load
 * their own subsets on demand.
 */
export const THEME_FONTS: Record<FontKey, { label: string; className: string }> = {
  sans: { label: 'Modern', className: 'font-sans' },
  display: { label: 'Bold', className: 'font-display' },
  serif: { label: 'Editorial', className: fraunces.className },
  rounded: { label: 'Friendly', className: nunito.className },
  mono: { label: 'Technical', className: plexMono.className },
  elegant: { label: 'Elegant', className: cormorant.className },
}
