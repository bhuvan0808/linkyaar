import { type Link } from '@/types/database'
import { type ThemeTokens } from '@/features/themes/tokens'

const RADIUS: Record<ThemeTokens['buttonRadius'], string> = {
  pill: '9999px',
  rounded: '16px',
  square: '8px',
}

function buttonStyle(tokens: ThemeTokens, featured: boolean): React.CSSProperties {
  // Dark themes carry light accents (dark text on them); light themes
  // carry vivid/dark accents (white text on them).
  const onAccent = tokens.mode === 'dark' ? 'oklch(0.16 0.01 286)' : '#ffffff'
  const base: React.CSSProperties = {
    borderRadius: RADIUS[tokens.buttonRadius],
  }

  switch (tokens.buttonVariant) {
    case 'filled':
      return { ...base, background: tokens.accent, color: onAccent }
    case 'outline':
      return {
        ...base,
        background: 'transparent',
        color: tokens.foreground,
        border: `1.5px solid color-mix(in oklab, ${tokens.foreground} 35%, transparent)`,
      }
    case 'glass':
      return {
        ...base,
        background: `color-mix(in oklab, ${tokens.foreground} 9%, transparent)`,
        color: tokens.foreground,
        border: `1px solid color-mix(in oklab, ${tokens.foreground} 14%, transparent)`,
        backdropFilter: 'blur(12px)',
      }
    case 'soft':
      return {
        ...base,
        background: `color-mix(in oklab, ${tokens.accent} 16%, transparent)`,
        color: tokens.foreground,
      }
    case 'gradient':
      return {
        ...base,
        background: `linear-gradient(120deg, ${tokens.accent}, color-mix(in oklab, ${tokens.accent} 55%, ${tokens.foreground} 45%))`,
        color: onAccent,
      }
  }
  // Featured links additionally get a glow ring via className below.
  void featured
  return base
}

export function PublicLink({ link, tokens }: { link: Link; tokens: ThemeTokens }) {
  return (
    <a
      href={`/api/r/${link.id}`}
      target="_blank"
      rel="noopener"
      style={buttonStyle(tokens, link.is_featured)}
      className={`group flex w-full items-center gap-3 px-5 py-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-[0_8px_28px_rgba(0,0,0,0.16)] active:scale-[0.99] ${
        link.is_featured ? 'ring-2 ring-current/20' : ''
      }`}
    >
      {link.emoji ? (
        <span className="text-lg" aria-hidden>
          {link.emoji}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] leading-snug font-semibold">
          {link.title}
        </span>
        {link.description ? (
          <span className="mt-0.5 block truncate text-[12.5px] leading-snug opacity-70">
            {link.description}
          </span>
        ) : null}
      </span>
      {link.emoji ? <span className="w-[1.125rem]" aria-hidden /> : null}
    </a>
  )
}
