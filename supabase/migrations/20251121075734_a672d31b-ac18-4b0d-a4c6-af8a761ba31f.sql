-- Make user_id nullable in optimization_jobs table to support anonymous audits
ALTER TABLE optimization_jobs ALTER COLUMN user_id DROP NOT NULL;