-- Step 1: Fix MIME types in pdf-reports storage bucket
-- Allow both PDF and HTML files to be uploaded

UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['application/pdf', 'text/html', 'application/octet-stream']
WHERE name = 'pdf-reports';

-- Verify the update
SELECT name, allowed_mime_types, public 
FROM storage.buckets 
WHERE name = 'pdf-reports';