// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Check, Loader2, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  saveCustomTheme,
  setHeaderLayout,
  setTheme,
  type CustomThemeInput,
} from '@/features/profile/actions'
import { AvatarUpload } from '@/features/profile/components/avatar-upload'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { SocialsEditor } from '@/features/socials/components/socials-editor'
import { ThemePreviewCard } from '@/features/themes/components/theme-preview-card'
import { THEME_FONTS } from '@/features/themes/fonts'
import {
  FONT_KEYS,
  mergeThemeTokens,
  parseThemeTokens,
  type ButtonRadius,
  type ButtonVariant,
  type ThemeTokens,
} from '@/features/themes/tokens'
import { themedButtonStyle } from '@/features/themes/button-style'
import { type Profile, type SocialLink, type Theme } from '@/types/database'

type HeaderLayout = 'classic' | 'portrait' | 'minimal'

const SOLID_SWATCHES = [
  '#FFFFFF',
  '#F7F2E8',
  '#FCE7D8',
  '#FDE68A',
  '#DCE8D4',
  '#D9E8E6',
  '#DBEAFE',
  '#E9D8FD',
  '#FBD5E0',
  '#22301F',
  '#171923',
  '#2B0F0E',
]

const GRADIENT_SWATCHES = [
  'linear-gradient(175deg, oklch(0.92 0.06 200) 0%, oklch(0.88 0.09 340) 45%, oklch(0.62 0.17 40) 100%)',
  'linear-gradient(160deg, oklch(0.9 0.07 350) 0%, oklch(0.65 0.18 25) 100%)',
  'linear-gradient(180deg, oklch(0.3 0.09 250) 0%, oklch(0.18 0.07 265) 100%)',
  'linear-gradient(160deg, oklch(0.95 0.04 60) 0%, oklch(0.85 0.09 30) 100%)',
  'linear-gradient(165deg, oklch(0.93 0.05 140) 0%, oklch(0.75 0.09 170) 100%)',
  'linear-gradient(170deg, oklch(0.25 0.02 280) 0%, oklch(0.1 0.01 280) 100%)',
  'linear-gradient(150deg, oklch(0.9 0.08 90) 0%, oklch(0.7 0.13 60) 100%)',
  'linear-gradient(160deg, oklch(0.93 0.04 300) 0%, oklch(0.75 0.11 320) 100%)',
  'radial-gradient(120% 90% at 20% 0%, oklch(0.45 0.16 340) 0%, transparent 55%), radial-gradient(120% 90% at 90% 20%, oklch(0.4 0.16 290) 0%, transparent 50%), oklch(0.2 0.06 315)',
  'linear-gradient(170deg, oklch(0.35 0.08 155) 0%, oklch(0.2 0.05 160) 100%)',
]

const ACCENT_SWATCHES = [
  '#C13A2A',
  '#E0662F',
  '#D9A31A',
  '#2F7D4F',
  '#0E8A6E',
  '#1D7A8C',
  '#2C5F8F',
  '#6D4ACF',
  '#C2338B',
  '#7A4A2B',
  '#17171B',
  '#F5F1E8',
]

const VARIANTS: ButtonVariant[] = ['filled', 'outline', 'glass', 'soft', 'gradient']
const RADII: ButtonRadius[] = ['pill', 'rounded', 'square']

const LAYOUTS: { key: HeaderLayout; label: string; hint: string }[] = [
  { key: 'classic', label: 'Classic', hint: 'Round photo, centered' },
  { key: 'portrait', label: 'Portrait', hint: 'Large rounded photo' },
  { key: 'minimal', label: 'Minimal', hint: 'No photo, just type' },
]

export function AppearanceStudio({
  profile,
  themes,
  socials,
  linkTitles,
}: {
  profile: Profile
  themes: Theme[]
  socials: SocialLink[]
  linkTitles: string[]
}) {
  const baseTheme = useMemo(
    () =>
      themes.find((t) => t.id === profile.theme_id) ?? themes.find((t) => t.is_default),
    [themes, profile.theme_id]
  )

  const [tokens, setTokens] = useState<ThemeTokens>(() =>
    mergeThemeTokens(baseTheme?.tokens ?? null, profile.custom_theme)
  )
  const [activeThemeId, setActiveThemeId] = useState(profile.theme_id)
  const [layout, setLayout] = useState<HeaderLayout>(
    (profile.header_layout as HeaderLayout) ?? 'classic'
  )
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  function patch(partial: Partial<ThemeTokens>) {
    setTokens((t) => ({ ...t, ...partial }))
    setDirty(true)
  }

  async function pickPreset(theme: Theme) {
    const next = parseThemeTokens(theme.tokens)
    setTokens(next)
    setActiveThemeId(theme.id)
    setDirty(false)
    const result = await setTheme(theme.id)
    if (result.error) toast.error(result.error)
    else toast.success(`Theme: ${theme.name}`)
  }

  async function pickLayout(next: HeaderLayout) {
    setLayout(next)
    const result = await setHeaderLayout(next)
    if (result.error) toast.error(result.error)
  }

  async function saveStudio() {
    setSaving(true)
    const result = await saveCustomTheme(tokens as CustomThemeInput)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else {
      setDirty(false)
      toast.success('Your custom look is live')
    }
  }

  async function resetToPreset() {
    if (!activeThemeId) return
    const theme = themes.find((t) => t.id === activeThemeId)
    if (theme) await pickPreset(theme)
  }

  return (
    <div className="flex flex-col gap-8 xl:flex-row">
      <div className="min-w-0 flex-1">
        <Tabs defaultValue="header">
          <TabsList>
            <TabsTrigger value="header">Header</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="studio">Studio</TabsTrigger>
          </TabsList>

          {/* ─── Header ─────────────────────────────────────── */}
          <TabsContent value="header" className="mt-4 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Layout</CardTitle>
                <CardDescription>How your identity appears up top.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => pickLayout(l.key)}
                    aria-pressed={layout === l.key}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      layout === l.key
                        ? 'border-accent ring-2 ring-accent/30'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex h-10 items-end" aria-hidden>
                      {l.key === 'classic' && (
                        <div className="size-8 rounded-full bg-secondary" />
                      )}
                      {l.key === 'portrait' && (
                        <div className="h-10 w-8 rounded-lg bg-secondary" />
                      )}
                      {l.key === 'minimal' && (
                        <div className="h-2.5 w-12 rounded-full bg-secondary" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold">{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.hint}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Shown at the top of your public page.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <AvatarUpload
                  userId={profile.id}
                  avatarUrl={profile.avatar_url}
                  fallback={(profile.username ?? 'yo').slice(0, 2)}
                />
                <ProfileForm profile={profile} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Socials</CardTitle>
                <CardDescription>Icon row under your bio.</CardDescription>
              </CardHeader>
              <CardContent>
                <SocialsEditor socials={socials} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Themes ─────────────────────────────────────── */}
          <TabsContent value="themes" className="mt-4">
            <div
              role="radiogroup"
              aria-label="Choose a theme"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            >
              {themes.map((theme) => {
                const t = parseThemeTokens(theme.tokens)
                const active = activeThemeId === theme.id && !dirty
                return (
                  <button
                    key={theme.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => pickPreset(theme)}
                    className={`group relative flex h-32 flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] ${
                      active ? 'border-accent ring-2 ring-accent/30' : 'border-black/5'
                    }`}
                    style={{ background: t.background }}
                  >
                    <span
                      className="block h-2 w-12 rounded-full"
                      style={{ background: t.accent }}
                      aria-hidden
                    />
                    <span
                      className="text-sm font-semibold tracking-tight"
                      style={{ color: t.foreground }}
                    >
                      {theme.name}
                      {theme.is_default ? ' ✦' : ''}
                    </span>
                    {active && (
                      <span className="absolute top-2.5 right-2.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <Check className="size-3" aria-hidden />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </TabsContent>

          {/* ─── Studio ─────────────────────────────────────── */}
          <TabsContent value="studio" className="mt-4 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallpaper</CardTitle>
                <CardDescription>Solid colors and gradients.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {SOLID_SWATCHES.map((c) => (
                    <button
                      key={c}
                      onClick={() => patch({ background: c })}
                      aria-label={`Background ${c}`}
                      className={`size-9 rounded-xl border border-black/10 transition-transform duration-150 hover:scale-110 ${
                        tokens.background === c ? 'ring-2 ring-accent ring-offset-2' : ''
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {GRADIENT_SWATCHES.map((g) => (
                    <button
                      key={g}
                      onClick={() => patch({ background: g })}
                      aria-label="Gradient background"
                      className={`h-9 w-14 rounded-xl border border-black/10 transition-transform duration-150 hover:scale-105 ${
                        tokens.background === g ? 'ring-2 ring-accent ring-offset-2' : ''
                      }`}
                      style={{ background: g }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={tokens.mode === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      patch({
                        mode: 'light',
                        foreground: 'oklch(0.22 0.02 280)',
                        muted: 'oklch(0.45 0.02 280)',
                      })
                    }
                  >
                    Dark text
                  </Button>
                  <Button
                    variant={tokens.mode === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      patch({
                        mode: 'dark',
                        foreground: 'oklch(0.97 0.005 90)',
                        muted: 'oklch(0.75 0.01 90)',
                      })
                    }
                  >
                    Light text
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Style and shape of your links.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {VARIANTS.map((v) => (
                    <button
                      key={v}
                      onClick={() => patch({ buttonVariant: v })}
                      aria-pressed={tokens.buttonVariant === v}
                      className={`rounded-xl border p-2 transition-all duration-150 ${
                        tokens.buttonVariant === v
                          ? 'border-accent ring-2 ring-accent/30'
                          : 'border-border'
                      }`}
                    >
                      <div
                        className="w-full truncate px-2 py-2 text-center text-[11px] font-bold capitalize"
                        style={{
                          ...themedButtonStyle({ ...tokens, buttonVariant: v }),
                          backdropFilter: undefined,
                        }}
                      >
                        {v}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {RADII.map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant={tokens.buttonRadius === r ? 'default' : 'outline'}
                      className="capitalize"
                      onClick={() => patch({ buttonRadius: r })}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Font</CardTitle>
                <CardDescription>Sets the voice of your whole page.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {FONT_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => patch({ font: key })}
                    aria-pressed={tokens.font === key}
                    className={`rounded-xl border px-3 py-3 text-left transition-all duration-150 ${
                      tokens.font === key
                        ? 'border-accent ring-2 ring-accent/30'
                        : 'border-border'
                    }`}
                  >
                    <span
                      className={`block text-lg leading-none ${THEME_FONTS[key].className}`}
                    >
                      Aa
                    </span>
                    <span className="mt-1.5 block text-xs font-medium text-muted-foreground">
                      {THEME_FONTS[key].label}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accent</CardTitle>
                <CardDescription>Buttons, highlights, and emphasis.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {ACCENT_SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => patch({ accent: c })}
                    aria-label={`Accent ${c}`}
                    className={`size-9 rounded-full border border-black/10 transition-transform duration-150 hover:scale-110 ${
                      tokens.accent === c ? 'ring-2 ring-accent ring-offset-2' : ''
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </CardContent>
            </Card>

            <div className="sticky bottom-20 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-lift)] lg:bottom-4">
              <Button
                onClick={saveStudio}
                disabled={!dirty || saving}
                className="flex-1 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {saving && <Loader2 className="animate-spin" aria-hidden />}
                {dirty ? 'Save changes' : 'Saved'}
              </Button>
              <Button variant="outline" onClick={resetToPreset} className="rounded-xl">
                <RotateCcw aria-hidden /> Reset
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live preview */}
      <aside className="w-full shrink-0 xl:sticky xl:top-24 xl:w-[300px] xl:self-start">
        <p className="mb-3 px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Live preview
        </p>
        <ThemePreviewCard
          tokens={tokens}
          headerLayout={layout}
          name={profile.display_name ?? `@${profile.username}`}
          headline={profile.headline}
          avatarUrl={profile.avatar_url}
          linkTitles={linkTitles}
        />
      </aside>
    </div>
  )
}
