'use client'

import { Download, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const QR_OPTIONS = {
  margin: 1,
  width: 480,
  color: { dark: '#1c1a26', light: '#ffffff' },
}

export function QrDialog({ url }: { url: string }) {
  const [open, setOpen] = useState(false)
  const [pngUrl, setPngUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    QRCode.toDataURL(url, QR_OPTIONS)
      .then(setPngUrl)
      .catch(() => toast.error('Could not generate the QR code.'))
  }, [open, url])

  async function downloadSvg() {
    try {
      const svg = await QRCode.toString(url, { ...QR_OPTIONS, type: 'svg' })
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      triggerDownload(URL.createObjectURL(blob), 'linkyaar-qr.svg')
    } catch {
      toast.error('Could not generate the SVG.')
    }
  }

  function downloadPng() {
    if (pngUrl) triggerDownload(pngUrl, 'linkyaar-qr.png')
  }

  function triggerDownload(href: string, filename: string) {
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <QrCode aria-hidden />
          <span className="hidden sm:inline">QR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Your page as a QR code</DialogTitle>
          <DialogDescription>
            Posters, slides, business cards — anywhere a camera can reach.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5">
          {pngUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL, no optimization possible
            <img
              src={pngUrl}
              alt={`QR code linking to ${url}`}
              className="w-56 rounded-2xl border border-border shadow-[var(--shadow-soft)]"
            />
          ) : (
            <div className="h-56 w-56 animate-pulse rounded-2xl bg-muted" />
          )}
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1" onClick={downloadPng}>
              <Download aria-hidden /> PNG
            </Button>
            <Button variant="outline" className="flex-1" onClick={downloadSvg}>
              <Download aria-hidden /> SVG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
