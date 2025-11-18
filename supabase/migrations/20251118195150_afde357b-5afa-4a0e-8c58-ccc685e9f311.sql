-- Add task_id column to page_analysis table
ALTER TABLE public.page_analysis
ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES public.audit_tasks(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_page_analysis_task_id ON public.page_analysis(task_id);

-- Update existing records to link with audit_tasks through audit_id
UPDATE public.page_analysis pa
SET task_id = (
  SELECT at.id 
  FROM public.audit_tasks at 
  WHERE at.audit_id = pa.audit_id 
  LIMIT 1
)
WHERE pa.task_id IS NULL AND pa.audit_id IS NOT NULL;