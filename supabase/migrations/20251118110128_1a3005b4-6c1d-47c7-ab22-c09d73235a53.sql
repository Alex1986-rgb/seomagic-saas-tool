-- ⚠️ TESTING MODE ONLY - Simplify all RLS policies to allow anonymous access
-- These policies allow ALL operations for ALL users (including anonymous)
-- MUST BE REVERTED BEFORE PRODUCTION!

-- ==============================================
-- AUDITS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own audits or public audits" ON public.audits;
DROP POLICY IF EXISTS "Users can insert their own audits or public quick audits" ON public.audits;
DROP POLICY IF EXISTS "Users can update their own audits" ON public.audits;
DROP POLICY IF EXISTS "Users can delete their own audits" ON public.audits;

CREATE POLICY "allow_all_select" ON public.audits FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.audits FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.audits FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.audits FOR DELETE USING (true);

-- ==============================================
-- AUDIT_TASKS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own audit tasks or public tasks" ON public.audit_tasks;
DROP POLICY IF EXISTS "Users can insert their own audit tasks or public quick audits" ON public.audit_tasks;
DROP POLICY IF EXISTS "Users can update their own audit tasks" ON public.audit_tasks;
DROP POLICY IF EXISTS "Users can delete their own audit tasks" ON public.audit_tasks;

CREATE POLICY "allow_all_select" ON public.audit_tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.audit_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.audit_tasks FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.audit_tasks FOR DELETE USING (true);

-- ==============================================
-- AUDIT_RESULTS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own audit results or public results" ON public.audit_results;
DROP POLICY IF EXISTS "Users can insert their own audit results or public results" ON public.audit_results;
DROP POLICY IF EXISTS "Users can update their own audit results" ON public.audit_results;
DROP POLICY IF EXISTS "Users can delete their own audit results" ON public.audit_results;

CREATE POLICY "allow_all_select" ON public.audit_results FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.audit_results FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.audit_results FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.audit_results FOR DELETE USING (true);

-- ==============================================
-- AUDIT_FILES TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own audit files or public" ON public.audit_files;
DROP POLICY IF EXISTS "Users can insert their own audit files or public" ON public.audit_files;
DROP POLICY IF EXISTS "Users can update their own audit files" ON public.audit_files;
DROP POLICY IF EXISTS "Users can delete their own audit files" ON public.audit_files;

CREATE POLICY "allow_all_select" ON public.audit_files FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.audit_files FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.audit_files FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.audit_files FOR DELETE USING (true);

-- ==============================================
-- CRAWLED_PAGES TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own crawled pages or public" ON public.crawled_pages;
DROP POLICY IF EXISTS "Users can insert their own crawled pages or public" ON public.crawled_pages;
DROP POLICY IF EXISTS "Users can update their own crawled pages" ON public.crawled_pages;
DROP POLICY IF EXISTS "Users can delete their own crawled pages" ON public.crawled_pages;

CREATE POLICY "allow_all_select" ON public.crawled_pages FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.crawled_pages FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.crawled_pages FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.crawled_pages FOR DELETE USING (true);

-- ==============================================
-- PAGE_ANALYSIS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own page analysis" ON public.page_analysis;
DROP POLICY IF EXISTS "Users can insert their own page analysis" ON public.page_analysis;
DROP POLICY IF EXISTS "Users can update their own page analysis" ON public.page_analysis;
DROP POLICY IF EXISTS "Users can delete their own page analysis" ON public.page_analysis;

CREATE POLICY "allow_all_select" ON public.page_analysis FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.page_analysis FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.page_analysis FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.page_analysis FOR DELETE USING (true);

-- ==============================================
-- PDF_REPORTS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own PDF reports" ON public.pdf_reports;
DROP POLICY IF EXISTS "Users can insert their own PDF reports" ON public.pdf_reports;
DROP POLICY IF EXISTS "Users can update their own PDF reports" ON public.pdf_reports;
DROP POLICY IF EXISTS "Users can delete their own PDF reports" ON public.pdf_reports;

CREATE POLICY "allow_all_select" ON public.pdf_reports FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.pdf_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.pdf_reports FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.pdf_reports FOR DELETE USING (true);

-- ==============================================
-- OPTIMIZATION_JOBS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own optimization jobs" ON public.optimization_jobs;
DROP POLICY IF EXISTS "Users can insert their own optimization jobs" ON public.optimization_jobs;
DROP POLICY IF EXISTS "Users can update their own optimization jobs" ON public.optimization_jobs;
DROP POLICY IF EXISTS "Users can delete their own optimization jobs" ON public.optimization_jobs;

CREATE POLICY "allow_all_select" ON public.optimization_jobs FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.optimization_jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.optimization_jobs FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.optimization_jobs FOR DELETE USING (true);

-- ==============================================
-- PROFILES TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "allow_all_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.profiles FOR DELETE USING (true);

-- ==============================================
-- USER_ROLES TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

CREATE POLICY "allow_all_select" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.user_roles FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.user_roles FOR DELETE USING (true);

-- ==============================================
-- API_LOGS TABLE
-- ==============================================
DROP POLICY IF EXISTS "Users can view their own api logs" ON public.api_logs;

CREATE POLICY "allow_all_select" ON public.api_logs FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON public.api_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON public.api_logs FOR UPDATE USING (true);
CREATE POLICY "allow_all_delete" ON public.api_logs FOR DELETE USING (true);

-- Add comment to warn about testing mode
COMMENT ON DATABASE postgres IS '⚠️ TESTING MODE - RLS policies are simplified. Must revert before production!';