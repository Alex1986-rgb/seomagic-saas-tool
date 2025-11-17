-- =============================================
-- SEO Market Backend Database Schema
-- =============================================
-- Execute this script in Supabase SQL Editor
-- to create all necessary tables, RLS policies, and indexes
-- =============================================

-- Create enum types for statuses
CREATE TYPE audit_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE audit_type AS ENUM ('quick', 'deep');
CREATE TYPE optimization_status AS ENUM ('pending', 'running', 'completed', 'failed');
CREATE TYPE report_format AS ENUM ('pdf', 'json', 'xml');

-- =============================================
-- Table: audit_tasks
-- =============================================
CREATE TABLE public.audit_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    status audit_status NOT NULL DEFAULT 'queued',
    task_type audit_type NOT NULL DEFAULT 'quick',
    pages_scanned INTEGER DEFAULT 0,
    estimated_pages INTEGER DEFAULT 0,
    current_url TEXT,
    stage TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_tasks
CREATE POLICY "Users can view their own audit tasks"
    ON public.audit_tasks
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own audit tasks"
    ON public.audit_tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audit tasks"
    ON public.audit_tasks
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audit tasks"
    ON public.audit_tasks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for audit_tasks
CREATE INDEX idx_audit_tasks_user_id ON public.audit_tasks(user_id);
CREATE INDEX idx_audit_tasks_status ON public.audit_tasks(status);
CREATE INDEX idx_audit_tasks_created_at ON public.audit_tasks(created_at DESC);
CREATE INDEX idx_audit_tasks_user_status ON public.audit_tasks(user_id, status);

-- =============================================
-- Table: audit_results
-- =============================================
CREATE TABLE public.audit_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
    audit_data JSONB NOT NULL DEFAULT '{}',
    score INTEGER CHECK (score >= 0 AND score <= 100),
    page_count INTEGER DEFAULT 0,
    issues_count JSONB DEFAULT '{"critical": 0, "important": 0, "minor": 0}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for audit_results
CREATE POLICY "Users can view their own audit results"
    ON public.audit_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.audit_tasks
            WHERE audit_tasks.id = audit_results.task_id
            AND audit_tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own audit results"
    ON public.audit_results
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.audit_tasks
            WHERE audit_tasks.id = audit_results.task_id
            AND audit_tasks.user_id = auth.uid()
        )
    );

-- Indexes for audit_results
CREATE INDEX idx_audit_results_task_id ON public.audit_results(task_id);
CREATE INDEX idx_audit_results_created_at ON public.audit_results(created_at DESC);
CREATE INDEX idx_audit_results_score ON public.audit_results(score);

-- =============================================
-- Table: optimization_jobs
-- =============================================
CREATE TABLE public.optimization_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status optimization_status NOT NULL DEFAULT 'pending',
    options JSONB NOT NULL DEFAULT '{}',
    result_data JSONB DEFAULT '{}',
    cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.optimization_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for optimization_jobs
CREATE POLICY "Users can view their own optimization jobs"
    ON public.optimization_jobs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own optimization jobs"
    ON public.optimization_jobs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own optimization jobs"
    ON public.optimization_jobs
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Indexes for optimization_jobs
CREATE INDEX idx_optimization_jobs_user_id ON public.optimization_jobs(user_id);
CREATE INDEX idx_optimization_jobs_task_id ON public.optimization_jobs(task_id);
CREATE INDEX idx_optimization_jobs_status ON public.optimization_jobs(status);
CREATE INDEX idx_optimization_jobs_created_at ON public.optimization_jobs(created_at DESC);

-- =============================================
-- Table: reports
-- =============================================
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.audit_tasks(id) ON DELETE CASCADE,
    format report_format NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports
CREATE POLICY "Users can view their own reports"
    ON public.reports
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.audit_tasks
            WHERE audit_tasks.id = reports.task_id
            AND audit_tasks.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own reports"
    ON public.reports
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.audit_tasks
            WHERE audit_tasks.id = reports.task_id
            AND audit_tasks.user_id = auth.uid()
        )
    );

-- Indexes for reports
CREATE INDEX idx_reports_task_id ON public.reports(task_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_format ON public.reports(format);

-- =============================================
-- Table: api_logs
-- =============================================
CREATE TABLE public.api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    function_name TEXT NOT NULL,
    request_data JSONB DEFAULT '{}',
    response_data JSONB DEFAULT '{}',
    status_code INTEGER,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_logs
CREATE POLICY "Users can view their own logs"
    ON public.api_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- Indexes for api_logs
CREATE INDEX idx_api_logs_user_id ON public.api_logs(user_id);
CREATE INDEX idx_api_logs_function_name ON public.api_logs(function_name);
CREATE INDEX idx_api_logs_created_at ON public.api_logs(created_at DESC);
CREATE INDEX idx_api_logs_status_code ON public.api_logs(status_code);

-- =============================================
-- Function: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_audit_tasks_updated_at
    BEFORE UPDATE ON public.audit_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_optimization_jobs_updated_at
    BEFORE UPDATE ON public.optimization_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Storage Buckets Setup Instructions
-- =============================================
-- After running this script, create the following Storage buckets in Supabase Dashboard:

-- 1. Bucket: reports
--    - Public: No
--    - File size limit: 50MB
--    - Allowed MIME types: application/pdf, application/json, application/xml

-- 2. Bucket: exports  
--    - Public: No
--    - File size limit: 100MB
--    - Allowed MIME types: application/json, text/csv, application/zip

-- 3. Bucket: sitemaps
--    - Public: Yes
--    - File size limit: 10MB
--    - Allowed MIME types: application/xml, text/html

-- =============================================
-- Storage RLS Policies
-- =============================================
-- Execute these after creating the buckets:

-- Reports bucket policies
CREATE POLICY "Users can upload their own reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own reports"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Exports bucket policies
CREATE POLICY "Users can upload their own exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'exports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'exports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Sitemaps bucket policies (public read)
CREATE POLICY "Anyone can read sitemaps"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sitemaps');

CREATE POLICY "Authenticated users can upload sitemaps"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sitemaps');

-- =============================================
-- Comments for documentation
-- =============================================
COMMENT ON TABLE public.audit_tasks IS 'Stores SEO audit task information and progress';
COMMENT ON TABLE public.audit_results IS 'Stores completed audit results and scores';
COMMENT ON TABLE public.optimization_jobs IS 'Stores optimization job data and settings';
COMMENT ON TABLE public.reports IS 'Stores generated report metadata and storage paths';
COMMENT ON TABLE public.api_logs IS 'Stores API request/response logs for debugging';

-- =============================================
-- Verification Queries
-- =============================================
-- Run these to verify the setup:

-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('audit_tasks', 'audit_results', 'optimization_jobs', 'reports', 'api_logs');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('audit_tasks', 'audit_results', 'optimization_jobs', 'reports', 'api_logs');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('audit_tasks', 'audit_results', 'optimization_jobs', 'reports', 'api_logs');
