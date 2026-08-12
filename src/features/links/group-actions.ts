// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

type ActionResult = { error?: string }

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  return { supabase, user }
}

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Give the category a name')
  .max(60, 'Max 60 characters')

export async function createGroup(rawTitle: string): Promise<ActionResult> {
  const parsed = titleSchema.safeParse(rawTitle)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { supabase, user } = await requireUser()
  const { data: last } = await supabase
    .from('link_groups')
    .select('position')
    .eq('profile_id', user.id)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { error } = await supabase.from('link_groups').insert({
    profile_id: user.id,
    title: parsed.data,
    position: (last?.position ?? -1) + 1,
  })
  if (error) return { error: 'Could not create the category.' }
  revalidatePath('/dashboard')
  return {}
}

export async function renameGroup(id: string, rawTitle: string): Promise<ActionResult> {
  const parsed = titleSchema.safeParse(rawTitle)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('link_groups')
    .update({ title: parsed.data })
    .eq('id', id)
    .eq('profile_id', user.id)
  if (error) return { error: 'Could not rename the category.' }
  revalidatePath('/dashboard')
  return {}
}

export async function deleteGroup(id: string): Promise<ActionResult> {
  // Links are ungrouped (group_id → null via FK), not deleted.
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('link_groups')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)
  if (error) return { error: 'Could not delete the category.' }
  revalidatePath('/dashboard')
  return {}
}

export async function reorderGroups(orderedIds: string[]): Promise<ActionResult> {
  const { supabase, user } = await requireUser()
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from('link_groups')
        .update({ position: index })
        .eq('id', id)
        .eq('profile_id', user.id)
    )
  )
  if (results.some((r) => r.error)) return { error: 'Could not save the new order.' }
  revalidatePath('/dashboard')
  return {}
}

/** Move a link into a group (or ungroup with null), placing it last. */
export async function moveLinkToGroup(
  linkId: string,
  groupId: string | null
): Promise<ActionResult> {
  const { supabase, user } = await requireUser()

  let posQuery = supabase
    .from('links')
    .select('position')
    .eq('profile_id', user.id)
    .order('position', { ascending: false })
    .limit(1)
  posQuery =
    groupId === null ? posQuery.is('group_id', null) : posQuery.eq('group_id', groupId)
  const { data: last } = await posQuery.maybeSingle()

  const { error } = await supabase
    .from('links')
    .update({ group_id: groupId, position: (last?.position ?? -1) + 1 })
    .eq('id', linkId)
    .eq('profile_id', user.id)
  if (error) return { error: 'Could not move the link.' }
  revalidatePath('/dashboard')
  return {}
}
