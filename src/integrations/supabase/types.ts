export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          banner_image: string | null
          category_id: string
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          image_url: string | null
          is_virtual: boolean | null
          location: string
          organizer_id: string | null
          slug: string
          start_date: string
          status: string | null
          title: string
          total_registrations: number | null
          total_revenue: number | null
          updated_at: string | null
          virtual_meeting_link: string | null
        }
        Insert: {
          banner_image?: string | null
          category_id: string
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          image_url?: string | null
          is_virtual?: boolean | null
          location: string
          organizer_id?: string | null
          slug: string
          start_date: string
          status?: string | null
          title: string
          total_registrations?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          virtual_meeting_link?: string | null
        }
        Update: {
          banner_image?: string | null
          category_id?: string
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          image_url?: string | null
          is_virtual?: boolean | null
          location?: string
          organizer_id?: string | null
          slug?: string
          start_date?: string
          status?: string | null
          title?: string
          total_registrations?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          virtual_meeting_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          commission_amount: number | null
          created_at: string | null
          event_id: string | null
          id: string
          organizer_amount: number | null
          organizer_transfer_status: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          quantity: number
          ticket_id: string | null
          total_amount: number
          transfer_date: string | null
          transfer_reference: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commission_amount?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          organizer_amount?: number | null
          organizer_transfer_status?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          quantity: number
          ticket_id?: string | null
          total_amount: number
          transfer_date?: string | null
          transfer_reference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commission_amount?: number | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          organizer_amount?: number | null
          organizer_transfer_status?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          quantity?: number
          ticket_id?: string | null
          total_amount?: number
          transfer_date?: string | null
          transfer_reference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: string | null
          id: string
          name: string
          price: number
          quantity: number
          remaining: number
          sale_end: string | null
          sale_start: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          name: string
          price: number
          quantity: number
          remaining: number
          sale_end?: string | null
          sale_start?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          name?: string
          price?: number
          quantity?: number
          remaining?: number
          sale_end?: string | null
          sale_start?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          account_details: Json | null
          amount: number
          created_at: string | null
          event_id: string
          id: string
          organizer_id: string
          reference: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          account_details?: Json | null
          amount: number
          created_at?: string | null
          event_id: string
          id?: string
          organizer_id: string
          reference?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          account_details?: Json | null
          amount?: number
          created_at?: string | null
          event_id?: string
          id?: string
          organizer_id?: string
          reference?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
