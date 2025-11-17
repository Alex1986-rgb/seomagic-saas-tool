# AI Optimization Testing Guide

## Overview

This guide explains how to test the full AI optimization cycle using the new optimization-processor Edge Function with Lovable AI integration.

## Prerequisites

1. **Completed Audit**: You must have at least one completed audit in the database
2. **Authentication**: User must be logged in
3. **Lovable AI**: Automatically configured (google/gemini-2.5-flash)

## Testing Steps

### Step 1: Access Test Page

Navigate to `/optimization-test` in your browser:
```
http://localhost:8080/optimization-test
```

### Step 2: Run an Audit (if needed)

If you don't have any completed audits:

1. Click "Run Audit" button on the test page
2. Or navigate to `/audit` manually
3. Enter a URL (e.g., `https://www.myarredo.ru`)
4. Wait for audit to complete (status: 'completed')
5. Return to `/optimization-test`

### Step 3: Select Audit

1. The test page will automatically load completed audits
2. Click on an audit card to select it
3. Review audit details:
   - SEO Score
   - Page Count
   - URL

### Step 4: Start Optimization

1. Click "Start AI Optimization" button
2. System will:
   - Create optimization job in `optimization_jobs` table
   - Invoke `optimization-processor` Edge Function
   - Return immediately with `optimization_id`

### Step 5: Monitor Progress

The page automatically polls optimization status every 3 seconds:

**Status Flow:**
```
queued → processing → completed (or failed)
```

**Visual Indicators:**
- ⏱️ Clock icon: Queued
- ⚙️ Spinning loader: Processing
- ✅ Check circle: Completed
- ❌ X circle: Failed

### Step 6: Review Results

When optimization completes, the page displays:

#### Summary Statistics
- **Pages Optimized**: Number of pages successfully processed
- **Total Pages**: Total pages in audit
- **Estimated Score Increase**: Projected SEO score improvement (+points)
- **Total Cost**: Estimated cost ($USD)

#### AI Recommendations
For each optimized page:
- **URL**: Page URL
- **Original Data**:
  - Title
  - Meta Description
  - Word Count
  - H1 Count
- **AI Recommendations**: Detailed SEO improvement suggestions from Lovable AI

## Edge Functions Flow

### 1. optimization-start

```javascript
POST /functions/v1/optimization-start

Request:
{
  "task_id": "uuid",
  "options": {
    "fixMetaTags": true,
    "improveContent": true,
    "improveStructure": true,
    "contentQuality": "premium",
    "language": "ru"
  }
}

Response:
{
  "success": true,
  "optimization_id": "uuid",
  "status": "queued",
  "message": "Optimization started"
}
```

### 2. optimization-processor

Automatically invoked by optimization-start:

**Process:**
1. Fetches audit results and page analysis
2. For each page (up to 50):
   - Builds optimization prompt
   - Calls Lovable AI Gateway
   - Model: `google/gemini-2.5-flash`
   - Temperature: 0.7
   - Max tokens: 2000
3. Saves recommendations to `optimization_jobs`
4. Calculates costs and metrics

### 3. optimization-status

```javascript
POST /functions/v1/optimization-status

Request:
{
  "optimization_id": "uuid"
}

Response:
{
  "success": true,
  "optimization_id": "uuid",
  "status": "completed",
  "cost": 2.25,
  "result_data": {
    "optimized_pages": 45,
    "total_pages": 50,
    "improvements": [...],
    "total_cost": 2.25,
    "estimated_score_improvement": 25
  }
}
```

## Database Tables Used

### optimization_jobs
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- task_id: UUID (FK to audit_tasks)
- status: TEXT (queued, processing, completed, failed)
- options: JSONB
- result_data: JSONB
- cost: NUMERIC
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### page_analysis
```sql
- id: UUID (PK)
- audit_id: UUID (FK)
- url: TEXT
- title: TEXT
- meta_description: TEXT
- word_count: INTEGER
- h1_count: INTEGER
- image_count: INTEGER
- status_code: INTEGER
- load_time: NUMERIC
```

## AI Integration Details

### Lovable AI Gateway

**Endpoint:** `https://ai.gateway.lovable.dev/v1/chat/completions`

**Model:** `google/gemini-2.5-flash`
- Balanced Gemini model
- Good cost/performance ratio
- Excellent for SEO recommendations
- Supports multimodal reasoning

**Configuration:**
```javascript
{
  model: 'google/gemini-2.5-flash',
  messages: [
    {
      role: 'system',
      content: 'You are an SEO expert specializing in content optimization...'
    },
    {
      role: 'user',
      content: 'Analyze and optimize this page...'
    }
  ],
  temperature: 0.7,
  max_tokens: 2000
}
```

## Expected Results

### Successful Optimization

For a typical 10-page audit:
- Processing time: 30-60 seconds
- Pages optimized: 10
- Cost: ~$0.50 USD
- Score improvement: +10 to +30 points

### AI Recommendations Example

```
Page: https://example.com/page

Recommendations:
- Suggest improved title and meta description
- Current title is too short (35 chars), recommend 50-60
- Meta description missing, add 150-160 char description
- Add more H2 subheadings for better structure
- Increase content from 180 to 300+ words
- Optimize keyword density for target terms
```

## Troubleshooting

### No Audits Available
**Solution:** Run audit first at `/audit`

### Optimization Stuck in Processing
**Possible causes:**
- Lovable AI rate limit
- Network issues
- Edge function timeout

**Solution:**
- Wait 5-10 minutes
- Check `api_logs` table
- Review edge function logs in Supabase dashboard

### Empty Recommendations
**Possible causes:**
- Invalid page data
- AI API error
- Prompt issues

**Solution:**
- Check `page_analysis` table has data
- Verify LOVABLE_API_KEY is set
- Review edge function logs

### Cost Too High
**Adjustments:**
- Reduce max pages in audit
- Use lower content quality setting
- Process fewer pages at once

## Best Practices

1. **Start Small**: Test with 5-10 pages first
2. **Monitor Costs**: Check result_data.total_cost
3. **Review Quality**: Verify AI recommendations are actionable
4. **Iterate**: Adjust options based on results
5. **Log Everything**: Check api_logs for debugging

## Next Steps

After successful testing:
1. Integrate optimization UI into main audit page
2. Add bulk optimization for multiple audits
3. Implement auto-apply recommendations
4. Create optimization history page
5. Add cost tracking and budgets

## Related Documentation

- [Backend Edge Functions](./BACKEND_EDGE_FUNCTIONS.md)
- [Modules Architecture](./MODULES_ARCHITECTURE.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
