-- Fix RLS policy for audit_results to allow anonymous users to read public audit results
DROP POLICY IF EXISTS "Users can view their own audit results or public results" ON public.audit_results;

CREATE POLICY "Users can view their own audit results or public results" 
ON public.audit_results 
FOR SELECT 
USING (
  user_id IS NULL  -- Allow everyone to view public audits (user_id is null)
  OR auth.uid() = user_id  -- Allow authenticated users to view their own audits
);

-- Also fix the INSERT policy to allow public audits
DROP POLICY IF EXISTS "Users can insert their own audit results or public results" ON public.audit_results;

CREATE POLICY "Users can insert their own audit results or public results" 
ON public.audit_results 
FOR INSERT 
WITH CHECK (
  user_id IS NULL  -- Allow inserting public audits
  OR auth.uid() = user_id  -- Allow authenticated users to insert their own audits
);

COMMENT ON TABLE public.audit_results IS 'Stores audit results. Supports both authenticated users and anonymous quick audits (user_id=null)';