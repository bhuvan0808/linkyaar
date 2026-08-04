// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { aiWrite } from '@/features/ai/actions'
import { LIMIT_PREFIX } from '@/features/ai/shared'
import { updateProfile, type ProfileFormValues } from '@/features/profile/actions'
import { type Profile } from '@/types/database'

const formSchema = z.object({
  display_name: z.string().trim().max(60, 'Max 60 characters').optional(),
  headline: z.string().trim().max(100, 'Max 100 characters').optional(),
  bio: z.string().trim().max(300, 'Max 300 characters').optional(),
  occupation: z.string().trim().max(60, 'Max 60 characters').optional(),
  location: z.string().trim().max(60, 'Max 60 characters').optional(),
  pronouns: z.string().trim().max(30, 'Max 30 characters').optional(),
})

const PRONOUN_PRESETS = [
  'she/her',
  'he/him',
  'they/them',
  'she/they',
  'he/they',
  'prefer not to say',
]

export function ProfileForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false)
  const [aiBusy, setAiBusy] = useState<'bio' | 'headline' | null>(null)
  const [pronounSel, setPronounSel] = useState<string>(() => {
    if (!profile.pronouns) return 'none'
    return PRONOUN_PRESETS.includes(profile.pronouns) ? profile.pronouns : 'custom'
  })

  function handleAiError(message: string) {
    if (message.startsWith(LIMIT_PREFIX)) {
      toast.error(message.slice(LIMIT_PREFIX.length), {
        description:
          'LinkYaar runs on free infrastructure — you can keep writing manually below, or help us grow the free AI pool.',
        duration: 9000,
        action: {
          label: 'Support us 💛',
          onClick: () => window.open('/support', '_blank'),
        },
      })
    } else {
      toast.error(message)
    }
  }

  async function runAi(kind: 'bio' | 'headline') {
    // The AI needs at least a hint about who this person is.
    const hasContext = Boolean(
      form.getValues('occupation')?.trim() ||
      form.getValues('headline')?.trim() ||
      form.getValues('bio')?.trim()
    )
    if (!hasContext) {
      toast.info('Give the AI something to work with first', {
        description:
          'Fill in your occupation, or type a few rough words in the bio or headline (e.g. "travel vlogger, budget trips, India") — then hit Write with AI.',
        duration: 8000,
      })
      return
    }
    setAiBusy(kind)
    const result = await aiWrite({
      kind,
      name: form.getValues('display_name'),
      occupation: form.getValues('occupation'),
      vibe:
        kind === 'bio'
          ? form.getValues('headline') || form.getValues('bio')
          : form.getValues('bio') || form.getValues('headline'),
    })
    setAiBusy(null)
    if (result.error) handleAiError(result.error)
    else if (result.text) {
      form.setValue(kind, result.text, { shouldDirty: true })
      toast.success(
        `${kind === 'bio' ? 'Bio' : 'Headline'} drafted — edit to taste (10 AI drafts/day)`
      )
    }
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      display_name: profile.display_name ?? '',
      headline: profile.headline ?? '',
      bio: profile.bio ?? '',
      occupation: profile.occupation ?? '',
      location: profile.location ?? '',
      pronouns: profile.pronouns ?? '',
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    setSaving(true)
    const result = await updateProfile(values)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else toast.success('Profile saved')
  }

  const errors = form.formState.errors

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pf-name">Display name</Label>
          <Input
            id="pf-name"
            placeholder="Maya Draws"
            {...form.register('display_name')}
          />
          {errors.display_name && (
            <p className="text-xs text-destructive">{errors.display_name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pf-pronouns">Pronouns</Label>
          <Select
            value={pronounSel}
            onValueChange={(v) => {
              setPronounSel(v)
              if (v === 'custom' || v === 'none') {
                form.setValue('pronouns', '', { shouldDirty: true })
              } else {
                form.setValue('pronouns', v, { shouldDirty: true })
              }
            }}
          >
            <SelectTrigger id="pf-pronouns" className="w-full">
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not shown</SelectItem>
              {PRONOUN_PRESETS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
              <SelectItem value="custom">Write custom…</SelectItem>
            </SelectContent>
          </Select>
          {pronounSel === 'custom' && (
            <Input
              placeholder="your pronouns"
              maxLength={30}
              {...form.register('pronouns')}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pf-headline">Headline</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={aiBusy !== null}
            className="h-7 gap-1.5 px-2 text-xs font-semibold text-accent"
            onClick={() => runAi('headline')}
          >
            {aiBusy === 'headline' ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-3.5" aria-hidden />
            )}
            Write with AI
          </Button>
        </div>
        <Input
          id="pf-headline"
          placeholder="Illustrator · 200k friends on the internet"
          {...form.register('headline')}
        />
        {errors.headline && (
          <p className="text-xs text-destructive">{errors.headline.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pf-bio">Bio</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={aiBusy !== null}
            className="h-7 gap-1.5 px-2 text-xs font-semibold text-accent"
            onClick={() => runAi('bio')}
          >
            {aiBusy === 'bio' ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="size-3.5" aria-hidden />
            )}
            Write with AI
          </Button>
        </div>
        <Textarea
          id="pf-bio"
          rows={3}
          placeholder="A few lines about you and your work"
          {...form.register('bio')}
        />
        {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pf-occupation">Occupation</Label>
          <Input
            id="pf-occupation"
            placeholder="Illustrator"
            {...form.register('occupation')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pf-location">Location</Label>
          <Input
            id="pf-location"
            placeholder="Hyderabad, IN"
            {...form.register('location')}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="mt-1 h-11 self-start rounded-xl bg-accent px-6 text-accent-foreground hover:bg-accent/90"
      >
        {saving && <Loader2 className="animate-spin" aria-hidden />}
        Save profile
      </Button>
    </form>
  )
}
