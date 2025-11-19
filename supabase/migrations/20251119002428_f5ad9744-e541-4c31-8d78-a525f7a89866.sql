-- Add notification settings to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_audit_completed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_optimization BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_marketing BOOLEAN DEFAULT false;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES audit_tasks(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('audit_completed', 'optimization_completed', 'marketing', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(user_id, read) WHERE read = false;

-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cleanup-old-data daily at 3 AM
SELECT cron.schedule(
  'cleanup-old-audit-data',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url:='https://dllusofuxonaemrttmwl.supabase.co/functions/v1/cleanup-old-data',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbHVzb2Z1eG9uYWVtcnR0bXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDQ3MzgsImV4cCI6MjA3ODk4MDczOH0.aw8v7TTY2rgYnzDPC5az95i1vkUpQFzrGr7bIsojYik"}'::jsonb,
    body:='{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);

-- Update cleanup-stuck-tasks to run hourly
SELECT cron.schedule(
  'cleanup-stuck-tasks',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url:='https://dllusofuxonaemrttmwl.supabase.co/functions/v1/cleanup-stuck-tasks',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbHVzb2Z1eG9uYWVtcnR0bXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDQ3MzgsImV4cCI6MjA3ODk4MDczOH0.aw8v7TTY2rgYnzDPC5az95i1vkUpQFzrGr7bIsojYik"}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;
  $$
);