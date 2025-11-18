-- Create url_queue table for micro-batch processing
CREATE TABLE IF NOT EXISTS public.url_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for efficient batch queries
CREATE INDEX IF NOT EXISTS idx_url_queue_task_status ON public.url_queue(task_id, status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_url_queue_pending ON public.url_queue(task_id, status) WHERE status = 'pending';

-- Enable RLS (testing mode - allow all)
ALTER TABLE public.url_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_select" ON public.url_queue FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.url_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.url_queue FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.url_queue FOR DELETE USING (true);

-- Add batch_count to audit_tasks to track invocations
ALTER TABLE public.audit_tasks ADD COLUMN IF NOT EXISTS batch_count INTEGER DEFAULT 0;
ALTER TABLE public.audit_tasks ADD COLUMN IF NOT EXISTS total_urls INTEGER DEFAULT 0;