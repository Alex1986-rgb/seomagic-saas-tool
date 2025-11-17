# Database Setup Guide

## Overview
This guide walks you through setting up the complete backend database structure for the SEO Market application.

## Prerequisites
- Active Supabase project
- Access to Supabase Dashboard
- Basic SQL knowledge (helpful but not required)

## Step 1: Execute SQL Schema

### Method A: Using Supabase SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `docs/database-schema.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute

### Method B: Using Supabase CLI

```bash
# Make sure you're logged in
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run the migration
supabase db push
```

## Step 2: Create Storage Buckets

After running the SQL script, create the following Storage buckets:

### 1. Reports Bucket
```
Name: reports
Public: No
File size limit: 50MB
Allowed MIME types: application/pdf, application/json, application/xml
```

### 2. Exports Bucket
```
Name: exports
Public: No
File size limit: 100MB
Allowed MIME types: application/json, text/csv, application/zip
```

### 3. Sitemaps Bucket
```
Name: sitemaps
Public: Yes
File size limit: 10MB
Allowed MIME types: application/xml, text/html
```

### How to Create Buckets:

1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Enter bucket name
4. Set public/private access
5. Configure file size limits
6. Add allowed MIME types
7. Click **Create**

## Step 3: Verify Setup

Run these verification queries in SQL Editor:

```sql
-- Check if all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('audit_tasks', 'audit_results', 'optimization_jobs', 'reports', 'api_logs');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('audit_tasks', 'audit_results', 'optimization_jobs', 'reports', 'api_logs');

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('audit_tasks', 'audit_results', 'optimization_jobs', 'reports', 'api_logs');
```

Expected results:
- ✅ 5 tables created
- ✅ RLS enabled on all tables
- ✅ Multiple indexes per table

## Step 4: Configure API Keys

Add the following secrets in Supabase Dashboard:

1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Add these environment variables:

```
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

Optional keys (if using these services):
```
FIRECRAWL_API_KEY=...
PAGESPEED_API_KEY=...
PERPLEXITY_API_KEY=...
```

## Database Schema Overview

### Tables

#### audit_tasks
Stores SEO audit task information and progress
- Primary key: `id` (UUID)
- Foreign key: `user_id` → `auth.users`
- Status tracking with enum type
- Progress percentage (0-100)

#### audit_results
Stores completed audit results and scores
- Primary key: `id` (UUID)
- Foreign key: `task_id` → `audit_tasks`
- JSONB storage for flexible data structure
- Score range: 0-100

#### optimization_jobs
Stores optimization job data and settings
- Primary key: `id` (UUID)
- Foreign keys: `task_id`, `user_id`
- JSONB for options and results
- Cost tracking (decimal)

#### reports
Stores generated report metadata
- Primary key: `id` (UUID)
- Foreign key: `task_id` → `audit_tasks`
- Storage path reference
- Format enum (pdf, json, xml)

#### api_logs
Stores API request/response logs for debugging
- Primary key: `id` (UUID)
- Foreign key: `user_id` (nullable)
- JSONB for request/response data
- Duration tracking in milliseconds

### Security (RLS)

All tables have Row-Level Security enabled:
- **Users can only access their own data**
- Authentication required for all operations
- Cascading deletes protect data integrity

### Indexes

Optimized indexes for common queries:
- User lookups
- Status filtering
- Date-based sorting
- Composite indexes for complex queries

## Troubleshooting

### Issue: "relation already exists"
**Solution:** Tables already created. Skip to Step 2.

### Issue: "permission denied for schema public"
**Solution:** Check you're using correct Supabase credentials.

### Issue: "RLS policies blocking access"
**Solution:** Ensure user is authenticated when testing queries.

### Issue: Storage bucket creation fails
**Solution:** Check project limits and naming conventions.

## Next Steps

After completing database setup:

1. ✅ Test Edge Functions with API client (Postman/Insomnia)
2. ✅ Verify RLS policies with test user account
3. ✅ Test file upload to Storage buckets
4. ✅ Update frontend API integration
5. ✅ Monitor logs in Supabase Dashboard

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Review RLS policies
3. Verify Edge Functions are deployed
4. Check API keys are configured correctly

## Database Maintenance

### Regular Tasks
- Review and archive old audit tasks (>30 days)
- Clean up orphaned storage files
- Monitor database size and performance
- Review API logs for errors

### Cleanup Query Example
```sql
-- Delete audit tasks older than 30 days
DELETE FROM public.audit_tasks 
WHERE created_at < NOW() - INTERVAL '30 days' 
AND status IN ('completed', 'failed', 'cancelled');
```
