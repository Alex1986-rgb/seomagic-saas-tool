-- Remove duplicate task_id entries, keeping only the latest ones
DELETE FROM optimization_jobs a
USING optimization_jobs b
WHERE a.id < b.id 
  AND a.task_id = b.task_id
  AND a.task_id IS NOT NULL;

-- Add unique constraint on task_id
ALTER TABLE optimization_jobs 
ADD CONSTRAINT optimization_jobs_task_id_unique 
UNIQUE (task_id);