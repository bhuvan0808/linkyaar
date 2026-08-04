// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

/**
 * Free-tier AI provider chain. Tries providers in order and returns
 * the first success — one provider's outage or quota never takes the
 * feature down:
 *   1. Google Gemini (gemini-flash-latest)  ~1.5k req/day free
 *   2. Groq (llama-3.1-8b-instant)          ~14k req/day free
 *   3. OpenRouter (free pool, best-effort)
 * All server-only; keys never reach the client.
 */

async function tryGemini(prompt: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return null
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.9 },
        }),
      }
    )
    if (!res.ok) return null
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch {
    return null
  }
}

async function tryOpenAiCompatible(
  url: string,
  key: string | undefined,
  model: string,
  prompt: string
): Promise<string | null> {
  if (!key) return null
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120,
        temperature: 0.9,
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    return data.choices?.[0]?.message?.content?.trim() || null
  } catch {
    return null
  }
}

export async function generateText(prompt: string): Promise<string | null> {
  return (
    (await tryGemini(prompt)) ??
    (await tryOpenAiCompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      process.env.GROQ_API_KEY,
      'llama-3.1-8b-instant',
      prompt
    )) ??
    (await tryOpenAiCompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      process.env.OPENROUTER_API_KEY,
      'openai/gpt-oss-20b:free',
      prompt
    )) ??
    (await tryOpenAiCompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      process.env.OPENROUTER_API_KEY,
      'nvidia/nemotron-nano-9b-v2:free',
      prompt
    ))
  )
}
