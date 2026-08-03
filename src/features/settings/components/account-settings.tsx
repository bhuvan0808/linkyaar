'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { setProfileVisibility } from '@/features/profile/actions'
import { deleteAccount, exportData } from '@/features/settings/actions'
import { createClient } from '@/lib/supabase/client'

export function VisibilityToggle({ isPublic }: { isPublic: boolean }) {
  const [checked, setChecked] = useState(isPublic)

  async function handleChange(next: boolean) {
    setChecked(next)
    const result = await setProfileVisibility(next)
    if (result.error) {
      setChecked(!next)
      toast.error(result.error)
    } else {
      toast.success(next ? 'Your page is live' : 'Your page is hidden')
    }
  }

  return (
    <label className="flex items-center justify-between">
      <span>
        <span className="block text-sm font-medium">Public page</span>
        <span className="block text-xs text-muted-foreground">
          When off, only you can see your page.
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={handleChange} aria-label="Public page" />
    </label>
  )
}

export function PasswordForm() {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = z.string().min(8, 'At least 8 characters').safeParse(password)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Invalid password')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) toast.error(error.message)
    else {
      setPassword('')
      toast.success('Password updated')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="8+ characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" variant="outline" disabled={saving || !password}>
        {saving && <Loader2 className="animate-spin" aria-hidden />}
        Update
      </Button>
    </form>
  )
}

export function ExportButton() {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const data = await exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'linkyaar-export.json'
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error('Export failed. Try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={exporting}>
      {exporting ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : (
        <Download aria-hidden />
      )}
      Download my data (JSON)
    </Button>
  )
}

export function DeleteAccountButton() {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteAccount()
    // Only reachable on failure — success redirects away.
    if (result?.error) {
      setDeleting(false)
      toast.error(result.error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={deleting}>
          {deleting && <Loader2 className="animate-spin" aria-hidden />}
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes your profile, links, and analytics. Your username
            becomes available to others. There is no undo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep my account</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
