export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          active_users: number | null
          created_at: string | null
          distribution: Json | null
          id: string
          pages_scanned: number | null
          positions_tracked: number | null
          project_id: string | null
          scan_details: Json | null
          scan_timestamp: string | null
          score: number
          trends: Json | null
          url: string
        }
        Insert: {
          active_users?: number | null
          created_at?: string | null
          distribution?: Json | null
          id?: string
          pages_scanned?: number | null
          positions_tracked?: number | null
          project_id?: string | null
          scan_details?: Json | null
          scan_timestamp?: string | null
          score: number
          trends?: Json | null
          url: string
        }
        Update: {
          active_users?: number | null
          created_at?: string | null
          distribution?: Json | null
          id?: string
          pages_scanned?: number | null
          positions_tracked?: number | null
          project_id?: string | null
          scan_details?: Json | null
          scan_timestamp?: string | null
          score?: number
          trends?: Json | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          created_at: string
          id: string
          issues: Json | null
          page_count: number | null
          project_id: string | null
          recommendations: Json | null
          scan_details: Json | null
          score: number
        }
        Insert: {
          created_at?: string
          id?: string
          issues?: Json | null
          page_count?: number | null
          project_id?: string | null
          recommendations?: Json | null
          scan_details?: Json | null
          score: number
        }
        Update: {
          created_at?: string
          id?: string
          issues?: Json | null
          page_count?: number | null
          project_id?: string | null
          recommendations?: Json | null
          scan_details?: Json | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "audits_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crawl_results: {
        Row: {
          broken_links: Json | null
          created_at: string
          depth_data: Json | null
          duplicate_pages: Json | null
          id: string
          page_types: Json | null
          project_id: string | null
          urls: string[] | null
        }
        Insert: {
          broken_links?: Json | null
          created_at?: string
          depth_data?: Json | null
          duplicate_pages?: Json | null
          id?: string
          page_types?: Json | null
          project_id?: string | null
          urls?: string[] | null
        }
        Update: {
          broken_links?: Json | null
          created_at?: string
          depth_data?: Json | null
          duplicate_pages?: Json | null
          id?: string
          page_types?: Json | null
          project_id?: string | null
          urls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "crawl_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crawl_tasks: {
        Row: {
          estimated_total_pages: number | null
          id: string
          options: Json | null
          pages_scanned: number | null
          progress: number | null
          project_id: string | null
          start_time: string | null
          status: string
          task_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          estimated_total_pages?: number | null
          id?: string
          options?: Json | null
          pages_scanned?: number | null
          progress?: number | null
          project_id?: string | null
          start_time?: string | null
          status?: string
          task_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          estimated_total_pages?: number | null
          id?: string
          options?: Json | null
          pages_scanned?: number | null
          progress?: number | null
          project_id?: string | null
          start_time?: string | null
          status?: string
          task_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "crawl_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_rankings: {
        Row: {
          audit_id: string | null
          created_at: string | null
          id: string
          keyword: string
          position: number | null
          url: string | null
        }
        Insert: {
          audit_id?: string | null
          created_at?: string | null
          id?: string
          keyword: string
          position?: number | null
          url?: string | null
        }
        Update: {
          audit_id?: string | null
          created_at?: string | null
          id?: string
          keyword?: string
          position?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_rankings_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      page_analysis: {
        Row: {
          audit_id: string | null
          created_at: string | null
          h1_count: number | null
          id: string
          image_count: number | null
          load_time: number | null
          meta_description: string | null
          status_code: number | null
          title: string | null
          url: string
          word_count: number | null
        }
        Insert: {
          audit_id?: string | null
          created_at?: string | null
          h1_count?: number | null
          id?: string
          image_count?: number | null
          load_time?: number | null
          meta_description?: string | null
          status_code?: number | null
          title?: string | null
          url: string
          word_count?: number | null
        }
        Update: {
          audit_id?: string | null
          created_at?: string | null
          h1_count?: number | null
          id?: string
          image_count?: number | null
          load_time?: number | null
          meta_description?: string | null
          status_code?: number | null
          title?: string | null
          url?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_analysis_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          settings: Json | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          settings?: Json | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
