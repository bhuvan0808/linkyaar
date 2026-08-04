// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use server'

import { z } from 'zod'

import { allow } from '@/lib/ratelimit'
import { createClient } from '@/lib/supabase/server'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

const inputSchema = z.object({
  name: z.string().trim().max(60).optional(),
  occupation: z.string().trim().max(60).optional(),
  vibe: z.string().trim().max(120).optional(),
})

export type BioInput = z.infer<typeof inputSchema>

/**
 * AI bio generator — deliberately small and HARD capped to stay far
 * inside Gemini's free tier:
 *   · 3/minute per user  (burst)
 *   · 5/day per user
 *   · 60/day across the whole platform (global kill-switch)
 * Output capped at ~60 tokens; single tiny prompt; no history.
 */
export async function generateBio(
  raw: BioInput
): Promise<{ bio?: string; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return { error: 'AI is not configured on this instance.' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Sign in to use AI.' }

  const parsed = inputSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Invalid input.' }

  if (!(await allow('aiBurst', user.id))) {
    return { error: 'Take a breath — try again in a minute.' }
  }
  if (!(await allow('aiUser', user.id))) {
    return { error: 'Daily AI limit reached (5/day). Resets tomorrow.' }
  }
  if (!(await allow('aiGlobal', 'all'))) {
    return { error: 'AI is very popular today — try again tomorrow.' }
  }

  const { name, occupation, vibe } = parsed.data
  const prompt = `Write ONE short link-in-bio profile bio. Max 140 characters. No hashtags, no quotes, no emojis unless fitting. First person or third person, punchy and warm.
Person: ${name || 'a creator'}${occupation ? `, ${occupation}` : ''}${vibe ? `. Vibe/keywords: ${vibe}` : ''}.
Reply with the bio text only.`

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.9 },
      }),
    })
    if (!res.ok) return { error: 'AI is unavailable right now. Try later.' }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) return { error: 'AI came back empty. Try again.' }

    return { bio: text.replace(/^["']|["']$/g, '').slice(0, 300) }
  } catch {
    return { error: 'AI is unavailable right now. Try later.' }
  }
}
