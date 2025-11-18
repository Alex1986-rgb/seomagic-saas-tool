-- Sprint 1: Add depth, normalization, priorities, and extended SEO fields

-- Add depth and parent tracking to url_queue
ALTER TABLE url_queue ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0;
ALTER TABLE url_queue ADD COLUMN IF NOT EXISTS parent_url TEXT;
ALTER TABLE url_queue ADD COLUMN IF NOT EXISTS page_type TEXT; -- 'home', 'category', 'product', 'article', 'other'

-- Create index for efficient depth-based queries
CREATE INDEX IF NOT EXISTS idx_url_queue_depth ON url_queue(task_id, depth, priority DESC);

-- Extend page_analysis with comprehensive SEO signals
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS page_type TEXT;

-- Indexability
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS is_indexable BOOLEAN DEFAULT true;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS robots_meta TEXT;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS x_robots_tag TEXT;

-- Canonical
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS has_canonical BOOLEAN DEFAULT false;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS canonical_points_to_self BOOLEAN;

-- Content structure
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS h2_count INTEGER DEFAULT 0;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS h3_count INTEGER DEFAULT 0;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS h1_text TEXT;

-- Content quality
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS text_html_ratio NUMERIC(5,2);
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS has_thin_content BOOLEAN DEFAULT false;

-- Images
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS missing_alt_images_count INTEGER DEFAULT 0;

-- Technical
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text/html';
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS content_length INTEGER;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS redirect_chain_length INTEGER DEFAULT 0;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS final_url TEXT;

-- Mobile & Performance
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS has_viewport BOOLEAN DEFAULT false;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS ttfb NUMERIC(10,3);

-- Internationalization
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS language_detected TEXT;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS hreflang_tags JSONB;

-- Links
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS internal_links_count INTEGER DEFAULT 0;
ALTER TABLE page_analysis ADD COLUMN IF NOT EXISTS external_links_count INTEGER DEFAULT 0;

-- Add sitemap URL count to audit_tasks for dynamic estimation
ALTER TABLE audit_tasks ADD COLUMN IF NOT EXISTS sitemap_urls_count INTEGER DEFAULT 0;