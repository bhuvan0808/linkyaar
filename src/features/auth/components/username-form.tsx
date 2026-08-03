'use client'

import { Check, Loader2, X } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { claimUsername } from '@/features/auth/actions'
import { createClient } from '@/lib/supabase/client'

const USERNAME_RE = /^[a-z0-9_]{3,30}$/

type Availability = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

export function UsernameForm() {
  const [value, setValue] = useState('')
  const [availability, setAvailability] = useState<Availability>('idle')
  const [submitting, startSubmit] = useTransition()
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value.toLowerCase().trim()
    setValue(next)
    latest.current = next
    if (debounce.current) clearTimeout(debounce.current)

    if (!next) {
      setAvailability('idle')
      return
    }
    if (!USERNAME_RE.test(next)) {
      setAvailability('invalid')
      return
    }
    setAvailability('checking')
    debounce.current = setTimeout(async () => {
      const supabase = createClient()
      const { data } = await supabase.rpc('username_available', { candidate: next })
      // Ignore responses for stale input.
      if (latest.current === next) setAvailability(data ? 'available' : 'taken')
    }, 350)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startSubmit(async () => {
      const result = await claimUsername(value)
      if (result?.error) toast.error(result.error)
    })
  }

  const hint: Record<Availability, { text: string; tone: string }> = {
    idle: {
      text: 'Lowercase letters, numbers, underscores.',
      tone: 'text-muted-foreground',
    },
    checking: { text: 'Checking availability…', tone: 'text-muted-foreground' },
    available: { text: 'Available — it is yours if you want it.', tone: 'text-success' },
    taken: { text: 'Taken. Try a variation.', tone: 'text-destructive' },
    invalid: {
      text: '3–30 characters: lowercase letters, numbers, underscores.',
      tone: 'text-destructive',
    },
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="flex h-13 items-center rounded-2xl border border-border bg-card pr-2 pl-4 shadow-[var(--shadow-soft)] transition-shadow duration-300 focus-within:shadow-[var(--shadow-glow)]">
        <span className="text-sm whitespace-nowrap text-muted-foreground">linkyaar/</span>
        <Input
          value={value}
          onChange={handleChange}
          placeholder="yourname"
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={30}
          aria-label="Choose your username"
          aria-describedby="username-hint"
          className="h-full border-0 bg-transparent px-1 text-[15px] font-medium shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <span className="flex size-6 items-center justify-center" aria-hidden>
          {availability === 'checking' && (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          )}
          {availability === 'available' && <Check className="size-4 text-success" />}
          {(availability === 'taken' || availability === 'invalid') && (
            <X className="size-4 text-destructive" />
          )}
        </span>
      </div>

      <p id="username-hint" className={`text-[13px] ${hint[availability].tone}`}>
        {hint[availability].text}
      </p>

      <Button
        type="submit"
        disabled={availability !== 'available' || submitting}
        className="h-12 rounded-2xl bg-accent text-[15px] text-accent-foreground hover:bg-accent/90"
      >
        {submitting && <Loader2 className="animate-spin" aria-hidden />}
        Claim my link
      </Button>
    </form>
  )
}
