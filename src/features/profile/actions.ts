// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

type ActionResult = { error?: string }

const profileSchema = z.object({
  display_name: z.string().trim().max(60, 'Max 60 characters').optional(),
  headline: z.string().trim().max(100, 'Max 100 characters').optional(),
  bio: z.string().trim().max(300, 'Max 300 characters').optional(),
  occupation: z.string().trim().max(60).optional(),
  location: z.string().trim().max(60).optional(),
  pronouns: z.string().trim().max(30).optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  return { supabase, user }
}

export async function updateProfile(raw: ProfileFormValues): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { supabase, user } = await requireUser()
  const v = parsed.data
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: v.display_name || null,
      headline: v.headline || null,
      bio: v.bio || null,
      occupation: v.occupation || null,
      location: v.location || null,
      pronouns: v.pronouns || null,
    })
    .eq('id', user.id)

  if (error) return { error: 'Could not save your profile.' }
  revalidatePath('/dashboard')
  return {}
}

export async function setAvatarUrl(url: string): Promise<ActionResult> {
  const parsed = z.url().safeParse(url)
  if (!parsed.success) return { error: 'Invalid avatar URL.' }

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: parsed.data })
    .eq('id', user.id)

  if (error) return { error: 'Could not update your photo.' }
  revalidatePath('/dashboard')
  return {}
}

export async function setTheme(themeId: string): Promise<ActionResult> {
  const parsed = z.uuid().safeParse(themeId)
  if (!parsed.success) return { error: 'Invalid theme.' }

  const { supabase, user } = await requireUser()
  // Picking a preset clears Studio overrides — the preset is the truth.
  const { error } = await supabase
    .from('profiles')
    .update({ theme_id: parsed.data, custom_theme: null })
    .eq('id', user.id)

  if (error) return { error: 'Could not apply the theme.' }
  revalidatePath('/dashboard')
  return {}
}

const customThemeSchema = z
  .object({
    mode: z.enum(['light', 'dark']).optional(),
    background: z.string().max(600).optional(),
    foreground: z.string().max(100).optional(),
    muted: z.string().max(100).optional(),
    accent: z.string().max(100).optional(),
    buttonVariant: z.enum(['filled', 'outline', 'glass', 'soft', 'gradient']).optional(),
    buttonRadius: z.enum(['pill', 'rounded', 'square']).optional(),
    font: z.enum(['sans', 'display', 'serif', 'rounded', 'mono', 'elegant']).optional(),
  })
  .strict()

export type CustomThemeInput = z.infer<typeof customThemeSchema>

export async function saveCustomTheme(raw: CustomThemeInput): Promise<ActionResult> {
  const parsed = customThemeSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid theme settings.' }

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('profiles')
    .update({ custom_theme: parsed.data })
    .eq('id', user.id)

  if (error) return { error: 'Could not save your custom theme.' }
  revalidatePath('/dashboard')
  return {}
}

export async function setHeaderLayout(
  layout: 'classic' | 'portrait' | 'minimal'
): Promise<ActionResult> {
  const parsed = z.enum(['classic', 'portrait', 'minimal']).safeParse(layout)
  if (!parsed.success) return { error: 'Invalid layout.' }

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('profiles')
    .update({ header_layout: parsed.data })
    .eq('id', user.id)

  if (error) return { error: 'Could not save the layout.' }
  revalidatePath('/dashboard')
  return {}
}

export async function setProfileVisibility(isPublic: boolean): Promise<ActionResult> {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('profiles')
    .update({ is_public: isPublic })
    .eq('id', user.id)

  if (error) return { error: 'Could not update visibility.' }
  revalidatePath('/dashboard')
  return {}
}

const socialItemSchema = z.object({
  platform: z.string().min(1),
  url: z.string().trim().min(1, 'URL required').max(500),
})

export async function saveSocials(
  items: { platform: string; url: string }[]
): Promise<ActionResult> {
  const parsed = z.array(socialItemSchema).max(20).safeParse(items)
  if (!parsed.success) return { error: 'Check your social links.' }

  const { supabase, user } = await requireUser()

  const keep = parsed.data.map((s) => s.platform)

  // Remove platforms no longer present
  let removal = supabase.from('social_links').delete().eq('profile_id', user.id)
  if (keep.length > 0) {
    removal = removal.not('platform', 'in', `(${keep.join(',')})`)
  }
  const { error: deleteError } = await removal
  if (deleteError) return { error: 'Could not save socials.' }

  if (parsed.data.length > 0) {
    const { error } = await supabase.from('social_links').upsert(
      parsed.data.map((s, i) => ({
        profile_id: user.id,
        platform: s.platform,
        url: s.url,
        position: i,
      })),
      { onConflict: 'profile_id,platform' }
    )
    if (error) return { error: 'Could not save socials.' }
  }

  revalidatePath('/dashboard')
  return {}
}
