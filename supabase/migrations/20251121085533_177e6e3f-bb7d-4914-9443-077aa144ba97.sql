-- Ensure user_id is nullable in pdf_reports for anonymous audits
ALTER TABLE pdf_reports 
ALTER COLUMN user_id DROP NOT NULL;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_pdf_reports_task_id ON pdf_reports(task_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_user_id ON pdf_reports(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pdf_reports_created_at ON pdf_reports(created_at DESC);

-- Add function to increment download count
CREATE OR REPLACE FUNCTION increment_pdf_download_count(report_task_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE pdf_reports 
  SET 
    downloaded_count = COALESCE(downloaded_count, 0) + 1,
    last_downloaded_at = NOW()
  WHERE task_id = report_task_id;
END;
$$;

COMMENT ON FUNCTION increment_pdf_download_count IS 'Increments download count and updates last download timestamp for PDF reports';
