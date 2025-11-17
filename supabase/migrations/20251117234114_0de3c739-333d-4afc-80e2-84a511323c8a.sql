-- Create table for storing crawled HTML pages
CREATE TABLE IF NOT EXISTS public.crawled_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  user_id UUID,
  url TEXT NOT NULL,
  html TEXT,
  headers JSONB,
  status_code INTEGER,
  crawled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(audit_id, url)
);

-- Create table for generated audit files
CREATE TABLE IF NOT EXISTS public.audit_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
  user_id UUID,
  file_type TEXT NOT NULL, -- 'sitemap_xml', 'audit_pdf', 'data_json', 'html_archive'
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.crawled_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for crawled_pages
CREATE POLICY "Users can view their own crawled pages or public"
ON public.crawled_pages FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own crawled pages or public"
ON public.crawled_pages FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own crawled pages"
ON public.crawled_pages FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crawled pages"
ON public.crawled_pages FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for audit_files
CREATE POLICY "Users can view their own audit files or public"
ON public.audit_files FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own audit files or public"
ON public.audit_files FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own audit files"
ON public.audit_files FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audit files"
ON public.audit_files FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for audit reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('audit-reports', 'audit-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audit reports
CREATE POLICY "Public can view audit reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'audit-reports');

CREATE POLICY "Users can upload audit reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audit-reports');

CREATE POLICY "Users can update their own audit reports"
ON storage.objects FOR UPDATE
USING (bucket_id = 'audit-reports');

CREATE POLICY "Users can delete their own audit reports"
ON storage.objects FOR DELETE
USING (bucket_id = 'audit-reports');