-- Add unique constraint on task_id in audit_results table
-- This ensures each task can only have one result record
ALTER TABLE audit_results 
ADD CONSTRAINT audit_results_task_id_unique UNIQUE (task_id);