-- Allow public quick audits (without user_id)
-- Update RLS policies for audits table
DROP POLICY IF EXISTS "Users can insert their own audits" ON public.audits;
CREATE POLICY "Users can insert their own audits or public quick audits" 
ON public.audits 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

-- Update RLS policies for audit_tasks table
DROP POLICY IF EXISTS "Users can insert their own audit tasks" ON public.audit_tasks;
CREATE POLICY "Users can insert their own audit tasks or public quick audits" 
ON public.audit_tasks 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

-- Allow viewing public audits
DROP POLICY IF EXISTS "Users can view their own audits" ON public.audits;
CREATE POLICY "Users can view their own audits or public audits" 
ON public.audits 
FOR SELECT 
USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Allow viewing public audit tasks
DROP POLICY IF EXISTS "Users can view their own audit tasks" ON public.audit_tasks;
CREATE POLICY "Users can view their own audit tasks or public tasks" 
ON public.audit_tasks 
FOR SELECT 
USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Allow viewing public audit results
DROP POLICY IF EXISTS "Users can view their own audit results" ON public.audit_results;
CREATE POLICY "Users can view their own audit results or public results" 
ON public.audit_results 
FOR SELECT 
USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Allow inserting public audit results
DROP POLICY IF EXISTS "Users can insert their own audit results" ON public.audit_results;
CREATE POLICY "Users can insert their own audit results or public results" 
ON public.audit_results 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);