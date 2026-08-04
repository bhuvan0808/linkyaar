// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

interface ProsePageProps {
  title: string
  intro?: string
  updated?: string
  children: React.ReactNode
}

/** Shared shell for legal & info pages — consistent rhythm and type. */
export function ProsePage({ title, intro, updated, children }: ProsePageProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-36 pb-24">
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {updated ? (
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>
      ) : null}
      {intro ? (
        <p className="mt-5 text-lg text-pretty text-muted-foreground">{intro}</p>
      ) : null}
      <div className="mt-10 [&_a]:font-medium [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:mt-2 [&_li]:leading-relaxed [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-foreground/85 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-foreground/85">
        {children}
      </div>
    </div>
  )
}
