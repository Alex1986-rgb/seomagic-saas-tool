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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_logs: {
        Row: {
          created_at: string | null
          duration_ms: number | null
          function_name: string
          id: string
          request_data: Json | null
          response_data: Json | null
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_ms?: number | null
          function_name: string
          id?: string
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_ms?: number | null
          function_name?: string
          id?: string
          request_data?: Json | null
          response_data?: Json | null
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_files: {
        Row: {
          audit_id: string | null
          created_at: string | null
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          user_id: string | null
        }
        Insert: {
          audit_id?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          user_id?: string | null
        }
        Update: {
          audit_id?: string | null
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_files_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_results: {
        Row: {
          audit_data: Json | null
          audit_id: string | null
          content_score: number | null
          created_at: string | null
          global_score: number | null
          id: string
          issues_by_severity: Json | null
          issues_count: number | null
          page_count: number | null
          pages_by_depth: Json | null
          pages_by_type: Json | null
          pct_long_redirect_chains: number | null
          pct_missing_canonical: number | null
          pct_missing_description: number | null
          pct_missing_h1: number | null
          pct_missing_title: number | null
          pct_not_indexable: number | null
          pct_pages_with_redirects: number | null
          pct_slow_pages: number | null
          pct_thin_content: number | null
          performance_score: number | null
          score: number | null
          seo_score: number | null
          task_id: string | null
          technical_score: number | null
          user_id: string | null
        }
        Insert: {
          audit_data?: Json | null
          audit_id?: string | null
          content_score?: number | null
          created_at?: string | null
          global_score?: number | null
          id?: string
          issues_by_severity?: Json | null
          issues_count?: number | null
          page_count?: number | null
          pages_by_depth?: Json | null
          pages_by_type?: Json | null
          pct_long_redirect_chains?: number | null
          pct_missing_canonical?: number | null
          pct_missing_description?: number | null
          pct_missing_h1?: number | null
          pct_missing_title?: number | null
          pct_not_indexable?: number | null
          pct_pages_with_redirects?: number | null
          pct_slow_pages?: number | null
          pct_thin_content?: number | null
          performance_score?: number | null
          score?: number | null
          seo_score?: number | null
          task_id?: string | null
          technical_score?: number | null
          user_id?: string | null
        }
        Update: {
          audit_data?: Json | null
          audit_id?: string | null
          content_score?: number | null
          created_at?: string | null
          global_score?: number | null
          id?: string
          issues_by_severity?: Json | null
          issues_count?: number | null
          page_count?: number | null
          pages_by_depth?: Json | null
          pages_by_type?: Json | null
          pct_long_redirect_chains?: number | null
          pct_missing_canonical?: number | null
          pct_missing_description?: number | null
          pct_missing_h1?: number | null
          pct_missing_title?: number | null
          pct_not_indexable?: number | null
          pct_pages_with_redirects?: number | null
          pct_slow_pages?: number | null
          pct_thin_content?: number | null
          performance_score?: number | null
          score?: number | null
          seo_score?: number | null
          task_id?: string | null
          technical_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_results_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_results_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "audit_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_tasks: {
        Row: {
          audit_id: string | null
          avg_load_time_ms: number | null
          batch_count: number | null
          created_at: string | null
          current_url: string | null
          discovered_urls_count: number | null
          discovery_source: string | null
          error_message: string | null
          error_pages_count: number | null
          estimated_pages: number | null
          id: string
          last_discovered_url: string | null
          pages_scanned: number | null
          progress: number | null
          redirect_pages_count: number | null
          sitemap_urls_count: number | null
          stage: string | null
          status: string
          success_rate: number | null
          task_type: string | null
          total_urls: number | null
          updated_at: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          audit_id?: string | null
          avg_load_time_ms?: number | null
          batch_count?: number | null
          created_at?: string | null
          current_url?: string | null
          discovered_urls_count?: number | null
          discovery_source?: string | null
          error_message?: string | null
          error_pages_count?: number | null
          estimated_pages?: number | null
          id?: string
          last_discovered_url?: string | null
          pages_scanned?: number | null
          progress?: number | null
          redirect_pages_count?: number | null
          sitemap_urls_count?: number | null
          stage?: string | null
          status?: string
          success_rate?: number | null
          task_type?: string | null
          total_urls?: number | null
          updated_at?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          audit_id?: string | null
          avg_load_time_ms?: number | null
          batch_count?: number | null
          created_at?: string | null
          current_url?: string | null
          discovered_urls_count?: number | null
          discovery_source?: string | null
          error_message?: string | null
          error_pages_count?: number | null
          estimated_pages?: number | null
          id?: string
          last_discovered_url?: string | null
          pages_scanned?: number | null
          progress?: number | null
          redirect_pages_count?: number | null
          sitemap_urls_count?: number | null
          stage?: string | null
          status?: string
          success_rate?: number | null
          task_type?: string | null
          total_urls?: number | null
          updated_at?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_tasks_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      audits: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          pages_scanned: number | null
          seo_score: number | null
          status: string
          total_pages: number | null
          url: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          pages_scanned?: number | null
          seo_score?: number | null
          status?: string
          total_pages?: number | null
          url: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          pages_scanned?: number | null
          seo_score?: number | null
          status?: string
          total_pages?: number | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crawled_pages: {
        Row: {
          audit_id: string | null
          crawled_at: string | null
          headers: Json | null
          html: string | null
          id: string
          status_code: number | null
          url: string
          user_id: string | null
        }
        Insert: {
          audit_id?: string | null
          crawled_at?: string | null
          headers?: Json | null
          html?: string | null
          id?: string
          status_code?: number | null
          url: string
          user_id?: string | null
        }
        Update: {
          audit_id?: string | null
          crawled_at?: string | null
          headers?: Json | null
          html?: string | null
          id?: string
          status_code?: number | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crawled_pages_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_jobs: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          options: Json | null
          result_data: Json | null
          status: string
          task_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          options?: Json | null
          result_data?: Json | null
          status?: string
          task_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          options?: Json | null
          result_data?: Json | null
          status?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_jobs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "audit_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      page_analysis: {
        Row: {
          audit_id: string | null
          canonical_points_to_self: boolean | null
          canonical_url: string | null
          compression_type: string | null
          content_length: number | null
          content_type: string | null
          created_at: string | null
          depth: number | null
          external_links_count: number | null
          final_url: string | null
          h1_count: number | null
          h1_text: string | null
          h2_count: number | null
          h3_count: number | null
          has_canonical: boolean | null
          has_thin_content: boolean | null
          has_viewport: boolean | null
          hreflang_tags: Json | null
          id: string
          image_count: number | null
          internal_links_count: number | null
          is_compressed: boolean | null
          is_indexable: boolean | null
          language_detected: string | null
          load_time: number | null
          meta_description: string | null
          missing_alt_images_count: number | null
          page_type: string | null
          redirect_chain_length: number | null
          robots_meta: string | null
          status_code: number | null
          text_html_ratio: number | null
          title: string | null
          transfer_size: number | null
          ttfb: number | null
          url: string
          user_id: string | null
          word_count: number | null
          x_robots_tag: string | null
        }
        Insert: {
          audit_id?: string | null
          canonical_points_to_self?: boolean | null
          canonical_url?: string | null
          compression_type?: string | null
          content_length?: number | null
          content_type?: string | null
          created_at?: string | null
          depth?: number | null
          external_links_count?: number | null
          final_url?: string | null
          h1_count?: number | null
          h1_text?: string | null
          h2_count?: number | null
          h3_count?: number | null
          has_canonical?: boolean | null
          has_thin_content?: boolean | null
          has_viewport?: boolean | null
          hreflang_tags?: Json | null
          id?: string
          image_count?: number | null
          internal_links_count?: number | null
          is_compressed?: boolean | null
          is_indexable?: boolean | null
          language_detected?: string | null
          load_time?: number | null
          meta_description?: string | null
          missing_alt_images_count?: number | null
          page_type?: string | null
          redirect_chain_length?: number | null
          robots_meta?: string | null
          status_code?: number | null
          text_html_ratio?: number | null
          title?: string | null
          transfer_size?: number | null
          ttfb?: number | null
          url: string
          user_id?: string | null
          word_count?: number | null
          x_robots_tag?: string | null
        }
        Update: {
          audit_id?: string | null
          canonical_points_to_self?: boolean | null
          canonical_url?: string | null
          compression_type?: string | null
          content_length?: number | null
          content_type?: string | null
          created_at?: string | null
          depth?: number | null
          external_links_count?: number | null
          final_url?: string | null
          h1_count?: number | null
          h1_text?: string | null
          h2_count?: number | null
          h3_count?: number | null
          has_canonical?: boolean | null
          has_thin_content?: boolean | null
          has_viewport?: boolean | null
          hreflang_tags?: Json | null
          id?: string
          image_count?: number | null
          internal_links_count?: number | null
          is_compressed?: boolean | null
          is_indexable?: boolean | null
          language_detected?: string | null
          load_time?: number | null
          meta_description?: string | null
          missing_alt_images_count?: number | null
          page_type?: string | null
          redirect_chain_length?: number | null
          robots_meta?: string | null
          status_code?: number | null
          text_html_ratio?: number | null
          title?: string | null
          transfer_size?: number | null
          ttfb?: number | null
          url?: string
          user_id?: string | null
          word_count?: number | null
          x_robots_tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_analysis_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_reports: {
        Row: {
          company_name: string | null
          created_at: string | null
          downloaded_count: number | null
          file_path: string
          file_size: number | null
          id: string
          last_downloaded_at: string | null
          report_title: string | null
          sections_included: Json | null
          task_id: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          downloaded_count?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          last_downloaded_at?: string | null
          report_title?: string | null
          sections_included?: Json | null
          task_id?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          downloaded_count?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          last_downloaded_at?: string | null
          report_title?: string | null
          sections_included?: Json | null
          task_id?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: []
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
      url_queue: {
        Row: {
          created_at: string | null
          depth: number | null
          error_message: string | null
          id: string
          page_type: string | null
          parent_url: string | null
          priority: number | null
          retry_count: number | null
          status: string | null
          task_id: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          depth?: number | null
          error_message?: string | null
          id?: string
          page_type?: string | null
          parent_url?: string | null
          priority?: number | null
          retry_count?: number | null
          status?: string | null
          task_id?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          depth?: number | null
          error_message?: string | null
          id?: string
          page_type?: string | null
          parent_url?: string | null
          priority?: number | null
          retry_count?: number | null
          status?: string | null
          task_id?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "url_queue_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "audit_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_old_pdf_reports: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
