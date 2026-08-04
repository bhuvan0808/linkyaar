// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Check, Copy, ExternalLink, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/features/auth/actions'
import { QrDialog } from '@/features/share/components/qr-dialog'
import { siteConfig } from '@/config/site'

export function DashTopbar({
  username,
  avatarUrl,
}: {
  username: string
  avatarUrl: string | null
}) {
  const [copied, setCopied] = useState(false)
  const publicUrl = `${siteConfig.url}/${username}`

  async function copy() {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/dashboard" className="text-[17px] font-semibold tracking-tight">
          Link<span className="text-accent">Yaar</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={copy}
            className="hidden items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-3 pl-4 text-[13px] font-medium text-muted-foreground shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-px hover:text-foreground sm:flex"
            aria-label={`Copy your public link ${publicUrl}`}
          >
            <span className="max-w-44 truncate">linkyaar/{username}</span>
            {copied ? (
              <Check className="size-3.5 text-success" aria-hidden />
            ) : (
              <Copy className="size-3.5" aria-hidden />
            )}
          </button>

          <QrDialog url={publicUrl} />

          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <a href={`/${username}`} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden />
              <span className="hidden sm:inline">View</span>
            </a>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-offset-2">
              <Avatar className="size-9 border">
                <AvatarImage src={avatarUrl ?? undefined} alt="" />
                <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground uppercase">
                  {username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="truncate">@{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => void signOut()} variant="destructive">
                <LogOut aria-hidden />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
