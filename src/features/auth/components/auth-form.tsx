// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Wand2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

const credentialsSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

type Credentials = z.infer<typeof credentialsSchema>

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.9h5.4a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.37 0-.7-.06-1.22-.27-2.05Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.05.95-3.38.95-2.6 0-4.8-1.75-5.6-4.1H3.06v2.58A10 10 0 0 0 12 22Z"
        opacity=".8"
      />
      <path
        fill="currentColor"
        d="M6.4 13.93a6 6 0 0 1 0-3.85V7.5H3.06a10 10 0 0 0 0 9l3.34-2.57Z"
        opacity=".6"
      />
      <path
        fill="currentColor"
        d="M12 5.97c1.47 0 2.78.5 3.82 1.5l2.86-2.86A9.97 9.97 0 0 0 3.06 7.5l3.34 2.58c.8-2.36 3-4.1 5.6-4.1Z"
        opacity=".9"
      />
    </svg>
  )
}

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const next = searchParams.get('next') ?? '/dashboard'

  const [pending, setPending] = useState<'password' | 'magic' | 'google' | null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const signInForm = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  })
  const signUpForm = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  })

  async function handleSignIn(values: Credentials) {
    setPending('password')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(values)
    setPending(null)

    if (error) {
      toast.error(error.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  async function handleSignUp(values: Credentials) {
    setPending('password')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      ...values,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setPending(null)

    if (error) {
      toast.error(error.message)
      return
    }
    if (data.session) {
      router.push('/onboarding')
      router.refresh()
      return
    }
    setConfirmSent(true)
  }

  async function handleForgotPassword(email: string) {
    const parsed = z.email().safeParse(email)
    if (!parsed.success) {
      toast.error('Enter your email above first, then tap Forgot password.')
      return
    }
    setPending('magic')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    })
    setPending(null)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Reset link sent — check your inbox', {
      description:
        'The link signs you in and takes you to Settings to set a new password.',
    })
  }

  async function handleMagicLink(email: string) {
    const parsed = z.email().safeParse(email)
    if (!parsed.success) {
      toast.error('Enter your email first — the magic link needs a destination.')
      return
    }
    setPending('magic')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setPending(null)

    if (error) {
      toast.error(error.message)
      return
    }
    setMagicSent(true)
  }

  async function handleGoogle() {
    setPending('google')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
    if (error) {
      setPending(null)
      toast.info('Google sign-in is almost ready — use email for now.')
    }
  }

  if (magicSent || confirmSent) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-accent">
          <Mail className="size-6" aria-hidden />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">Check your inbox</h2>
        <p className="max-w-xs text-[15px] text-muted-foreground">
          {magicSent
            ? 'We sent you a magic link. Click it and you are in — no password needed.'
            : 'We sent a confirmation link to finish creating your account.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Button
        variant="outline"
        className="h-11 w-full rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-soft)]"
        onClick={handleGoogle}
        disabled={pending !== null}
      >
        {pending === 'google' ? (
          <Loader2 className="animate-spin" aria-hidden />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or with email</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Tabs defaultValue={defaultMode}>
        <TabsList className="w-full">
          <TabsTrigger value="signin" className="flex-1">
            Log in
          </TabsTrigger>
          <TabsTrigger value="signup" className="flex-1">
            Sign up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-4">
          <form
            onSubmit={signInForm.handleSubmit(handleSignIn)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...signInForm.register('email')}
              />
              {signInForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...signInForm.register('password')}
              />
              {signInForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={pending !== null}
            >
              {pending === 'password' && <Loader2 className="animate-spin" aria-hidden />}
              Log in
            </Button>
            <div className="flex items-center justify-center gap-1">
              <Button
                type="button"
                variant="ghost"
                className="h-9 text-[13px] text-muted-foreground"
                disabled={pending !== null}
                onClick={() => handleMagicLink(signInForm.getValues('email'))}
              >
                {pending === 'magic' ? (
                  <Loader2 className="animate-spin" aria-hidden />
                ) : (
                  <Wand2 aria-hidden />
                )}
                Magic link
              </Button>
              <span className="text-xs text-muted-foreground" aria-hidden>
                ·
              </span>
              <Button
                type="button"
                variant="ghost"
                className="h-9 text-[13px] text-muted-foreground"
                disabled={pending !== null}
                onClick={() => handleForgotPassword(signInForm.getValues('email'))}
              >
                Forgot password?
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-4">
          <form
            onSubmit={signUpForm.handleSubmit(handleSignUp)}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...signUpForm.register('email')}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="8+ characters"
                {...signUpForm.register('password')}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={pending !== null}
            >
              {pending === 'password' && <Loader2 className="animate-spin" aria-hidden />}
              Create account
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Free forever. You pick your username next.
            </p>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
