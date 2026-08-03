'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,30}$/, '3–30 characters: lowercase letters, numbers, underscores')

export async function claimUsername(raw: string): Promise<{ error: string } | never> {
  const parsed = usernameSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid username' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('profiles')
    .update({ username: parsed.data })
    .eq('id', user.id)

  if (error) {
    // 23505 unique_violation, 23514 check constraint (reserved names)
    return {
      error:
        error.code === '23505'
          ? 'That name was just taken — try another.'
          : 'That name is reserved or invalid.',
    }
  }

  redirect('/dashboard')
}
