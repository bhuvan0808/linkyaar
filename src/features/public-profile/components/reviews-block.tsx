'use client'

import { Check, Loader2, Star } from 'lucide-react'
import { useState } from 'react'

import { submitReview } from '@/features/audience/actions'
import { type ThemeTokens } from '@/features/themes/tokens'
import { type Tables } from '@/types/database'

type Review = Tables<'reviews'>

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={`flex gap-0.5 ${className ?? ''}`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-3.5 ${i <= rating ? 'fill-current' : 'opacity-25'}`}
          aria-hidden
        />
      ))}
    </span>
  )
}

export function ReviewsBlock({
  profileId,
  reviews,
  tokens,
}: {
  profileId: string
  reviews: Review[]
  tokens: ThemeTokens
}) {
  const [authorName, setAuthorName] = useState('')
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const surface = `color-mix(in oklab, ${tokens.foreground} 8%, transparent)`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    const result = await submitReview({ profileId, authorName, rating, body, website })
    if (result.error) {
      setState('error')
      setMessage(result.error)
      return
    }
    setState('done')
  }

  return (
    <section aria-label="Reviews" className="flex w-full flex-col gap-3">
      {reviews.length > 0 && (
        <>
          <p className="text-center text-xs font-bold tracking-widest uppercase opacity-60">
            What people say
          </p>
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="rounded-3xl p-5"
              style={{ background: surface }}
            >
              <Stars rating={review.rating} />
              {review.body ? (
                <blockquote className="mt-2 text-sm leading-relaxed">
                  “{review.body}”
                </blockquote>
              ) : null}
              <figcaption className="mt-2 text-xs font-semibold opacity-60">
                — {review.author_name}
              </figcaption>
            </figure>
          ))}
        </>
      )}

      <details className="rounded-3xl p-5" style={{ background: surface }}>
        <summary className="cursor-pointer list-none text-center text-sm font-bold [&::-webkit-details-marker]:hidden">
          ✍️ Leave a review
        </summary>

        {state === 'done' ? (
          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold">
            <Check className="size-4" aria-hidden />
            Thanks! It will appear once approved.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
            <div
              className="flex justify-center gap-1"
              role="radiogroup"
              aria-label="Rating"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={rating === i}
                  aria-label={`${i} star${i > 1 ? 's' : ''}`}
                  onClick={() => setRating(i)}
                  className="p-1 transition-transform duration-150 hover:scale-125"
                >
                  <Star
                    className={`size-6 ${i <= rating ? 'fill-current' : 'opacity-25'}`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
            <input
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={60}
              placeholder="Your name"
              aria-label="Your name"
              className="h-11 rounded-full bg-white px-4 text-sm font-medium text-black outline-none placeholder:text-black/40"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="A few words (optional)"
              aria-label="Your review"
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black outline-none placeholder:text-black/40"
            />
            <button
              type="submit"
              disabled={state === 'sending'}
              className="flex h-11 items-center justify-center gap-1.5 rounded-full text-sm font-bold transition-transform duration-200 hover:scale-[1.02] disabled:opacity-60"
              style={{
                background: tokens.accent,
                color: tokens.mode === 'dark' ? 'oklch(0.16 0.01 286)' : '#fff',
              }}
            >
              {state === 'sending' && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              Send review
            </button>
            {state === 'error' && (
              <p className="text-center text-xs font-medium opacity-80">{message}</p>
            )}
          </form>
        )}
      </details>
    </section>
  )
}
