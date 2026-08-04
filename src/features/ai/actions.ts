// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use server'

import { z } from 'zod'

import { LIMIT_PREFIX } from '@/features/ai/shared'
import { generateText } from '@/lib/ai'
import { allow } from '@/lib/ratelimit'
import { createClient } from '@/lib/supabase/server'

const inputSchema = z.object({
  kind: z.enum(['bio', 'headline']),
  name: z.string().trim().max(60).optional(),
  occupation: z.string().trim().max(60).optional(),
  vibe: z.string().trim().max(160).optional(),
})

export type AiWriteInput = z.infer<typeof inputSchema>

/**
 * AI writer (bio + headline) — HARD capped to stay far inside the
 * combined free tiers (Gemini ~1.5k/day + Groq ~14k/day):
 *   · 3/minute per user (burst)
 *   · 10/day per user
 *   · 300/day platform-wide (global kill-switch)
 */
export async function aiWrite(
  raw: AiWriteInput
): Promise<{ text?: string; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Sign in to use AI.' }

  const parsed = inputSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid input.' }

  if (!(await allow('aiBurst', user.id))) {
    return { error: `${LIMIT_PREFIX}Take a breath — try again in a minute.` }
  }
  if (!(await allow('aiUser', user.id))) {
    return {
      error: `${LIMIT_PREFIX}You have used all 10 free AI drafts for today — they reset at midnight UTC.`,
    }
  }
  if (!(await allow('aiGlobal', 'all'))) {
    return {
      error: `${LIMIT_PREFIX}The community used up today's free AI pool — it resets tomorrow.`,
    }
  }

  const { kind, name, occupation, vibe } = parsed.data
  const who = `${name || 'a creator'}${occupation ? `, ${occupation}` : ''}${vibe ? `. Vibe/keywords: ${vibe}` : ''}`

  const prompt =
    kind === 'bio'
      ? `Write ONE short link-in-bio profile bio. Max 140 characters. No hashtags, no quotes. Punchy and warm.\nPerson: ${who}.\nReply with the bio text only.`
      : `Write ONE short profile headline (a tagline under a person's name). Max 60 characters. No hashtags, no quotes.\nPerson: ${who}.\nReply with the headline only.`

  const text = await generateText(prompt)
  if (!text)
    return { error: 'AI is unavailable right now — please write manually for now.' }

  return { text: text.replace(/^["']|["']$/g, '').slice(0, kind === 'bio' ? 300 : 100) }
}
