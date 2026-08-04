// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

import { z } from 'zod'

export const linkSchema = z.object({
  title: z.string().trim().min(1, 'Give it a title').max(100, 'Max 100 characters'),
  url: z
    .url('Must be a full URL starting with http(s)://')
    .regex(/^https?:\/\//i, 'Must start with http:// or https://'),
  description: z.string().trim().max(200, 'Max 200 characters').optional(),
  emoji: z.string().trim().max(16).optional(),
  is_featured: z.boolean(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
})

export type LinkFormValues = z.infer<typeof linkSchema>
