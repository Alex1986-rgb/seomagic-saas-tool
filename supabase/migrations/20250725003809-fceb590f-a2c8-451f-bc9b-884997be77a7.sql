-- Fix anonymous access policies - restrict all policies to authenticated users only

-- 1. Fix analytics table policies
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users can view analytics for own projects" ON public.analytics;
DROP POLICY IF EXISTS "Users can view their own project analytics" ON public.analytics;

CREATE POLICY "Admins can view all analytics" 
ON public.analytics 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view analytics for own projects" 
ON public.analytics 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = analytics.project_id 
  AND projects.user_id = auth.uid()
));

-- 2. Fix audits table policies
DROP POLICY IF EXISTS "Admins can view all audits" ON public.audits;
DROP POLICY IF EXISTS "Users can view audits for own projects" ON public.audits;
DROP POLICY IF EXISTS "Users can view audits of their projects" ON public.audits;

CREATE POLICY "Admins can view all audits" 
ON public.audits 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view audits for own projects" 
ON public.audits 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = audits.project_id 
  AND projects.user_id = auth.uid()
));

-- 3. Fix crawl_results table policies
DROP POLICY IF EXISTS "Users can view crawl results of their projects" ON public.crawl_results;

CREATE POLICY "Users can view crawl results of their projects" 
ON public.crawl_results 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_results.project_id 
  AND projects.user_id = auth.uid()
));

-- 4. Fix crawl_tasks table policies
DROP POLICY IF EXISTS "Admins can view all crawl tasks" ON public.crawl_tasks;
DROP POLICY IF EXISTS "Users can view crawl tasks for own projects" ON public.crawl_tasks;
DROP POLICY IF EXISTS "Users can update crawl tasks for own projects" ON public.crawl_tasks;
DROP POLICY IF EXISTS "Users can delete crawl tasks for own projects" ON public.crawl_tasks;

CREATE POLICY "Admins can view all crawl tasks" 
ON public.crawl_tasks 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view crawl tasks for own projects" 
ON public.crawl_tasks 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can update crawl tasks for own projects" 
ON public.crawl_tasks 
FOR UPDATE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can delete crawl tasks for own projects" 
ON public.crawl_tasks 
FOR DELETE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

-- 5. Fix keyword_rankings and page_analysis policies
DROP POLICY IF EXISTS "Admins can view all keyword rankings" ON public.keyword_rankings;
DROP POLICY IF EXISTS "Users can view keyword rankings for own audits" ON public.keyword_rankings;

CREATE POLICY "Admins can view all keyword rankings" 
ON public.keyword_rankings 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view keyword rankings for own audits" 
ON public.keyword_rankings 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.audits a 
  JOIN public.projects p ON a.project_id = p.id
  WHERE a.id = keyword_rankings.audit_id 
  AND p.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Admins can view all page analysis" ON public.page_analysis;
DROP POLICY IF EXISTS "Users can view page analysis for own audits" ON public.page_analysis;

CREATE POLICY "Admins can view all page analysis" 
ON public.page_analysis 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view page analysis for own audits" 
ON public.page_analysis 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.audits a 
  JOIN public.projects p ON a.project_id = p.id
  WHERE a.id = page_analysis.audit_id 
  AND p.user_id = auth.uid()
));

-- 6. Fix profiles table policies
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- 7. Fix projects table policies
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;

CREATE POLICY "Admins can view all projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 8. Fix user_roles table policies
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Only admins can delete roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);