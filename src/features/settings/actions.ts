'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function deleteAccount(): Promise<{ error?: string } | never> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.rpc('delete_user')
  if (error) return { error: 'Could not delete your account. Contact support.' }

  await supabase.auth.signOut()
  redirect('/')
}

/** GDPR-style export: everything we store about the signed-in user. */
export async function exportData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, links, socials, settings] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('links').select('*').eq('profile_id', user.id).order('position'),
    supabase.from('social_links').select('*').eq('profile_id', user.id).order('position'),
    supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  return {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email, created_at: user.created_at },
    profile: profile.data,
    links: links.data ?? [],
    social_links: socials.data ?? [],
    settings: settings.data,
  }
}
