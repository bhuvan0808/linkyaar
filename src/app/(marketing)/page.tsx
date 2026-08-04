// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { AnalyticsSection } from '@/features/marketing/components/analytics-section'
import { Cta } from '@/features/marketing/components/cta'
import { FaqSection } from '@/features/marketing/components/faq-section'
import { Features } from '@/features/marketing/components/features'
import { Hero } from '@/features/marketing/components/hero'
import { ThemeShowcase } from '@/features/marketing/components/theme-showcase'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <AnalyticsSection />
      <ThemeShowcase />
      <FaqSection />
      <Cta />
    </>
  )
}
