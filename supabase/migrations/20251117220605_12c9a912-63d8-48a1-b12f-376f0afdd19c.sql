-- Fix security warning: set search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix security warning: set search_path for clean_old_pdf_reports
CREATE OR REPLACE FUNCTION clean_old_pdf_reports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM pdf_reports
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;