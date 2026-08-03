import { type Metadata } from 'next'

import { ProsePage } from '@/features/marketing/components/prose-page'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'About',
  description: 'Why LinkYaar exists and the principles it is built on.',
}

export default function AboutPage() {
  return (
    <ProsePage
      title="About LinkYaar"
      intro="Yaar means friend. LinkYaar is the friendly, open-source home for everything you are on the internet."
    >
      <h2>Why we built this</h2>
      <p>
        A creator&apos;s link-in-bio page is often the single most visited page they own —
        yet it usually lives on a closed platform that charges for basic features,
        watermarks the free tier, and holds the audience hostage. We think the front door
        to your internet life should belong to you.
      </p>

      <h2>Principles</h2>
      <ul>
        <li>
          <strong>Open source, MIT.</strong> Read it, fork it, self-host it. No asterisks.
        </li>
        <li>
          <strong>Design is a feature.</strong> Every theme, easing curve, and pixel of
          spacing is deliberate. A free page should not look cheap.
        </li>
        <li>
          <strong>Privacy by default.</strong> No trackers, no cookies for visitors, no IP
          logging, analytics visible only to you.
        </li>
        <li>
          <strong>Own your exit.</strong> One-click JSON export and one-click account
          deletion, forever.
        </li>
      </ul>

      <h2>The project</h2>
      <p>
        LinkYaar is developed in the open at{' '}
        <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
          github.com/bhuvan0808/linkyaar
        </a>
        . The roadmap, changelog, and contribution guide live there too — issues and pull
        requests are welcome.
      </p>
    </ProsePage>
  )
}
