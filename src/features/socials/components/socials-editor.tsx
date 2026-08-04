// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { BrandIcon } from '@/components/shared/brand-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { saveSocials } from '@/features/profile/actions'
import { PLATFORMS, PLATFORM_MAP } from '@/features/socials/platforms'
import { type SocialLink } from '@/types/database'

interface Row {
  platform: string
  url: string
}

export function SocialsEditor({ socials }: { socials: SocialLink[] }) {
  const [rows, setRows] = useState<Row[]>(
    socials.map((s) => ({ platform: s.platform, url: s.url }))
  )
  const [saving, setSaving] = useState(false)

  const usedPlatforms = new Set(rows.map((r) => r.platform))
  const available = PLATFORMS.filter((p) => !usedPlatforms.has(p.key))

  function addRow() {
    const first = available[0]
    if (!first) return
    setRows([...rows, { platform: first.key, url: '' }])
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function removeRow(index: number) {
    setRows(rows.filter((_, i) => i !== index))
  }

  async function handleSave() {
    const incomplete = rows.some((r) => !r.url.trim())
    if (incomplete) {
      toast.error('Fill in every URL or remove the empty rows.')
      return
    }
    setSaving(true)
    const result = await saveSocials(rows)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else toast.success('Socials saved')
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No socials yet — add the places people can find you.
        </p>
      )}

      {rows.map((row, index) => {
        const def = PLATFORM_MAP.get(row.platform)
        return (
          <div key={row.platform} className="flex items-center gap-2">
            <Select
              value={row.platform}
              onValueChange={(v) => updateRow(index, { platform: v })}
            >
              <SelectTrigger
                className="w-40 shrink-0"
                aria-label={`Platform for row ${index + 1}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.filter(
                  (p) => p.key === row.platform || !usedPlatforms.has(p.key)
                ).map((p) => (
                  <SelectItem key={p.key} value={p.key}>
                    <span className="flex items-center gap-2">
                      <BrandIcon path={p.path} className="size-3.5" />
                      {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={row.url}
              onChange={(e) => updateRow(index, { url: e.target.value })}
              placeholder={def?.placeholder ?? 'https://…'}
              inputMode="url"
              aria-label={`${def?.label ?? row.platform} URL`}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeRow(index)}
              aria-label={`Remove ${def?.label ?? row.platform}`}
            >
              <Trash2 className="size-4 text-muted-foreground" aria-hidden />
            </Button>
          </div>
        )
      })}

      <div className="mt-1 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          disabled={available.length === 0}
          className="rounded-xl"
        >
          <Plus aria-hidden /> Add social
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {saving && <Loader2 className="animate-spin" aria-hidden />}
          Save socials
        </Button>
      </div>
    </div>
  )
}
