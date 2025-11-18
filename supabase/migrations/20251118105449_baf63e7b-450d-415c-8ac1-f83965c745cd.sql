-- Make user_id nullable in audit_results table to allow anonymous quick audits
ALTER TABLE public.audit_results
ALTER COLUMN user_id DROP NOT NULL;

-- Add comment explaining the nullable user_id
COMMENT ON COLUMN public.audit_results.user_id IS 'User ID - nullable to allow anonymous quick audits';