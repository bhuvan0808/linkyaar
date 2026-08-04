// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) 2026 Bhuvan Boddu and LinkYaar contributors

/**
 * Database types for the Supabase client.
 *
 * Hand-written to mirror supabase/migrations. Once the Supabase CLI
 * is linked, regenerate with:
 *   pnpm supabase gen types typescript --linked > src/types/database.ts
 */
import { type Json } from '@/types/json'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          theme_id: string | null
          is_public: boolean
          headline: string | null
          occupation: string | null
          location: string | null
          pronouns: string | null
          cover_url: string | null
          subscribe_enabled: boolean
          reviews_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme_id?: string | null
          is_public?: boolean
          headline?: string | null
          occupation?: string | null
          location?: string | null
          pronouns?: string | null
          cover_url?: string | null
          subscribe_enabled?: boolean
          reviews_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme_id?: string | null
          is_public?: boolean
          headline?: string | null
          occupation?: string | null
          location?: string | null
          pronouns?: string | null
          cover_url?: string | null
          subscribe_enabled?: boolean
          reviews_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          profile_id: string
          email: string
          name: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          email: string
          name?: string | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          email?: string
          name?: string | null
          source?: string
          created_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          profile_id: string
          author_name: string
          rating: number
          body: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          author_name: string
          rating: number
          body?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          author_name?: string
          rating?: number
          body?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Relationships: []
      }
      links: {
        Row: {
          id: string
          profile_id: string
          title: string
          url: string
          position: number
          is_enabled: boolean
          description: string | null
          thumbnail_url: string | null
          emoji: string | null
          is_featured: boolean
          starts_at: string | null
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          url: string
          position?: number
          is_enabled?: boolean
          description?: string | null
          thumbnail_url?: string | null
          emoji?: string | null
          is_featured?: boolean
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          url?: string
          position?: number
          is_enabled?: boolean
          description?: string | null
          thumbnail_url?: string | null
          emoji?: string | null
          is_featured?: boolean
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          profile_id: string
          platform: string
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          platform: string
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          platform?: string
          url?: string
          position?: number
          created_at?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          id: string
          key: string
          name: string
          description: string | null
          tokens: Json
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          name: string
          description?: string | null
          tokens?: Json
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          name?: string
          description?: string | null
          tokens?: Json
          is_default?: boolean
          created_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          user_id: string
          preferences: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          preferences?: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          id: number
          profile_id: string
          referrer: string | null
          country: string | null
          device: string | null
          browser: string | null
          os: string | null
          created_at: string
        }
        Insert: {
          profile_id: string
          referrer?: string | null
          country?: string | null
          device?: string | null
          browser?: string | null
          os?: string | null
          created_at?: string
        }
        Update: {
          profile_id?: string
          referrer?: string | null
          country?: string | null
          device?: string | null
          browser?: string | null
          os?: string | null
          created_at?: string
        }
        Relationships: []
      }
      link_clicks: {
        Row: {
          id: number
          link_id: string
          profile_id: string
          referrer: string | null
          country: string | null
          device: string | null
          created_at: string
        }
        Insert: {
          link_id: string
          profile_id: string
          referrer?: string | null
          country?: string | null
          device?: string | null
          created_at?: string
        }
        Update: {
          link_id?: string
          profile_id?: string
          referrer?: string | null
          country?: string | null
          device?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      delete_user: {
        Args: Record<string, never>
        Returns: undefined
      }
      username_available: {
        Args: { candidate: string }
        Returns: boolean
      }
      analytics_daily: {
        Args: { p_days?: number }
        Returns: { day: string; views: number; clicks: number }[]
      }
      analytics_top_links: {
        Args: { p_days?: number }
        Returns: { link_id: string; title: string; clicks: number }[]
      }
      analytics_breakdown: {
        Args: { p_days?: number }
        Returns: { kind: string; label: string; count: number }[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type Link = Tables<'links'>
export type SocialLink = Tables<'social_links'>
export type Theme = Tables<'themes'>
