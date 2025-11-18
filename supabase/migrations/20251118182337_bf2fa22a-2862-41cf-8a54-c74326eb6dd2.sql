-- Sprint 3: Technical Metrics and Performance

-- Add compression and transfer size tracking to page_analysis
ALTER TABLE page_analysis 
ADD COLUMN IF NOT EXISTS is_compressed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS compression_type TEXT,
ADD COLUMN IF NOT EXISTS transfer_size INTEGER;

-- Add batch performance metrics to audit_tasks
ALTER TABLE audit_tasks
ADD COLUMN IF NOT EXISTS avg_load_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS success_rate NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS redirect_pages_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_pages_count INTEGER DEFAULT 0;

-- Add redirect metrics to audit_results
ALTER TABLE audit_results
ADD COLUMN IF NOT EXISTS pct_pages_with_redirects NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS pct_long_redirect_chains NUMERIC(5,2);

-- Create index for redirect queries
CREATE INDEX IF NOT EXISTS idx_page_analysis_redirects ON page_analysis(redirect_chain_length) WHERE redirect_chain_length > 0;

COMMENT ON COLUMN page_analysis.is_compressed IS 'Whether the page content was compressed during transfer';
COMMENT ON COLUMN page_analysis.compression_type IS 'Type of compression used (gzip, brotli, deflate)';
COMMENT ON COLUMN page_analysis.transfer_size IS 'Size of content during transfer (before decompression)';
COMMENT ON COLUMN audit_tasks.avg_load_time_ms IS 'Average page load time across all pages in milliseconds';
COMMENT ON COLUMN audit_tasks.success_rate IS 'Percentage of successfully loaded pages (status 200)';
COMMENT ON COLUMN audit_tasks.redirect_pages_count IS 'Number of pages with at least one redirect';
COMMENT ON COLUMN audit_tasks.error_pages_count IS 'Number of pages with 4xx or 5xx errors';
COMMENT ON COLUMN audit_results.pct_pages_with_redirects IS 'Percentage of pages that have redirects';
COMMENT ON COLUMN audit_results.pct_long_redirect_chains IS 'Percentage of pages with 3+ redirects in chain';