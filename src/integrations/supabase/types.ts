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
      contribution_accounts: {
        Row: {
          bookpi_anchor_id: string | null
          contribution_type: Database["public"]["Enums"]["contribution_type"]
          created_at: string
          description: string | null
          id: string
          msr_anchor_hash: string | null
          user_id: string
          verified_by: string | null
          weight: number
        }
        Insert: {
          bookpi_anchor_id?: string | null
          contribution_type: Database["public"]["Enums"]["contribution_type"]
          created_at?: string
          description?: string | null
          id?: string
          msr_anchor_hash?: string | null
          user_id: string
          verified_by?: string | null
          weight?: number
        }
        Update: {
          bookpi_anchor_id?: string | null
          contribution_type?: Database["public"]["Enums"]["contribution_type"]
          created_at?: string
          description?: string | null
          id?: string
          msr_anchor_hash?: string | null
          user_id?: string
          verified_by?: string | null
          weight?: number
        }
        Relationships: []
      }
      economy_pools: {
        Row: {
          balance_contribution_points: number | null
          balance_msr_internal: number | null
          balance_usage_credits: number | null
          created_at: string
          description: string | null
          display_name: string
          distribution_policy: Json | null
          id: string
          last_distribution_at: string | null
          updated_at: string
        }
        Insert: {
          balance_contribution_points?: number | null
          balance_msr_internal?: number | null
          balance_usage_credits?: number | null
          created_at?: string
          description?: string | null
          display_name: string
          distribution_policy?: Json | null
          id: string
          last_distribution_at?: string | null
          updated_at?: string
        }
        Update: {
          balance_contribution_points?: number | null
          balance_msr_internal?: number | null
          balance_usage_credits?: number | null
          created_at?: string
          description?: string | null
          display_name?: string
          distribution_policy?: Json | null
          id?: string
          last_distribution_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      internal_ledger: {
        Row: {
          amount: number
          bookpi_anchor_id: string | null
          created_at: string
          from_account: string
          id: string
          metadata: Json | null
          msr_block_index: number | null
          operation: Database["public"]["Enums"]["ledger_operation"]
          policy_id: string | null
          reason: string
          to_account: string
          unit: Database["public"]["Enums"]["ledger_unit"]
        }
        Insert: {
          amount: number
          bookpi_anchor_id?: string | null
          created_at?: string
          from_account: string
          id?: string
          metadata?: Json | null
          msr_block_index?: number | null
          operation: Database["public"]["Enums"]["ledger_operation"]
          policy_id?: string | null
          reason: string
          to_account: string
          unit: Database["public"]["Enums"]["ledger_unit"]
        }
        Update: {
          amount?: number
          bookpi_anchor_id?: string | null
          created_at?: string
          from_account?: string
          id?: string
          metadata?: Json | null
          msr_block_index?: number | null
          operation?: Database["public"]["Enums"]["ledger_operation"]
          policy_id?: string | null
          reason?: string
          to_account?: string
          unit?: Database["public"]["Enums"]["ledger_unit"]
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_features: {
        Row: {
          can_access_guardian_tools: boolean
          can_access_institutional_apis: boolean
          can_create_channels: boolean
          can_moderate: boolean
          can_stream_hd: boolean
          max_dreamspaces: number
          media_upload_limit_mb: number
          monthly_usage_credits: number
          storage_quota_mb: number
          streaming_minutes_monthly: number
          tier: Database["public"]["Enums"]["membership_tier"]
          video_duration_max_seconds: number
        }
        Insert: {
          can_access_guardian_tools?: boolean
          can_access_institutional_apis?: boolean
          can_create_channels?: boolean
          can_moderate?: boolean
          can_stream_hd?: boolean
          max_dreamspaces: number
          media_upload_limit_mb: number
          monthly_usage_credits: number
          storage_quota_mb: number
          streaming_minutes_monthly: number
          tier: Database["public"]["Enums"]["membership_tier"]
          video_duration_max_seconds: number
        }
        Update: {
          can_access_guardian_tools?: boolean
          can_access_institutional_apis?: boolean
          can_create_channels?: boolean
          can_moderate?: boolean
          can_stream_hd?: boolean
          max_dreamspaces?: number
          media_upload_limit_mb?: number
          monthly_usage_credits?: number
          storage_quota_mb?: number
          streaming_minutes_monthly?: number
          tier?: Database["public"]["Enums"]["membership_tier"]
          video_duration_max_seconds?: number
        }
        Relationships: []
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
      notification_preferences: {
        Row: {
          achievement_enabled: boolean | null
          comment_enabled: boolean | null
          created_at: string
          dnd_end: string | null
          dnd_start: string | null
          do_not_disturb: boolean | null
          dreamspace_enabled: boolean | null
          follow_enabled: boolean | null
          id: string
          isabella_enabled: boolean | null
          like_enabled: boolean | null
          live_enabled: boolean | null
          mention_enabled: boolean | null
          sound_enabled: boolean | null
          sound_volume: number | null
          superlike_enabled: boolean | null
          system_enabled: boolean | null
          transaction_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_enabled?: boolean | null
          comment_enabled?: boolean | null
          created_at?: string
          dnd_end?: string | null
          dnd_start?: string | null
          do_not_disturb?: boolean | null
          dreamspace_enabled?: boolean | null
          follow_enabled?: boolean | null
          id?: string
          isabella_enabled?: boolean | null
          like_enabled?: boolean | null
          live_enabled?: boolean | null
          mention_enabled?: boolean | null
          sound_enabled?: boolean | null
          sound_volume?: number | null
          superlike_enabled?: boolean | null
          system_enabled?: boolean | null
          transaction_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_enabled?: boolean | null
          comment_enabled?: boolean | null
          created_at?: string
          dnd_end?: string | null
          dnd_start?: string | null
          do_not_disturb?: boolean | null
          dreamspace_enabled?: boolean | null
          follow_enabled?: boolean | null
          id?: string
          isabella_enabled?: boolean | null
          like_enabled?: boolean | null
          live_enabled?: boolean | null
          mention_enabled?: boolean | null
          sound_enabled?: boolean | null
          sound_volume?: number | null
          superlike_enabled?: boolean | null
          system_enabled?: boolean | null
          transaction_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          id: string
          image_url: string | null
          is_read: boolean
          metadata: Json | null
          read_at: string | null
          show_toast: boolean
          sound_id: string | null
          target_id: string | null
          target_type: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          urgency: Database["public"]["Enums"]["notification_urgency"]
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean
          metadata?: Json | null
          read_at?: string | null
          show_toast?: boolean
          sound_id?: string | null
          target_id?: string | null
          target_type?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          urgency?: Database["public"]["Enums"]["notification_urgency"]
          user_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_read?: boolean
          metadata?: Json | null
          read_at?: string | null
          show_toast?: boolean
          sound_id?: string | null
          target_id?: string | null
          target_type?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          urgency?: Database["public"]["Enums"]["notification_urgency"]
          user_id?: string
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
      user_memberships: {
        Row: {
          auto_renew: boolean | null
          can_access_guardian_tools: boolean | null
          can_create_channels: boolean | null
          can_moderate: boolean | null
          created_at: string
          expires_at: string | null
          external_subscription_id: string | null
          id: string
          institutional_org_name: string | null
          max_dreamspaces: number | null
          started_at: string
          storage_quota_mb: number | null
          streaming_minutes_monthly: number | null
          tier: Database["public"]["Enums"]["membership_tier"]
          updated_at: string
          usage_credits_granted: number | null
          usage_credits_remaining: number | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          can_access_guardian_tools?: boolean | null
          can_create_channels?: boolean | null
          can_moderate?: boolean | null
          created_at?: string
          expires_at?: string | null
          external_subscription_id?: string | null
          id?: string
          institutional_org_name?: string | null
          max_dreamspaces?: number | null
          started_at?: string
          storage_quota_mb?: number | null
          streaming_minutes_monthly?: number | null
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          usage_credits_granted?: number | null
          usage_credits_remaining?: number | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          can_access_guardian_tools?: boolean | null
          can_create_channels?: boolean | null
          can_moderate?: boolean | null
          created_at?: string
          expires_at?: string | null
          external_subscription_id?: string | null
          id?: string
          institutional_org_name?: string | null
          max_dreamspaces?: number | null
          started_at?: string
          storage_quota_mb?: number | null
          streaming_minutes_monthly?: number | null
          tier?: Database["public"]["Enums"]["membership_tier"]
          updated_at?: string
          usage_credits_granted?: number | null
          usage_credits_remaining?: number | null
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
      calculate_contribution_score: {
        Args: { p_user_id: string }
        Returns: number
      }
      check_membership_eligibility: {
        Args: {
          p_tier: Database["public"]["Enums"]["membership_tier"]
          p_user_id: string
        }
        Returns: Json
      }
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
      contribution_type:
        | "content_creation"
        | "moderation"
        | "guardian_duty"
        | "research"
        | "infra_support"
        | "education"
        | "community_support"
        | "protocol_participation"
      ledger_operation:
        | "mint"
        | "burn"
        | "transfer"
        | "reward"
        | "consume"
        | "refund"
      ledger_unit:
        | "usage_credit"
        | "contribution_point"
        | "msr_internal"
        | "governance_token"
      membership_tier: "free" | "creator" | "guardian" | "institutional"
      msr_transaction_type:
        | "DIRECT"
        | "FENIX"
        | "KERNEL"
        | "TRANSFER"
        | "REWARD"
      notification_type:
        | "like"
        | "superlike"
        | "comment"
        | "follow"
        | "mention"
        | "transaction"
        | "achievement"
        | "dreamspace"
        | "live"
        | "system"
        | "isabella"
      notification_urgency: "low" | "normal" | "high" | "critical"
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
      contribution_type: [
        "content_creation",
        "moderation",
        "guardian_duty",
        "research",
        "infra_support",
        "education",
        "community_support",
        "protocol_participation",
      ],
      ledger_operation: [
        "mint",
        "burn",
        "transfer",
        "reward",
        "consume",
        "refund",
      ],
      ledger_unit: [
        "usage_credit",
        "contribution_point",
        "msr_internal",
        "governance_token",
      ],
      membership_tier: ["free", "creator", "guardian", "institutional"],
      msr_transaction_type: ["DIRECT", "FENIX", "KERNEL", "TRANSFER", "REWARD"],
      notification_type: [
        "like",
        "superlike",
        "comment",
        "follow",
        "mention",
        "transaction",
        "achievement",
        "dreamspace",
        "live",
        "system",
        "isabella",
      ],
      notification_urgency: ["low", "normal", "high", "critical"],
      trust_level: ["observer", "citizen", "guardian", "sovereign", "archon"],
    },
  },
} as const
