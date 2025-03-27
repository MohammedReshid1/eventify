export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          image_url: string
          date: string
          time: string
          venue: string
          organizer_id: string
          status: string
          ticket_price: number
          ticket_quantity: number
          tickets_sold: number
          category: string
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          image_url: string
          date: string
          time: string
          venue: string
          organizer_id: string
          status: string
          ticket_price: number
          ticket_quantity: number
          tickets_sold?: number
          category: string
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          image_url?: string
          date?: string
          time?: string
          venue?: string
          organizer_id?: string
          status?: string
          ticket_price?: number
          ticket_quantity?: number
          tickets_sold?: number
          category?: string
          slug?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string
          full_name: string
          avatar_url: string
          email: string
          role: string
        }
        Insert: {
          id: string
          updated_at?: string
          username: string
          full_name: string
          avatar_url?: string
          email: string
          role?: string
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string
          full_name?: string
          avatar_url?: string
          email?: string
          role?: string
        }
      }
      tickets: {
        Row: {
          id: string
          created_at: string
          event_id: string
          user_id: string
          quantity: number
          total_price: number
          status: string
          ticket_number: string
          qr_code: string
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          user_id: string
          quantity: number
          total_price: number
          status: string
          ticket_number: string
          qr_code: string
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          user_id?: string
          quantity?: number
          total_price?: number
          status?: string
          ticket_number?: string
          qr_code?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_events: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 