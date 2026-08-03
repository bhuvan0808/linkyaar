'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

export function ProfileForm({ profile }: { profile: Profile }) {
  const [saving, setSaving] = useState(false)

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
          <Input id="pf-pronouns" placeholder="she/her" {...form.register('pronouns')} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pf-headline">Headline</Label>
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
        <Label htmlFor="pf-bio">Bio</Label>
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
