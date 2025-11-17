# Backend Integration Guide

## Overview
This guide explains how to integrate the frontend with the Supabase Edge Functions backend.

## Architecture

### Before (Old Architecture)
```
Frontend → Direct HTTP calls → Mock/External APIs
```

### After (New Architecture)
```
Frontend → Supabase Services → Edge Functions → PostgreSQL/Storage
```

## Service Layer

### 1. Audit Service (`src/api/services/auditService.ts`)

Handles all audit-related operations:

```typescript
import { auditService } from '@/api/services/auditService';

// Start an audit
const result = await auditService.startAudit(url, {
  maxPages: 10000,
  type: 'quick' // or 'deep'
});

// Get audit status
const status = await auditService.getAuditStatus(taskId);

// Cancel audit
const cancelled = await auditService.cancelAudit(taskId);
```

**Edge Functions Used:**
- `audit-start` - Initiates crawling and creates task
- `audit-status` - Returns current progress
- `audit-cancel` - Stops running audit

### 2. Optimization Service (`src/api/services/optimizationService.ts`)

Handles optimization operations:

```typescript
import { optimizationService } from '@/api/services/optimizationService';

// Get optimization cost
const cost = await optimizationService.getOptimizationCost(taskId);

// Optimize content with AI
const result = await optimizationService.optimizeContent(taskId, prompt);

// Start full optimization
const optimization = await optimizationService.startOptimization(taskId, {
  fixMeta: true,
  fixHeadings: true,
  fixImages: true,
  generateSitemap: true,
  optimizeContentSeo: true
});

// Check optimization status
const status = await optimizationService.getOptimizationStatus(optimizationId);
```

**Edge Functions Used:**
- `optimization-calculate` - Calculates cost
- `optimization-content` - AI content optimization
- `optimization-start` - Starts full optimization
- `optimization-status` - Returns progress

### 3. Report Service (`src/api/services/reportService.ts`)

Handles report generation and downloads:

```typescript
import { reportService } from '@/api/services/reportService';

// Generate report
const report = await reportService.generateReport(taskId, 'pdf'); // or 'json', 'xml'

// Download report
const blob = await reportService.downloadReport(reportId);

// Export sitemap
const sitemap = await reportService.exportSitemap(taskId, 'xml'); // or 'html'

// Send report via email
const sent = await reportService.sendReportEmail(
  'user@example.com',
  'Your SEO Report',
  taskId
);
```

**Edge Functions Used:**
- `report-generate` - Creates report file
- `report-download` - Downloads report
- `sitemap-export` - Exports sitemap
- `send-email` - Sends email with report

## Migration from Old Code

### Example: Updating a Component

**Before:**
```typescript
import { seoApiService } from '@/api';

// Old direct call
const response = await seoApiService.startCrawl(url, maxPages);
```

**After:**
```typescript
import { auditService } from '@/api/services/auditService';

// New Supabase Edge Function call
const response = await auditService.startAudit(url, {
  maxPages,
  type: 'quick'
});
```

### Example: Polling for Status

**Before:**
```typescript
const status = await seoApiService.getStatus(taskId);
```

**After:**
```typescript
const status = await auditService.getAuditStatus(taskId);
```

## Error Handling

All services return standardized error responses:

```typescript
{
  success: boolean;
  message?: string;
  // ... additional data fields
}
```

**Always check `success` field:**

```typescript
const result = await auditService.startAudit(url, options);

if (!result.success) {
  console.error('Failed to start audit:', result.message);
  // Handle error
} else {
  console.log('Audit started with ID:', result.task_id);
  // Continue with task_id
}
```

## Authentication

All Edge Functions (except `health-check`) require authentication:

```typescript
// User must be logged in
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // Redirect to login
  return;
}

// Now safe to call Edge Functions
const result = await auditService.startAudit(url, options);
```

## Database Access

### Querying Audit Tasks

```typescript
const { data: tasks, error } = await supabase
  .from('audit_tasks')
  .select('*')
  .order('created_at', { ascending: false });
```

### Querying Audit Results

```typescript
const { data: results, error } = await supabase
  .from('audit_results')
  .select('*, audit_tasks(*)')
  .eq('task_id', taskId)
  .single();
```

### Querying Optimization Jobs

```typescript
const { data: jobs, error } = await supabase
  .from('optimization_jobs')
  .select('*')
  .eq('status', 'completed')
  .order('created_at', { ascending: false });
```

## Storage Access

### Downloading from Storage

```typescript
const { data, error } = await supabase.storage
  .from('reports')
  .download(`${userId}/report-${taskId}.pdf`);

if (data) {
  // Create download link
  const url = URL.createObjectURL(data);
  window.open(url);
}
```

### Uploading to Storage

```typescript
const { data, error } = await supabase.storage
  .from('exports')
  .upload(`${userId}/export-${Date.now()}.json`, fileData, {
    contentType: 'application/json'
  });
```

## Real-time Subscriptions

Subscribe to audit task updates:

```typescript
const subscription = supabase
  .channel('audit_tasks')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'audit_tasks',
      filter: `id=eq.${taskId}`
    },
    (payload) => {
      console.log('Task updated:', payload.new);
      // Update UI with new status
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

## Testing Edge Functions

### Using Browser Console

```javascript
// Test audit-start
const { data, error } = await supabase.functions.invoke('audit-start', {
  body: { 
    url: 'https://example.com',
    options: { maxPages: 100, type: 'quick' }
  }
});
console.log(data, error);
```

### Using Postman/Insomnia

```
POST https://wjrcutrjltukskwicjnx.supabase.co/functions/v1/audit-start
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json
Body:
{
  "url": "https://example.com",
  "options": {
    "maxPages": 100,
    "type": "quick"
  }
}
```

## Monitoring & Debugging

### Check Edge Function Logs

1. Go to Supabase Dashboard
2. Navigate to **Edge Functions**
3. Select function (e.g., `audit-start`)
4. Click **Logs** tab

### Check API Logs Table

```typescript
const { data: logs } = await supabase
  .from('api_logs')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(50);
```

### Check Health Status

```typescript
const { data } = await supabase.functions.invoke('health-check');
console.log('Health:', data);
// { status: 'ok', timestamp: '...', services: {...} }
```

## Performance Tips

1. **Batch operations** - Combine multiple related calls when possible
2. **Cache results** - Store frequently accessed data locally
3. **Use subscriptions** - For real-time updates instead of polling
4. **Paginate queries** - Use `.range()` for large datasets
5. **Index queries** - Check indexes exist for common queries

## Security Checklist

- ✅ All Edge Functions require authentication (except health-check)
- ✅ RLS policies protect all tables
- ✅ User can only access their own data
- ✅ Input validation on both client and server
- ✅ API keys stored as Supabase secrets
- ✅ No sensitive data in client-side code

## Next Steps

1. Update all components using old `seoApiService`
2. Test each Edge Function individually
3. Add error boundaries and fallbacks
4. Implement loading states
5. Add real-time subscriptions where needed
6. Monitor logs and optimize performance
