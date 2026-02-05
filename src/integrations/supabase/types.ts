export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookpi_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          event_type: string
          id: string
          immutable_hash: string
          prev_hash: string | null
          subject_id: string | null
          subject_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          immutable_hash: string
          prev_hash?: string | null
          subject_id?: string | null
          subject_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          immutable_hash?: string
          prev_hash?: string | null
          subject_id?: string | null
          subject_type?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string
          badge_id: string | null
          content: string
          created_at: string
          id: string
          likes_count: number
          post_id: string
          priority_score: number | null
          superlike_count: number
        }
        Insert: {
          author_id: string
          badge_id?: string | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          post_id: string
          priority_score?: number | null
          superlike_count?: number
        }
        Update: {
          author_id?: string
          badge_id?: string | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          post_id?: string
          priority_score?: number | null
          superlike_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      msr_ledger: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          from_user_id: string | null
          hash: string
          id: string
          metadata: Json | null
          prev_hash: string | null
          to_user_id: string | null
          transaction_type: Database["public"]["Enums"]["msr_transaction_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          from_user_id?: string | null
          hash: string
          id?: string
          metadata?: Json | null
          prev_hash?: string | null
          to_user_id?: string | null
          transaction_type: Database["public"]["Enums"]["msr_transaction_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          from_user_id?: string | null
          hash?: string
          id?: string
          metadata?: Json | null
          prev_hash?: string | null
          to_user_id?: string | null
          transaction_type?: Database["public"]["Enums"]["msr_transaction_type"]
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          comments_count: number
          content: string | null
          created_at: string
          curation_status: string | null
          dreamspace_ref_id: string | null
          ethical_score: number | null
          id: string
          is_censored: boolean | null
          kind: string
          likes_count: number
          media_urls: string[] | null
          revenue_creator: number | null
          revenue_platform: number | null
          risk_score: number | null
          shares_count: number
          subscription_price_monthly: number | null
          superlike_count: number
          unlock_price_msr: number | null
          updated_at: string
          visibility_mode: string
          xr_scene_id: string | null
        }
        Insert: {
          author_id: string
          comments_count?: number
          content?: string | null
          created_at?: string
          curation_status?: string | null
          dreamspace_ref_id?: string | null
          ethical_score?: number | null
          id?: string
          is_censored?: boolean | null
          kind?: string
          likes_count?: number
          media_urls?: string[] | null
          revenue_creator?: number | null
          revenue_platform?: number | null
          risk_score?: number | null
          shares_count?: number
          subscription_price_monthly?: number | null
          superlike_count?: number
          unlock_price_msr?: number | null
          updated_at?: string
          visibility_mode?: string
          xr_scene_id?: string | null
        }
        Update: {
          author_id?: string
          comments_count?: number
          content?: string | null
          created_at?: string
          curation_status?: string | null
          dreamspace_ref_id?: string | null
          ethical_score?: number | null
          id?: string
          is_censored?: boolean | null
          kind?: string
          likes_count?: number
          media_urls?: string[] | null
          revenue_creator?: number | null
          revenue_platform?: number | null
          risk_score?: number | null
          shares_count?: number
          subscription_price_monthly?: number | null
          superlike_count?: number
          unlock_price_msr?: number | null
          updated_at?: string
          visibility_mode?: string
          xr_scene_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          digital_dna: Json | null
          display_name: string | null
          id: string
          is_public: boolean
          reputation_score: number
          trust_level: Database["public"]["Enums"]["trust_level"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          digital_dna?: Json | null
          display_name?: string | null
          id?: string
          is_public?: boolean
          reputation_score?: number
          trust_level?: Database["public"]["Enums"]["trust_level"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          digital_dna?: Json | null
          display_name?: string | null
          id?: string
          is_public?: boolean
          reputation_score?: number
          trust_level?: Database["public"]["Enums"]["trust_level"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          is_public: boolean | null
          reputation_score: number | null
          trust_level: Database["public"]["Enums"]["trust_level"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          is_public?: boolean | null
          reputation_score?: number | null
          trust_level?: Database["public"]["Enums"]["trust_level"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          is_public?: boolean | null
          reputation_score?: number | null
          trust_level?: Database["public"]["Enums"]["trust_level"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "archon"
      msr_transaction_type:
        | "DIRECT"
        | "FENIX"
        | "KERNEL"
        | "TRANSFER"
        | "REWARD"
      trust_level: "observer" | "citizen" | "guardian" | "sovereign" | "archon"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "archon"],
      msr_transaction_type: ["DIRECT", "FENIX", "KERNEL", "TRANSFER", "REWARD"],
      trust_level: ["observer", "citizen", "guardian", "sovereign", "archon"],
    },
  },
} as const
