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
  Check,
  Copy,
  FolderPlus,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  deleteLink,
  duplicateLink,
  reorderLinks,
  toggleLink,
} from '@/features/links/actions'
import { LinkFormDialog } from '@/features/links/components/link-form-dialog'
import {
  createGroup,
  deleteGroup,
  moveLinkToGroup,
  renameGroup,
} from '@/features/links/group-actions'
import { type Link, type LinkGroup } from '@/types/database'

function SortableRow({
  link,
  groups,
  onEdit,
}: {
  link: Link
  groups: LinkGroup[]
  onEdit: (link: Link) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id })

  async function handleToggle(enabled: boolean) {
    const result = await toggleLink(link.id, enabled)
    if (result.error) toast.error(result.error)
  }

  async function run(fn: Promise<{ error?: string }>, ok?: string) {
    const result = await fn
    if (result.error) toast.error(result.error)
    else if (ok) toast.success(ok)
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => onEdit(link)}>
            <Pencil aria-hidden /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run(duplicateLink(link.id))}>
            <Copy aria-hidden /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Move to category
          </DropdownMenuLabel>
          {link.group_id !== null && (
            <DropdownMenuItem onSelect={() => run(moveLinkToGroup(link.id, null))}>
              Ungrouped
            </DropdownMenuItem>
          )}
          {groups
            .filter((g) => g.id !== link.group_id)
            .map((g) => (
              <DropdownMenuItem
                key={g.id}
                onSelect={() => run(moveLinkToGroup(link.id, g.id))}
              >
                {g.title}
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => run(deleteLink(link.id), 'Link deleted')}
            variant="destructive"
          >
            <Trash2 aria-hidden /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}

function GroupHeader({ group }: { group: LinkGroup }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(group.title)

  async function save() {
    setEditing(false)
    if (title.trim() && title !== group.title) {
      const result = await renameGroup(group.id, title)
      if (result.error) {
        toast.error(result.error)
        setTitle(group.title)
      }
    } else {
      setTitle(group.title)
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      {editing ? (
        <Input
          value={title}
          autoFocus
          maxLength={60}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="h-8 max-w-56 text-sm font-semibold"
          aria-label="Category name"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-sm font-bold tracking-wide text-foreground/80 uppercase hover:text-foreground"
        >
          {group.title}
        </button>
      )}
      <div className="h-px flex-1 bg-border" />
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete category ${group.title}`}
        onClick={async () => {
          const result = await deleteGroup(group.id)
          if (result.error) toast.error(result.error)
          else toast.success('Category removed — its links are now ungrouped')
        }}
      >
        <X className="size-4 text-muted-foreground" aria-hidden />
      </Button>
    </div>
  )
}

function SortableBucket({
  bucketLinks,
  groups,
  onEdit,
}: {
  bucketLinks: Link[]
  groups: LinkGroup[]
  onEdit: (link: Link) => void
}) {
  const [items, setItems] = useState(bucketLinks)
  const [prev, setPrev] = useState(bucketLinks)
  if (prev !== bucketLinks) {
    setPrev(bucketLinks)
    setItems(bucketLinks)
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

  return (
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
            <SortableRow key={link.id} link={link} groups={groups} onEdit={onEdit} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

export function LinksManager({ links, groups }: { links: Link[]; groups: LinkGroup[] }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Link | null>(null)

  const ungrouped = links.filter((l) => !l.group_id)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(link: Link) {
    setEditing(link)
    setDialogOpen(true)
  }

  async function addCategory() {
    const title = window.prompt('Name your category (e.g. "Shop", "My videos")')
    if (!title) return
    const result = await createGroup(title)
    if (result.error) toast.error(result.error)
    else toast.success(`Category "${title}" added`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          onClick={openCreate}
          className="h-12 flex-1 rounded-2xl bg-accent text-[15px] text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-200 hover:-translate-y-px hover:bg-accent/90"
        >
          <Plus aria-hidden /> Add link
        </Button>
        <Button
          variant="outline"
          onClick={addCategory}
          className="h-12 rounded-2xl px-5 text-[15px]"
        >
          <FolderPlus aria-hidden /> Category
        </Button>
      </div>

      {links.length === 0 ? (
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
        <div className="flex flex-col gap-5">
          {ungrouped.length > 0 && (
            <SortableBucket bucketLinks={ungrouped} groups={groups} onEdit={openEdit} />
          )}
          {groups.map((group) => {
            const groupLinks = links.filter((l) => l.group_id === group.id)
            return (
              <div key={group.id} className="flex flex-col gap-3">
                <GroupHeader group={group} />
                {groupLinks.length > 0 ? (
                  <SortableBucket
                    bucketLinks={groupLinks}
                    groups={groups}
                    onEdit={openEdit}
                  />
                ) : (
                  <p className="rounded-2xl border border-dashed border-border px-4 py-5 text-center text-xs text-muted-foreground">
                    Empty — move links here from their ⋯ menu.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <LinkFormDialog open={dialogOpen} onOpenChange={setDialogOpen} link={editing} />
    </div>
  )
}
