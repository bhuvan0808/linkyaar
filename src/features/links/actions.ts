'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { linkSchema, type LinkFormValues } from '@/features/links/schema'

type ActionResult = { error?: string }

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  return { supabase, user }
}

function toTimestamps(values: LinkFormValues) {
  return {
    title: values.title,
    url: values.url,
    description: values.description || null,
    emoji: values.emoji || null,
    is_featured: values.is_featured,
    starts_at: values.starts_at ? new Date(values.starts_at).toISOString() : null,
    ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
  }
}

export async function createLink(raw: LinkFormValues): Promise<ActionResult> {
  const parsed = linkSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { supabase, user } = await requireUser()

  const { data: last } = await supabase
    .from('links')
    .select('position')
    .eq('profile_id', user.id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('links').insert({
    profile_id: user.id,
    position: (last?.position ?? -1) + 1,
    ...toTimestamps(parsed.data),
  })

  if (error) return { error: 'Could not add the link. Try again.' }
  revalidatePath('/dashboard')
  return {}
}

export async function updateLink(id: string, raw: LinkFormValues): Promise<ActionResult> {
  const parsed = linkSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('links')
    .update(toTimestamps(parsed.data))
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: 'Could not save changes.' }
  revalidatePath('/dashboard')
  return {}
}

export async function toggleLink(id: string, enabled: boolean): Promise<ActionResult> {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('links')
    .update({ is_enabled: enabled })
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: 'Could not update the link.' }
  revalidatePath('/dashboard')
  return {}
}

export async function deleteLink(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: 'Could not delete the link.' }
  revalidatePath('/dashboard')
  return {}
}

export async function duplicateLink(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser()

  const { data: source } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .eq('profile_id', user.id)
    .maybeSingle()
  if (!source) return { error: 'Link not found.' }

  const { data: last } = await supabase
    .from('links')
    .select('position')
    .eq('profile_id', user.id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('links').insert({
    profile_id: user.id,
    title: `${source.title} (copy)`,
    url: source.url,
    description: source.description,
    emoji: source.emoji,
    is_enabled: source.is_enabled,
    is_featured: false,
    position: (last?.position ?? -1) + 1,
  })

  if (error) return { error: 'Could not duplicate the link.' }
  revalidatePath('/dashboard')
  return {}
}

export async function reorderLinks(orderedIds: string[]): Promise<ActionResult> {
  const { supabase, user } = await requireUser()

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from('links')
        .update({ position: index })
        .eq('id', id)
        .eq('profile_id', user.id)
    )
  )

  if (results.some((r) => r.error)) return { error: 'Could not save the new order.' }
  revalidatePath('/dashboard')
  return {}
}
