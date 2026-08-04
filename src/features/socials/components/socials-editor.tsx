// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { BrandIcon } from '@/components/shared/brand-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveSocials } from '@/features/profile/actions'
import { PLATFORMS, PLATFORM_MAP } from '@/features/socials/platforms'
import { type SocialLink } from '@/types/database'

interface Row {
  platform: string
  url: string
}

/**
 * All platforms visible as an icon grid — tap to add, fill the URL.
 * No hunting through dropdowns.
 */
export function SocialsEditor({ socials }: { socials: SocialLink[] }) {
  const [rows, setRows] = useState<Row[]>(
    socials.map((s) => ({ platform: s.platform, url: s.url }))
  )
  const [saving, setSaving] = useState(false)

  const active = new Set(rows.map((r) => r.platform))

  function toggle(platformKey: string) {
    if (active.has(platformKey)) {
      setRows(rows.filter((r) => r.platform !== platformKey))
    } else {
      setRows([...rows, { platform: platformKey, url: '' }])
    }
  }

  function setUrl(platformKey: string, url: string) {
    setRows(rows.map((r) => (r.platform === platformKey ? { ...r, url } : r)))
  }

  async function handleSave() {
    if (rows.some((r) => !r.url.trim())) {
      toast.error('Fill in every URL, or tap the icon again to remove it.')
      return
    }
    setSaving(true)
    const result = await saveSocials(rows)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else toast.success('Socials saved')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Platform grid — everything visible at once */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose platforms">
        {PLATFORMS.map((p) => {
          const on = active.has(p.key)
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => toggle(p.key)}
              aria-pressed={on}
              title={p.label}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all duration-150 hover:-translate-y-0.5 ${
                on
                  ? 'border-accent bg-accent text-accent-foreground shadow-[var(--shadow-soft)]'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <BrandIcon path={p.path} className="size-3.5" />
              {p.label}
            </button>
          )
        })}
      </div>

      {/* URL inputs for the selected platforms */}
      {rows.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {rows.map((row) => {
            const def = PLATFORM_MAP.get(row.platform)
            if (!def) return null
            return (
              <div key={row.platform} className="flex items-center gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <BrandIcon path={def.path} className="size-4" />
                </span>
                <Input
                  value={row.url}
                  onChange={(e) => setUrl(row.platform, e.target.value)}
                  placeholder={def.placeholder}
                  inputMode="url"
                  aria-label={`${def.label} URL`}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggle(row.platform)}
                  aria-label={`Remove ${def.label}`}
                >
                  <X className="size-4 text-muted-foreground" aria-hidden />
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Tap the platforms where people can find you — then paste your links.
        </p>
      )}

      <Button
        size="sm"
        onClick={handleSave}
        disabled={saving}
        className="self-start rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {saving && <Loader2 className="animate-spin" aria-hidden />}
        Save socials
      </Button>
    </div>
  )
}
