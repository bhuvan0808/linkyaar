// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Copy,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import {
  deleteLink,
  duplicateLink,
  reorderLinks,
  toggleLink,
} from '@/features/links/actions'
import { LinkFormDialog } from '@/features/links/components/link-form-dialog'
import { type Link } from '@/types/database'

function SortableRow({ link, onEdit }: { link: Link; onEdit: (link: Link) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id })

  async function handleToggle(enabled: boolean) {
    const result = await toggleLink(link.id, enabled)
    if (result.error) toast.error(result.error)
  }

  async function handleDelete() {
    const result = await deleteLink(link.id)
    if (result.error) toast.error(result.error)
    else toast.success('Link deleted')
  }

  async function handleDuplicate() {
    const result = await duplicateLink(link.id)
    if (result.error) toast.error(result.error)
  }

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] transition-shadow duration-200 sm:gap-3 sm:p-4 ${
        isDragging ? 'z-10 shadow-[var(--shadow-lift)]' : ''
      } ${link.is_enabled ? '' : 'opacity-55'}`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${link.title}`}
        className="-m-1 cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="size-4" aria-hidden />
      </button>

      {link.emoji ? (
        <span className="text-xl" aria-hidden>
          {link.emoji}
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{link.title}</p>
          {link.is_featured && (
            <Badge className="gap-1 border-0 bg-secondary text-[10px] text-secondary-foreground">
              <Star className="size-2.5 fill-current" aria-hidden /> Featured
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{link.url}</p>
      </div>

      <Switch
        checked={link.is_enabled}
        onCheckedChange={handleToggle}
        aria-label={`${link.is_enabled ? 'Disable' : 'Enable'} ${link.title}`}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`More actions for ${link.title}`}
          >
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => onEdit(link)}>
            <Pencil aria-hidden /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDuplicate}>
            <Copy aria-hidden /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDelete} variant="destructive">
            <Trash2 aria-hidden /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

export function LinksManager({ links }: { links: Link[] }) {
  const [items, setItems] = useState(links)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Link | null>(null)

  // Server is the source of truth; reset local order when the
  // revalidated prop changes (render-phase reset, per React docs).
  const [prevLinks, setPrevLinks] = useState(links)
  if (prevLinks !== links) {
    setPrevLinks(links)
    setItems(links)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((l) => l.id === active.id)
    const newIndex = items.findIndex((l) => l.id === over.id)
    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)

    const result = await reorderLinks(next.map((l) => l.id))
    if (result.error) {
      toast.error(result.error)
      setItems(items)
    }
  }

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(link: Link) {
    setEditing(link)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={openCreate}
        className="h-12 w-full rounded-2xl bg-accent text-[15px] text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:-translate-y-px hover:bg-accent/90"
      >
        <Plus aria-hidden /> Add link
      </Button>

      {items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-14 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand glyph */}
          <img
            src="/brand/glyph-ink.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-auto opacity-70"
          />
          <p className="mt-4 font-display text-lg font-black tracking-tight">
            Your page is a blank canvas
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first link — your latest video, your shop, anything.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-3">
              {items.map((link) => (
                <SortableRow key={link.id} link={link} onEdit={openEdit} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <LinkFormDialog open={dialogOpen} onOpenChange={setDialogOpen} link={editing} />
    </div>
  )
}
