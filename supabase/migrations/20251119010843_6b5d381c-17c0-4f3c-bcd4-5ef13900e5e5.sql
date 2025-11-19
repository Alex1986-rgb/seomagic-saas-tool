-- Create shared_estimates table for public estimate sharing
CREATE TABLE shared_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  estimate_data JSONB NOT NULL,
  totals JSONB NOT NULL,
  url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  password_hash TEXT,
  views_count INTEGER DEFAULT 0,
  max_views INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE shared_estimates ENABLE ROW LEVEL SECURITY;

-- Policies for shared_estimates
CREATE POLICY "Users can view their own shared estimates"
  ON shared_estimates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create shared estimates"
  ON shared_estimates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared estimates"
  ON shared_estimates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared estimates"
  ON shared_estimates FOR DELETE
  USING (auth.uid() = user_id);

-- Index for quick token lookups
CREATE INDEX idx_shared_estimates_token ON shared_estimates(share_token) WHERE is_active = true;
CREATE INDEX idx_shared_estimates_user ON shared_estimates(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shared_estimates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shared_estimates_updated_at
  BEFORE UPDATE ON shared_estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_shared_estimates_updated_at();