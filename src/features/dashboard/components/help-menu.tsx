// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import {
  BookOpen,
  HelpCircle,
  Loader2,
  Mail,
  MessageSquareHeart,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { sendFeedback } from '@/features/feedback/actions'

export function HelpMenu() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    const result = await sendFeedback(message)
    setSending(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    setMessage('')
    setFeedbackOpen(false)
    toast.success('Thank you! We read every single one.')
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Help and feedback"
          >
            <HelpCircle aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Help &amp; updates</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/help" target="_blank">
              <BookOpen aria-hidden /> Help Center
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/changelog" target="_blank">
              <Sparkles aria-hidden /> What&apos;s new
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="mailto:support@linkyaar.com">
              <Mail aria-hidden /> support@linkyaar.com
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setFeedbackOpen(true)}>
            <MessageSquareHeart aria-hidden /> Share feedback
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/support" target="_blank">
              💛 Support LinkYaar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Got ideas? We&apos;re listening.</DialogTitle>
            <DialogDescription>
              Feature requests, rough edges, wild ideas — it all goes straight to the
              maintainers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="What should LinkYaar do better?"
              aria-label="Your feedback"
              required
            />
            <Button
              type="submit"
              disabled={sending || message.trim().length < 3}
              className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {sending && <Loader2 className="animate-spin" aria-hidden />}
              Send feedback
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
