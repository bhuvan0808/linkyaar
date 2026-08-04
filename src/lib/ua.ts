// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

/**
 * Tiny user-agent classifier for analytics breakdowns.
 * Intentionally coarse — we group, we don't fingerprint.
 */
export interface UaInfo {
  device: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
}

export function parseUserAgent(ua: string | null): UaInfo {
  const s = ua ?? ''

  const device: UaInfo['device'] = /iPad|Tablet|PlayBook|Silk/i.test(s)
    ? 'tablet'
    : /Mobi|iPhone|Android.*Mobile|Windows Phone/i.test(s)
      ? 'mobile'
      : 'desktop'

  const browser = /Edg\//.test(s)
    ? 'Edge'
    : /OPR\/|Opera/.test(s)
      ? 'Opera'
      : /SamsungBrowser/.test(s)
        ? 'Samsung Internet'
        : /Firefox\//.test(s)
          ? 'Firefox'
          : /Chrome\/|CriOS\//.test(s)
            ? 'Chrome'
            : /Safari\//.test(s)
              ? 'Safari'
              : 'Other'

  const os = /Windows/.test(s)
    ? 'Windows'
    : /iPhone|iPad|iPod/.test(s)
      ? 'iOS'
      : /Android/.test(s)
        ? 'Android'
        : /Mac OS X|Macintosh/.test(s)
          ? 'macOS'
          : /Linux/.test(s)
            ? 'Linux'
            : 'Other'

  return { device, browser, os }
}
