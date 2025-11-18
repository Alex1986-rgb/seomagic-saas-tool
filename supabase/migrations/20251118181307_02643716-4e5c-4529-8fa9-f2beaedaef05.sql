-- Sprint 2: Add weighted scoring columns to audit_results
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS seo_score INTEGER;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS technical_score INTEGER;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS content_score INTEGER;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS performance_score INTEGER;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS global_score INTEGER;

-- Add percentage metrics for better insights
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_missing_title NUMERIC(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_missing_h1 NUMERIC(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_missing_description NUMERIC(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_thin_content NUMERIC(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_slow_pages NUMERIC(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_not_indexable NUMERIC(5,2);
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pct_missing_canonical NUMERIC(5,2);

-- Add distribution data for depth and page types
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pages_by_depth JSONB;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS pages_by_type JSONB;
ALTER TABLE audit_results ADD COLUMN IF NOT EXISTS issues_by_severity JSONB;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_page_analysis_depth ON page_analysis(audit_id, depth);
CREATE INDEX IF NOT EXISTS idx_page_analysis_type ON page_analysis(audit_id, page_type);
CREATE INDEX IF NOT EXISTS idx_page_analysis_score_factors ON page_analysis(audit_id, is_indexable, has_canonical, has_thin_content);