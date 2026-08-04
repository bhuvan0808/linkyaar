// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use server'

import { z } from 'zod'

import { emailTemplate, sendEmail } from '@/lib/email'
import { allow, clientIp } from '@/lib/ratelimit'
import { createClient } from '@/lib/supabase/server'

const schema = z
  .string()
  .trim()
  .min(3, 'Say a little more')
  .max(2000, 'Max 2000 characters')

/** Sends product feedback straight to the support inbox. */
export async function sendFeedback(message: string): Promise<{ error?: string }> {
  const parsed = schema.safeParse(message)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 5 feedback emails per hour per user (or per IP if signed out).
  if (!(await allow('feedback', user?.id ?? (await clientIp())))) {
    return { error: 'Too many messages — try again in an hour.' }
  }

  const ok = await sendEmail({
    to: 'support@linkyaar.com',
    subject: `Feedback from ${user?.email ?? 'a visitor'}`,
    html: emailTemplate({
      heading: 'New feedback',
      body: `<p style="white-space:pre-wrap;">${parsed.data
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')}</p><p>— ${user?.email ?? 'anonymous'}</p>`,
    }),
  })

  if (!ok)
    return { error: 'Could not send right now. Email support@linkyaar.com instead.' }
  return {}
}
