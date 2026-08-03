'use client'

import { RotateCw } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

/** Live phone-framed preview of the public page. */
export function PreviewFrame({ username }: { username: string }) {
  const [nonce, setNonce] = useState(0)

  return (
    <aside className="sticky top-24 hidden h-fit w-[300px] shrink-0 xl:block">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Live preview
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setNonce((n) => n + 1)}
          aria-label="Refresh preview"
        >
          <RotateCw className="size-3.5" aria-hidden />
        </Button>
      </div>
      <div className="rounded-[2.5rem] border-[6px] border-[oklch(0.2_0.01_286)] bg-black shadow-[var(--shadow-float)]">
        <iframe
          key={nonce}
          src={`/${username}`}
          title="Preview of your public page"
          className="h-[560px] w-full rounded-[2.1rem] bg-white"
        />
      </div>
    </aside>
  )
}
