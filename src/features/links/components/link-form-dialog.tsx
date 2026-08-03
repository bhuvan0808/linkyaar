'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { createLink, updateLink } from '@/features/links/actions'
import { linkSchema, type LinkFormValues } from '@/features/links/schema'
import { type Link } from '@/types/database'

function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => `${n}`.padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface LinkFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When set, the dialog edits this link; otherwise it creates one. */
  link?: Link | null
}

export function LinkFormDialog({ open, onOpenChange, link }: LinkFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{link ? 'Edit link' : 'Add a link'}</DialogTitle>
          <DialogDescription>
            {link
              ? 'Change anything — your page updates instantly.'
              : 'Title and URL are all you need. The rest is seasoning.'}
          </DialogDescription>
        </DialogHeader>
        {/* Keyed remount gives the form fresh defaults per link/open. */}
        <LinkFormInner
          key={link?.id ?? 'new'}
          link={link ?? null}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function LinkFormInner({ link, onDone }: { link: Link | null; onDone: () => void }) {
  const [saving, setSaving] = useState(false)
  const [showSchedule, setShowSchedule] = useState(
    Boolean(link?.starts_at || link?.ends_at)
  )

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link?.title ?? '',
      url: link?.url ?? '',
      description: link?.description ?? '',
      emoji: link?.emoji ?? '',
      is_featured: link?.is_featured ?? false,
      starts_at: toLocalInput(link?.starts_at ?? null),
      ends_at: toLocalInput(link?.ends_at ?? null),
    },
  })

  const isFeatured = useWatch({ control: form.control, name: 'is_featured' })

  async function onSubmit(values: LinkFormValues) {
    setSaving(true)
    const result = link ? await updateLink(link.id, values) : await createLink(values)
    setSaving(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(link ? 'Link updated' : 'Link added')
    onDone()
  }

  const errors = form.formState.errors

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <div className="flex w-16 flex-col gap-1.5">
          <Label htmlFor="link-emoji">Emoji</Label>
          <Input
            id="link-emoji"
            placeholder="✨"
            maxLength={16}
            className="text-center"
            {...form.register('emoji')}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="link-title">Title</Label>
          <Input id="link-title" placeholder="My new video" {...form.register('title')} />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="link-url">URL</Label>
        <Input
          id="link-url"
          type="url"
          inputMode="url"
          placeholder="https://…"
          {...form.register('url')}
        />
        {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="link-description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="link-description"
          rows={2}
          placeholder="One line about where this goes"
          {...form.register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <label className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
        <span>
          <span className="block text-sm font-medium">Feature this link</span>
          <span className="block text-xs text-muted-foreground">
            Pinned to the top with a highlight
          </span>
        </span>
        <Switch
          checked={isFeatured}
          onCheckedChange={(v) => form.setValue('is_featured', v)}
          aria-label="Feature this link"
        />
      </label>

      <button
        type="button"
        onClick={() => setShowSchedule((s) => !s)}
        className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={showSchedule}
      >
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${showSchedule ? 'rotate-180' : ''}`}
          aria-hidden
        />
        Schedule visibility
      </button>

      {showSchedule && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-starts">Show from</Label>
            <Input
              id="link-starts"
              type="datetime-local"
              {...form.register('starts_at')}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="link-ends">Hide after</Label>
            <Input id="link-ends" type="datetime-local" {...form.register('ends_at')} />
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={saving}
        className="h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {saving && <Loader2 className="animate-spin" aria-hidden />}
        {link ? 'Save changes' : 'Add link'}
      </Button>
    </form>
  )
}
