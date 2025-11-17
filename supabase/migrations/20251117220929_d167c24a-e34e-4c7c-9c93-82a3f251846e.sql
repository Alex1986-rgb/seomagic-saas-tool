-- Update page_analysis table structure
ALTER TABLE page_analysis 
  DROP COLUMN IF EXISTS analysis_data,
  DROP COLUMN IF EXISTS score,
  ADD COLUMN IF NOT EXISTS audit_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS h1_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS word_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS load_time numeric,
  ADD COLUMN IF NOT EXISTS status_code integer;

-- Update RLS policies for page_analysis
DROP POLICY IF EXISTS "Users can view their own page analysis" ON page_analysis;
DROP POLICY IF EXISTS "Users can insert their own page analysis" ON page_analysis;

CREATE POLICY "Users can view their own page analysis"
  ON page_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own page analysis"
  ON page_analysis FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own page analysis"
  ON page_analysis FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own page analysis"
  ON page_analysis FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_page_analysis_audit_id ON page_analysis(audit_id);
CREATE INDEX IF NOT EXISTS idx_page_analysis_user_id ON page_analysis(user_id);