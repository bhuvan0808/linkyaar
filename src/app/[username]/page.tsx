// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { type Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ConsentGate } from '@/features/consent/components/consent-gate'
import { PublicLink } from '@/features/public-profile/components/public-link'
import { ReviewsBlock } from '@/features/public-profile/components/reviews-block'
import { SocialsRow } from '@/features/public-profile/components/socials-row'
import { SubscribeCard } from '@/features/public-profile/components/subscribe-card'
import { THEME_FONTS } from '@/features/themes/fonts'
import { siteConfig } from '@/config/site'
import { getPublicProfile } from '@/services/profiles'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const data = await getPublicProfile(username)
  if (!data) return { title: 'Not found' }

  const name = data.profile.display_name ?? `@${data.profile.username}`
  const description =
    data.profile.headline ??
    data.profile.bio ??
    `${name} on LinkYaar — everything they are, one beautiful link.`

  return {
    title: name,
    description,
    alternates: { canonical: `${siteConfig.url}/${data.profile.username}` },
    openGraph: {
      type: 'profile',
      title: `${name} · LinkYaar`,
      description,
      url: `${siteConfig.url}/${data.profile.username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} · LinkYaar`,
      description,
    },
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  const data = await getPublicProfile(username)
  if (!data) notFound()

  const { profile, links, sections, socials, reviews, tokens } = data
  const name = profile.display_name ?? `@${profile.username}`
  const detailLine = [profile.occupation, profile.location].filter(Boolean).join(' · ')

  // Analytics are recorded client-side ONLY after the visitor grants
  // consent (DPDP Act 2023) — see <ConsentGate />. Nothing is collected
  // on this server render.

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: `${siteConfig.url}/${profile.username}`,
    description: profile.headline ?? undefined,
    image: profile.avatar_url ?? undefined,
    sameAs: socials.map((s) => s.url),
  }

  return (
    <main
      className={`flex min-h-dvh flex-col items-center px-5 py-14 sm:py-20 ${THEME_FONTS[tokens.font]?.className ?? 'font-sans'}`}
      style={{ background: tokens.background, color: tokens.foreground }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <div className="flex w-full max-w-lg flex-1 flex-col items-center">
        {/* Identity — layout chosen in the Theme Studio */}
        {profile.header_layout !== 'minimal' &&
          (profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage host
            <img
              src={profile.avatar_url}
              alt=""
              width={profile.header_layout === 'portrait' ? 144 : 96}
              height={profile.header_layout === 'portrait' ? 176 : 96}
              className={
                profile.header_layout === 'portrait'
                  ? 'h-44 w-36 rounded-[1.75rem] object-cover shadow-[0_12px_40px_rgba(0,0,0,0.3)]'
                  : 'size-24 rounded-full object-cover shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
              }
            />
          ) : (
            <div
              className={`flex items-center justify-center text-3xl font-semibold uppercase shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${
                profile.header_layout === 'portrait'
                  ? 'h-44 w-36 rounded-[1.75rem]'
                  : 'size-24 rounded-full'
              }`}
              style={{
                background: `color-mix(in oklab, ${tokens.accent} 25%, transparent)`,
              }}
              aria-hidden
            >
              {profile.username?.slice(0, 2)}
            </div>
          ))}

        <h1 className="mt-5 text-center text-2xl font-bold tracking-tight text-balance">
          {name}
        </h1>

        {profile.pronouns ? (
          <p className="mt-1 text-[13px]" style={{ color: tokens.muted }}>
            {profile.pronouns}
          </p>
        ) : null}

        {profile.headline ? (
          <p className="mt-2 max-w-sm text-center text-[15px] text-pretty">
            {profile.headline}
          </p>
        ) : null}

        {profile.bio ? (
          <p
            className="mt-2 max-w-sm text-center text-sm leading-relaxed text-pretty"
            style={{ color: tokens.muted }}
          >
            {profile.bio}
          </p>
        ) : null}

        {detailLine ? (
          <p className="mt-2 text-xs" style={{ color: tokens.muted }}>
            {detailLine}
          </p>
        ) : null}

        <div className="mt-5">
          <SocialsRow socials={socials} tokens={tokens} />
        </div>

        {/* Links — grouped into categories when the creator uses them */}
        <div className="mt-8 flex w-full flex-col gap-6">
          {links.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 rounded-3xl px-6 py-10 text-center"
              style={{
                background: `color-mix(in oklab, ${tokens.foreground} 7%, transparent)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- brand glyph */}
              <img
                src={
                  tokens.mode === 'dark'
                    ? '/brand/glyph-white.png'
                    : '/brand/glyph-ink.png'
                }
                alt=""
                width={36}
                height={36}
                className="h-9 w-auto opacity-60"
              />
              <p className="text-[15px] font-semibold">{name} is setting things up</p>
              <p className="max-w-xs text-sm" style={{ color: tokens.muted }}>
                Their links will appear here soon — check back in a bit. ✨
              </p>
            </div>
          ) : (
            sections.map((section) => (
              <section
                key={section.group?.id ?? 'ungrouped'}
                className="flex w-full flex-col gap-3.5"
              >
                {section.group ? (
                  <h2 className="mt-1 text-center text-xs font-bold tracking-widest uppercase opacity-60">
                    {section.group.title}
                  </h2>
                ) : null}
                {section.links.map((link) => (
                  <PublicLink key={link.id} link={link} tokens={tokens} />
                ))}
              </section>
            ))
          )}
        </div>

        {/* Audience blocks */}
        {profile.subscribe_enabled ? (
          <div className="mt-8 w-full">
            <SubscribeCard profileId={profile.id} tokens={tokens} />
          </div>
        ) : null}
        {profile.reviews_enabled ? (
          <div className="mt-6 w-full">
            <ReviewsBlock profileId={profile.id} reviews={reviews} tokens={tokens} />
          </div>
        ) : null}
      </div>

      {/* Attribution — always in brand colors/type, legible on any theme */}
      <footer className="mt-14 font-sans">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-3 text-[13px] font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
          style={
            tokens.mode === 'dark'
              ? { background: '#ffffff', color: 'oklch(0.33 0.07 155)' }
              : { background: 'oklch(0.33 0.07 155)', color: '#ffffff' }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- small brand glyph */}
          <img
            src={
              tokens.mode === 'dark' ? '/brand/glyph-ink.png' : '/brand/glyph-white.png'
            }
            alt=""
            width={18}
            height={18}
            className="h-4.5 w-auto"
          />
          <span>
            Make your own{' '}
            <span className="font-display text-[14px] font-black tracking-tight">
              LinkYaar
            </span>
          </span>
        </Link>
      </footer>

      <ConsentGate profileId={profile.id} tokens={tokens} />
    </main>
  )
}
