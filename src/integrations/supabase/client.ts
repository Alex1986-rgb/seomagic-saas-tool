
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wjrcutrjltukskwicjnx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcmN1dHJqbHR1a3Nrd2ljam54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjcxMjcsImV4cCI6MjA2MDM0MzEyN30.hrJtobLOHRl4_pD_w8805EnZhJraufDgXtm9JdYOVIY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
