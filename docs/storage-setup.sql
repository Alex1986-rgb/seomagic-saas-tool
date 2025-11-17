-- =============================================
-- Storage Buckets Setup for SEO Market
-- =============================================
-- Execute this in Supabase SQL Editor AFTER creating main tables
-- =============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('reports', 'reports', false, 52428800, ARRAY['application/pdf', 'application/json', 'application/xml']),
  ('exports', 'exports', false, 104857600, ARRAY['application/json', 'text/csv', 'application/zip']),
  ('sitemaps', 'sitemaps', true, 10485760, ARRAY['application/xml', 'text/html'])
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- RLS Policies for Storage Buckets
-- =============================================

-- Reports bucket: Users can upload/read their own reports
CREATE POLICY "Users can upload their own reports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own reports"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own reports"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Exports bucket: Users can upload/read their own exports
CREATE POLICY "Users can upload their own exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read their own exports"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own exports"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Sitemaps bucket: Public read, authenticated write
CREATE POLICY "Anyone can read sitemaps"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sitemaps');

CREATE POLICY "Authenticated users can upload sitemaps"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sitemaps');

CREATE POLICY "Authenticated users can delete sitemaps"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sitemaps');

-- =============================================
-- Verification Query
-- =============================================
-- Run this to verify buckets are created:
SELECT id, name, public, file_size_limit 
FROM storage.buckets 
WHERE id IN ('reports', 'exports', 'sitemaps');
