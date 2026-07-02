import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          naam: string | null
          avatar_url: string | null
          stad: string | null
          bio: string | null
          verified: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          naam?: string | null
          avatar_url?: string | null
          stad?: string | null
          bio?: string | null
          verified?: boolean
        }
        Update: {
          naam?: string | null
          avatar_url?: string | null
          stad?: string | null
          bio?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          titel: string
          beschrijving: string | null
          prijs: number
          maat: string
          conditie: string
          categorie: string
          subcategorie: string | null
          merk: string | null
          foto_urls: string[]
          likes: number
          actief: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          titel: string
          beschrijving?: string | null
          prijs: number
          maat: string
          conditie: string
          categorie: string
          subcategorie?: string | null
          merk?: string | null
          foto_urls?: string[]
          likes?: number
          actief?: boolean
        }
        Update: {
          titel?: string
          beschrijving?: string | null
          prijs?: number
          maat?: string
          conditie?: string
          categorie?: string
          foto_urls?: string[]
          actief?: boolean
        }
      }
      children: {
        Row: {
          id: string
          user_id: string
          naam: string | null
          geboortedatum: string
          lengte: number | null
          maat: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          naam?: string | null
          geboortedatum: string
          lengte?: number | null
          maat?: string | null
        }
        Update: {
          naam?: string | null
          geboortedatum?: string
          lengte?: number | null
          maat?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          listing_id: string
        }
        Update: Record<string, never>
      }
    }
  }
}
