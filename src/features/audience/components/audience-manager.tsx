// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

'use client'

import { Check, Download, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  deleteContact,
  moderateReview,
  setAudienceToggles,
} from '@/features/audience/actions'
import { type Profile, type Tables } from '@/types/database'

type Contact = Tables<'contacts'>
type Review = Tables<'reviews'>

function StarsInline({ rating }: { rating: number }) {
  return (
    <span
      className="flex gap-0.5 text-accent"
      role="img"
      aria-label={`${rating} of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-3.5 ${i <= rating ? 'fill-current' : 'opacity-25'}`}
          aria-hidden
        />
      ))}
    </span>
  )
}

export function AudienceManager({
  profile,
  contacts,
  reviews,
}: {
  profile: Profile
  contacts: Contact[]
  reviews: Review[]
}) {
  const [subscribeEnabled, setSubscribeEnabled] = useState(profile.subscribe_enabled)
  const [reviewsEnabled, setReviewsEnabled] = useState(profile.reviews_enabled)

  const pending = reviews.filter((r) => !r.is_approved)
  const approved = reviews.filter((r) => r.is_approved)

  async function saveToggles(nextSubscribe: boolean, nextReviews: boolean) {
    setSubscribeEnabled(nextSubscribe)
    setReviewsEnabled(nextReviews)
    const result = await setAudienceToggles({
      subscribe_enabled: nextSubscribe,
      reviews_enabled: nextReviews,
    })
    if (result.error) {
      setSubscribeEnabled(profile.subscribe_enabled)
      setReviewsEnabled(profile.reviews_enabled)
      toast.error(result.error)
    } else {
      toast.success('Saved')
    }
  }

  function exportCsv() {
    const rows = [
      ['email', 'name', 'source', 'subscribed_at'],
      ...contacts.map((c) => [c.email, c.name ?? '', c.source, c.created_at]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'linkyaar-subscribers.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function handleModerate(id: string, action: 'approve' | 'delete') {
    const result = await moderateReview(id, action)
    if (result.error) toast.error(result.error)
    else toast.success(action === 'approve' ? 'Review published' : 'Review deleted')
  }

  async function handleDeleteContact(id: string) {
    const result = await deleteContact(id)
    if (result.error) toast.error(result.error)
    else toast.success('Contact removed')
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Blocks on your page</CardTitle>
          <CardDescription>Turn these on to show them under your links.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex items-center justify-between">
            <span>
              <span className="block text-sm font-medium">Subscribe form</span>
              <span className="block text-xs text-muted-foreground">
                Collect emails from visitors — your audience, exportable anytime.
              </span>
            </span>
            <Switch
              checked={subscribeEnabled}
              onCheckedChange={(v) => saveToggles(v, reviewsEnabled)}
              aria-label="Enable subscribe form"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>
              <span className="block text-sm font-medium">Reviews</span>
              <span className="block text-xs text-muted-foreground">
                Visitors can leave a review; it shows only after you approve it.
              </span>
            </span>
            <Switch
              checked={reviewsEnabled}
              onCheckedChange={(v) => saveToggles(subscribeEnabled, v)}
              aria-label="Enable reviews"
            />
          </label>
        </CardContent>
      </Card>

      <Tabs defaultValue="subscribers">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers ({contacts.length})</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews{' '}
            {pending.length > 0 ? `(${pending.length} new)` : `(${reviews.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subscribers</CardTitle>
                <CardDescription>People who asked to hear from you.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCsv}
                disabled={contacts.length === 0}
              >
                <Download aria-hidden /> CSV
              </Button>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No subscribers yet. Turn on the subscribe form and share your page.
                </p>
              ) : (
                <ul className="flex flex-col">
                  {contacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{contact.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteContact(contact.id)}
                        aria-label={`Remove ${contact.email}`}
                      >
                        <Trash2 className="size-4 text-muted-foreground" aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <div className="flex flex-col gap-4">
            {pending.length > 0 && (
              <Card className="border-accent/40">
                <CardHeader>
                  <CardTitle>Waiting for approval</CardTitle>
                  <CardDescription>
                    Nothing shows publicly until you approve it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {pending.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <StarsInline rating={review.rating} />
                          <p className="mt-1 text-sm font-medium">{review.author_name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleModerate(review.id, 'approve')}
                            className="bg-success text-white hover:bg-success/90"
                          >
                            <Check aria-hidden /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModerate(review.id, 'delete')}
                          >
                            <Trash2 aria-hidden /> Reject
                          </Button>
                        </div>
                      </div>
                      {review.body && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          “{review.body}”
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Published</CardTitle>
                <CardDescription>Live on your public page.</CardDescription>
              </CardHeader>
              <CardContent>
                {approved.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No published reviews yet.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {approved.map((review) => (
                      <li
                        key={review.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-border p-4"
                      >
                        <div className="min-w-0">
                          <StarsInline rating={review.rating} />
                          {review.body && (
                            <p className="mt-1.5 text-sm">“{review.body}”</p>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">
                            — {review.author_name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleModerate(review.id, 'delete')}
                          aria-label="Delete review"
                        >
                          <Trash2 className="size-4 text-muted-foreground" aria-hidden />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
