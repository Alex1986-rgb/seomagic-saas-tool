-- Enable realtime updates for audit_tasks table
ALTER TABLE public.audit_tasks REPLICA IDENTITY FULL;

-- Add the table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_tasks;

-- Add columns for tracking URL discovery progress
ALTER TABLE public.audit_tasks 
ADD COLUMN IF NOT EXISTS discovery_source TEXT,
ADD COLUMN IF NOT EXISTS discovered_urls_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_discovered_url TEXT;