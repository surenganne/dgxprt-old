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
      chemical_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      chemicals: {
        Row: {
          cas_number: string | null
          category_id: string | null
          created_at: string
          description: string | null
          handling_precautions: string | null
          hazard_class: Database["public"]["Enums"]["chemical_hazard_class"]
          id: string
          name: string
          status: string
          storage_conditions: string | null
          updated_at: string
        }
        Insert: {
          cas_number?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          handling_precautions?: string | null
          hazard_class?: Database["public"]["Enums"]["chemical_hazard_class"]
          id?: string
          name: string
          status?: string
          storage_conditions?: string | null
          updated_at?: string
        }
        Update: {
          cas_number?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          handling_precautions?: string | null
          hazard_class?: Database["public"]["Enums"]["chemical_hazard_class"]
          id?: string
          name?: string
          status?: string
          storage_conditions?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chemicals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "chemical_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      location_hierarchy: {
        Row: {
          created_at: string
          display_name: string
          id: string
          level_name: string
          level_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          level_name: string
          level_order: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          level_name?: string
          level_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          custom_label: string | null
          description: string | null
          id: string
          location_type: Database["public"]["Enums"]["location_type"]
          name: string
          parent_id: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_label?: string | null
          description?: string | null
          id?: string
          location_type?: Database["public"]["Enums"]["location_type"]
          name: string
          parent_id?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_label?: string | null
          description?: string | null
          id?: string
          location_type?: Database["public"]["Enums"]["location_type"]
          name?: string
          parent_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          has_reset_password: boolean | null
          id: string
          is_admin: boolean | null
          is_owner: boolean | null
          status: string
          temporary_password_hash: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          has_reset_password?: boolean | null
          id: string
          is_admin?: boolean | null
          is_owner?: boolean | null
          status?: string
          temporary_password_hash?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          has_reset_password?: boolean | null
          id?: string
          is_admin?: boolean | null
          is_owner?: boolean | null
          status?: string
          temporary_password_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_owner: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      chemical_hazard_class: "hazardous" | "non_hazardous"
      location_type: "country" | "state" | "district" | "school" | "site"
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
