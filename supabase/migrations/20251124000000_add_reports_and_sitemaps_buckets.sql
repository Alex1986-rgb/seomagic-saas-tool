-- Create the storage buckets that edge functions rely on but that were never
-- provisioned. Without them:
--   * report-generate  -> storage.from('reports')  upload fails
--   * sitemap-export    -> storage.from('sitemaps') upload fails
--   * health-check      -> storage.from('reports')  list fails (reports 'error')
--
-- All writes happen from edge functions using the service-role key, which
-- bypasses RLS, so no per-user object policies are required here.

-- Private bucket for generated JSON/XML reports (downloads brokered by the
-- report-download edge function via the service role).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports',
  false,
  10485760, -- 10MB
  ARRAY['application/json', 'application/xml', 'text/xml', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Public bucket for exported sitemaps (sitemap-export calls getPublicUrl and
-- sitemaps are intended to be publicly fetchable by search engines).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sitemaps',
  'sitemaps',
  true,
  10485760, -- 10MB
  ARRAY['application/xml', 'text/xml', 'text/html', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read objects from the public sitemaps bucket.
DROP POLICY IF EXISTS "Public can read sitemaps" ON storage.objects;
CREATE POLICY "Public can read sitemaps"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'sitemaps');
