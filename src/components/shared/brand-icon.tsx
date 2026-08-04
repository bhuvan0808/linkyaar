// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { cn } from '@/lib/utils'

/**
 * Renders a 24×24 brand glyph from an SVG path string
 * (simple-icons data, or our own for brands they exclude).
 */
export function BrandIcon({
  path,
  title,
  className,
}: {
  path: string
  title?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('size-4', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={path} />
    </svg>
  )
}
