-- Fix incorrect foreign key constraint
ALTER TABLE public.page_analysis 
DROP CONSTRAINT IF EXISTS page_analysis_audit_id_fkey;

-- Create correct foreign key constraint
ALTER TABLE public.page_analysis 
ADD CONSTRAINT page_analysis_audit_id_fkey 
FOREIGN KEY (audit_id) 
REFERENCES public.audits(id) 
ON DELETE CASCADE;

-- Clean up stuck tasks
UPDATE audit_tasks 
SET status = 'failed', 
    error_message = 'Foreign key constraint error - fixed, please retry audit',
    updated_at = NOW()
WHERE status = 'processing' 
AND updated_at < NOW() - INTERVAL '1 hour';