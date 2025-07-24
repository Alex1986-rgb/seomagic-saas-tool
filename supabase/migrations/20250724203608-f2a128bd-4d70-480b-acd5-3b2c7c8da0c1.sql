-- Fix critical security vulnerabilities

-- 1. Add RLS policies for crawl_tasks table (currently has no RLS policies)
ALTER TABLE public.crawl_tasks ENABLE ROW LEVEL SECURITY;

-- Users can only view/manage crawl tasks for their own projects
CREATE POLICY "Users can view crawl tasks for own projects" 
ON public.crawl_tasks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can insert crawl tasks for own projects" 
ON public.crawl_tasks 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can update crawl tasks for own projects" 
ON public.crawl_tasks 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Users can delete crawl tasks for own projects" 
ON public.crawl_tasks 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = crawl_tasks.project_id 
  AND projects.user_id = auth.uid()
));

-- Admins can view all crawl tasks
CREATE POLICY "Admins can view all crawl tasks" 
ON public.crawl_tasks 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Add RLS policies for user_roles table (currently has no RLS policies - CRITICAL!)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only users can view their own roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only admins can assign roles (prevent privilege escalation)
CREATE POLICY "Only admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix database functions with insecure search paths
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. Remove overly permissive policies on sensitive tables
-- Remove the "true" policy on keyword_rankings that allows anyone to read
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.keyword_rankings;

-- Add proper policy for keyword_rankings
CREATE POLICY "Users can view keyword rankings for own audits" 
ON public.keyword_rankings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.audits a 
  JOIN public.projects p ON a.project_id = p.id
  WHERE a.id = keyword_rankings.audit_id 
  AND p.user_id = auth.uid()
));

-- Remove the "true" policy on page_analysis that allows anyone to read
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.page_analysis;

-- Add proper policy for page_analysis
CREATE POLICY "Users can view page analysis for own audits" 
ON public.page_analysis 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.audits a 
  JOIN public.projects p ON a.project_id = p.id
  WHERE a.id = page_analysis.audit_id 
  AND p.user_id = auth.uid()
));

-- Add admin access to sensitive tables
CREATE POLICY "Admins can view all keyword rankings" 
ON public.keyword_rankings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all page analysis" 
ON public.page_analysis 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));