export const siteConfig = {
  name: 'LinkYaar',
  tagline: 'Everything you are. One beautiful link.',
  description:
    'LinkYaar is an open-source creator profile platform. Bring your links, socials, portfolio, and contact together in one beautiful page.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ogImage: '/og.png',
  links: {
    github: 'https://github.com/bhuvan0808/linkyaar',
  },
} as const

export type SiteConfig = typeof siteConfig
