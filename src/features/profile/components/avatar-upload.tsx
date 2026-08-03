'use client'

import { Camera, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { setAvatarUrl } from '@/features/profile/actions'
import { createClient } from '@/lib/supabase/client'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function AvatarUpload({
  userId,
  avatarUrl,
  fallback,
}: {
  userId: string
  avatarUrl: string | null
  fallback: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Use a JPEG, PNG, WebP, or AVIF image.')
      return
    }
    if (file.size > MAX_BYTES) {
      toast.error('Max 5 MB — try a smaller image.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${userId}/avatar-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { cacheControl: '3600' })

    if (uploadError) {
      setUploading(false)
      toast.error('Upload failed. Try again.')
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(path)

    const result = await setAvatarUrl(publicUrl)
    setUploading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    setPreview(publicUrl)
    toast.success('Photo updated')
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative rounded-full outline-offset-4"
        aria-label="Change profile photo"
        disabled={uploading}
      >
        <Avatar className="size-20 border-2 shadow-[var(--shadow-soft)]">
          <AvatarImage src={preview ?? avatarUrl ?? undefined} alt="" />
          <AvatarFallback className="bg-secondary text-lg font-semibold text-secondary-foreground uppercase">
            {fallback}
          </AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {uploading ? (
            <Loader2 className="size-5 animate-spin text-white" aria-hidden />
          ) : (
            <Camera className="size-5 text-white" aria-hidden />
          )}
        </span>
      </button>
      <div>
        <p className="text-sm font-medium">Profile photo</p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP, or AVIF · up to 5 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="sr-only"
        onChange={handleFile}
      />
    </div>
  )
}
