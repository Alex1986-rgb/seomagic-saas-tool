-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_data JSONB NOT NULL,
  device_info TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create telegram_integrations table
CREATE TABLE IF NOT EXISTS public.telegram_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_chat_id TEXT UNIQUE NOT NULL,
  telegram_username TEXT,
  connection_token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notify_audit_completed BOOLEAN DEFAULT true,
  notify_optimization_completed BOOLEAN DEFAULT true,
  notify_issues_found BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create slack_integrations table
CREATE TABLE IF NOT EXISTS public.slack_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  channel_name TEXT,
  is_active BOOLEAN DEFAULT true,
  notify_audit_completed BOOLEAN DEFAULT true,
  notify_optimization_completed BOOLEAN DEFAULT true,
  notify_critical_issues BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slack_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for push_subscriptions
CREATE POLICY "Users can view own push subscriptions"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push subscriptions"
  ON public.push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for telegram_integrations
CREATE POLICY "Users can view own telegram integrations"
  ON public.telegram_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own telegram integrations"
  ON public.telegram_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own telegram integrations"
  ON public.telegram_integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own telegram integrations"
  ON public.telegram_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for slack_integrations
CREATE POLICY "Users can view own slack integrations"
  ON public.slack_integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own slack integrations"
  ON public.slack_integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own slack integrations"
  ON public.slack_integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own slack integrations"
  ON public.slack_integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_active ON public.push_subscriptions(user_id, is_active);
CREATE INDEX idx_telegram_integrations_user_id ON public.telegram_integrations(user_id);
CREATE INDEX idx_telegram_integrations_token ON public.telegram_integrations(connection_token);
CREATE INDEX idx_slack_integrations_user_id ON public.slack_integrations(user_id);

-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;