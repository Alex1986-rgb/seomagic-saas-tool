-- Add columns for partial audit results support
ALTER TABLE audit_results 
ADD COLUMN IF NOT EXISTS is_partial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS partial_data_note TEXT;

-- Create index for efficient partial results queries
CREATE INDEX IF NOT EXISTS idx_audit_results_partial 
ON audit_results(task_id, is_partial);

-- Enable realtime for page_analysis table only (audit_tasks already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'page_analysis'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE page_analysis;
  END IF;
END $$;