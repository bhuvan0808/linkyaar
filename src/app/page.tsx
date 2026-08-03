import { siteConfig } from '@/config/site'

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
          Open source · In development
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="text-lg text-balance text-muted-foreground sm:text-xl">
          {siteConfig.tagline}
        </p>
      </div>
    </main>
  )
}
