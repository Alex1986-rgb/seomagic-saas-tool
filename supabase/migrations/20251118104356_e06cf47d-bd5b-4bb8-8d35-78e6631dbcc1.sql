-- Make user_id nullable in audits table to allow anonymous quick audits
ALTER TABLE public.audits
ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable in audit_tasks table to allow anonymous quick audits
ALTER TABLE public.audit_tasks
ALTER COLUMN user_id DROP NOT NULL;

-- Add comment explaining the nullable user_id
COMMENT ON COLUMN public.audits.user_id IS 'User ID - nullable to allow anonymous quick audits';
COMMENT ON COLUMN public.audit_tasks.user_id IS 'User ID - nullable to allow anonymous quick audits';