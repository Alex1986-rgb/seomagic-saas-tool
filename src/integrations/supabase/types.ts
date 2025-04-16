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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
