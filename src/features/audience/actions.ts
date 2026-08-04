'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { z } from 'zod'

import { notifyNewReview, notifyNewSubscriber } from '@/features/notifications/send'
import { createAnonClient } from '@/lib/supabase/anon'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { error?: string }

/* ─── Public (visitor) actions ─────────────────────────────── */

const subscribeSchema = z.object({
  profileId: z.uuid(),
  email: z.email('Enter a valid email'),
  /** Honeypot — real people never fill this. */
  website: z.string().max(0).optional(),
})

export async function subscribe(input: {
  profileId: string
  email: string
  website?: string
}): Promise<ActionResult> {
  const parsed = subscribeSchema.safeParse(input)
  if (!parsed.success) {
    // Silently accept honeypot hits so bots learn nothing.
    if (input.website) return {}
    return { error: parsed.error.issues[0]?.message }
  }

  const supabase = createAnonClient()
  const { error } = await supabase.from('contacts').insert({
    profile_id: parsed.data.profileId,
    email: parsed.data.email,
    source: 'subscribe',
  })

  // Duplicate subscription is a success from the visitor's view.
  if (error && error.code !== '23505') {
    return { error: 'Could not subscribe right now. Try again.' }
  }
  if (!error) {
    const { profileId, email } = parsed.data
    after(() => notifyNewSubscriber(profileId, email))
  }
  return {}
}

const reviewSchema = z.object({
  profileId: z.uuid(),
  authorName: z.string().trim().min(1, 'Add your name').max(60, 'Max 60 characters'),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(280, 'Max 280 characters').optional(),
  website: z.string().max(0).optional(),
})

export async function submitReview(input: {
  profileId: string
  authorName: string
  rating: number
  body?: string
  website?: string
}): Promise<ActionResult> {
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    if (input.website) return {}
    return { error: parsed.error.issues[0]?.message }
  }

  const supabase = createAnonClient()
  const { error } = await supabase.from('reviews').insert({
    profile_id: parsed.data.profileId,
    author_name: parsed.data.authorName,
    rating: parsed.data.rating,
    body: parsed.data.body || null,
  })

  if (error) return { error: 'Could not send your review. Try again.' }

  const { profileId, authorName, rating, body } = parsed.data
  after(() => notifyNewReview(profileId, { authorName, rating, body }))
  return {}
}

/* ─── Owner actions ────────────────────────────────────────── */

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')
  return { supabase, user }
}

export async function setAudienceToggles(input: {
  subscribe_enabled: boolean
  reviews_enabled: boolean
}): Promise<ActionResult> {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('profiles')
    .update({
      subscribe_enabled: input.subscribe_enabled,
      reviews_enabled: input.reviews_enabled,
    })
    .eq('id', user.id)

  if (error) return { error: 'Could not save settings.' }
  revalidatePath('/dashboard/audience')
  return {}
}

export async function moderateReview(
  id: string,
  action: 'approve' | 'delete'
): Promise<ActionResult> {
  const { supabase, user } = await requireUser()

  const query =
    action === 'approve'
      ? supabase
          .from('reviews')
          .update({ is_approved: true })
          .eq('id', id)
          .eq('profile_id', user.id)
      : supabase.from('reviews').delete().eq('id', id).eq('profile_id', user.id)

  const { error } = await query
  if (error) return { error: 'Could not update the review.' }
  revalidatePath('/dashboard/audience')
  return {}
}

export async function deleteContact(id: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id)

  if (error) return { error: 'Could not remove the contact.' }
  revalidatePath('/dashboard/audience')
  return {}
}
