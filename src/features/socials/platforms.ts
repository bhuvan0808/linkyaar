import {
  siBehance,
  siDribbble,
  siFacebook,
  siGithub,
  siInstagram,
  siSpotify,
  siThreads,
  siTiktok,
  siTwitch,
  siX,
  siYoutube,
} from 'simple-icons'

/** LinkedIn is excluded from simple-icons (trademark policy). */
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'

/** Globe (website) and envelope (email), drawn to match brand glyph weight. */
const GLOBE_PATH =
  'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm7.938 9h-3.02a15.6 15.6 0 0 0-1.55-4.897A10.03 10.03 0 0 1 19.938 9zM12 2.1c.96 1.06 2.06 3.03 2.75 6.9h-5.5c.69-3.87 1.79-5.84 2.75-6.9zM2.062 15A10.06 10.06 0 0 1 2 12c0-1.03.16-2.04.46-3h3.35a25.3 25.3 0 0 0 0 6H2.46a9.98 9.98 0 0 1-.398 0zM4.062 17h3.02c.37 1.83.92 3.47 1.55 4.897A10.03 10.03 0 0 1 4.062 17zm3.02-10h-3.02a10.03 10.03 0 0 1 4.57-4.897A15.6 15.6 0 0 0 7.082 7zM12 21.9c-.96-1.06-2.06-3.03-2.75-6.9h5.5c-.69 3.87-1.79 5.84-2.75 6.9zm3.19-8.9H8.81a23 23 0 0 1 0-6h6.38a23 23 0 0 1 0 6zm.44 8.797c.63-1.427 1.18-3.067 1.55-4.897h3.02a10.03 10.03 0 0 1-4.57 4.897zM18.19 15a25.3 25.3 0 0 0 0-6h3.35c.3.96.46 1.97.46 3s-.16 2.04-.46 3h-3.35z'
const MAIL_PATH =
  'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z'

export interface PlatformDef {
  key: string
  label: string
  path: string
  placeholder: string
}

/** Must stay in sync with the platform_allowed CHECK in the schema. */
export const PLATFORMS: PlatformDef[] = [
  {
    key: 'instagram',
    label: 'Instagram',
    path: siInstagram.path,
    placeholder: 'https://instagram.com/you',
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    path: siX.path,
    placeholder: 'https://x.com/you',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    path: siYoutube.path,
    placeholder: 'https://youtube.com/@you',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    path: siTiktok.path,
    placeholder: 'https://tiktok.com/@you',
  },
  {
    key: 'github',
    label: 'GitHub',
    path: siGithub.path,
    placeholder: 'https://github.com/you',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    path: LINKEDIN_PATH,
    placeholder: 'https://linkedin.com/in/you',
  },
  {
    key: 'threads',
    label: 'Threads',
    path: siThreads.path,
    placeholder: 'https://threads.net/@you',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    path: siFacebook.path,
    placeholder: 'https://facebook.com/you',
  },
  {
    key: 'twitch',
    label: 'Twitch',
    path: siTwitch.path,
    placeholder: 'https://twitch.tv/you',
  },
  {
    key: 'spotify',
    label: 'Spotify',
    path: siSpotify.path,
    placeholder: 'https://open.spotify.com/artist/…',
  },
  {
    key: 'dribbble',
    label: 'Dribbble',
    path: siDribbble.path,
    placeholder: 'https://dribbble.com/you',
  },
  {
    key: 'behance',
    label: 'Behance',
    path: siBehance.path,
    placeholder: 'https://behance.net/you',
  },
  {
    key: 'website',
    label: 'Website',
    path: GLOBE_PATH,
    placeholder: 'https://yoursite.com',
  },
  {
    key: 'email',
    label: 'Email',
    path: MAIL_PATH,
    placeholder: 'mailto:you@example.com',
  },
]

export const PLATFORM_MAP = new Map(PLATFORMS.map((p) => [p.key, p]))
