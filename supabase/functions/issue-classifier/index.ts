import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type IssueCategory = 'seo' | 'content' | 'technical' | 'performance' | 'accessibility' | 'security';
type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

interface ClassifiedIssue {
  issue_type: string;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  recommendation?: string;
  metadata?: Record<string, any>;
  can_auto_fix?: boolean;
}

/**
 * Classify SEO issues from page data
 */
function classifySEOIssues(pageData: any): ClassifiedIssue[] {
  const issues: ClassifiedIssue[] = [];

  // Missing title
  if (!pageData.title || pageData.title.trim() === '') {
    issues.push({
      issue_type: 'missing_title',
      category: 'seo',
      severity: 'critical',
      description: `Missing title tag on ${pageData.url}`,
      recommendation: 'Add a descriptive title tag (50-60 characters)',
      can_auto_fix: true
    });
  }

  // Title length issues
  const titleLength = pageData.title?.length || 0;
  if (titleLength > 0 && titleLength < 30) {
    issues.push({
      issue_type: 'short_title',
      category: 'seo',
      severity: 'medium',
      description: `Title too short (${titleLength} chars) on ${pageData.url}`,
      recommendation: 'Expand title to 50-60 characters for better SEO',
      can_auto_fix: true,
      metadata: { title_length: titleLength }
    });
  } else if (titleLength > 60) {
    issues.push({
      issue_type: 'long_title',
      category: 'seo',
      severity: 'low',
      description: `Title too long (${titleLength} chars) on ${pageData.url}`,
      recommendation: 'Shorten title to 50-60 characters to avoid truncation',
      can_auto_fix: true,
      metadata: { title_length: titleLength }
    });
  }

  // Missing meta description
  if (!pageData.meta_description || pageData.meta_description.trim() === '') {
    issues.push({
      issue_type: 'missing_description',
      category: 'seo',
      severity: 'high',
      description: `Missing meta description on ${pageData.url}`,
      recommendation: 'Add a compelling meta description (120-160 characters)',
      can_auto_fix: true
    });
  }

  // Description length issues
  const descLength = pageData.meta_description?.length || 0;
  if (descLength > 0 && descLength < 120) {
    issues.push({
      issue_type: 'short_description',
      category: 'seo',
      severity: 'medium',
      description: `Meta description too short (${descLength} chars) on ${pageData.url}`,
      recommendation: 'Expand description to 120-160 characters',
      can_auto_fix: true,
      metadata: { description_length: descLength }
    });
  } else if (descLength > 160) {
    issues.push({
      issue_type: 'long_description',
      category: 'seo',
      severity: 'low',
      description: `Meta description too long (${descLength} chars) on ${pageData.url}`,
      recommendation: 'Shorten description to 120-160 characters',
      can_auto_fix: true,
      metadata: { description_length: descLength }
    });
  }

  // Missing H1
  if (pageData.h1_count === 0) {
    issues.push({
      issue_type: 'missing_h1',
      category: 'seo',
      severity: 'high',
      description: `Missing H1 heading on ${pageData.url}`,
      recommendation: 'Add exactly one H1 heading that describes the page content',
      can_auto_fix: true
    });
  }

  // Multiple H1s
  if (pageData.h1_count > 1) {
    issues.push({
      issue_type: 'multiple_h1',
      category: 'seo',
      severity: 'medium',
      description: `Multiple H1 headings (${pageData.h1_count}) on ${pageData.url}`,
      recommendation: 'Use only one H1 heading per page',
      can_auto_fix: true,
      metadata: { h1_count: pageData.h1_count }
    });
  }

  // Missing canonical
  if (!pageData.has_canonical) {
    issues.push({
      issue_type: 'missing_canonical',
      category: 'seo',
      severity: 'medium',
      description: `Missing canonical tag on ${pageData.url}`,
      recommendation: 'Add a canonical tag to prevent duplicate content issues',
      can_auto_fix: true
    });
  }

  // Wrong canonical
  if (pageData.has_canonical && pageData.canonical_points_to_self === false) {
    issues.push({
      issue_type: 'wrong_canonical',
      category: 'seo',
      severity: 'medium',
      description: `Canonical tag doesn't point to self on ${pageData.url}`,
      recommendation: 'Update canonical tag to point to the current page URL',
      can_auto_fix: true,
      metadata: { canonical_url: pageData.canonical_url }
    });
  }

  // Not indexable
  if (!pageData.is_indexable) {
    issues.push({
      issue_type: 'not_indexable',
      category: 'seo',
      severity: 'critical',
      description: `Page is not indexable: ${pageData.url}`,
      recommendation: 'Remove robots noindex directive if indexing is desired',
      can_auto_fix: false,
      metadata: { robots_meta: pageData.robots_meta, x_robots_tag: pageData.x_robots_tag }
    });
  }

  return issues;
}

/**
 * Classify technical issues from page data
 */
function classifyTechnicalIssues(pageData: any): ClassifiedIssue[] {
  const issues: ClassifiedIssue[] = [];

  // Slow page load
  if (pageData.load_time && pageData.load_time > 3) {
    issues.push({
      issue_type: 'slow_page',
      category: 'performance',
      severity: 'high',
      description: `Slow page load time (${pageData.load_time.toFixed(2)}s) on ${pageData.url}`,
      recommendation: 'Optimize images, minify resources, and enable caching',
      can_auto_fix: false,
      metadata: { load_time: pageData.load_time }
    });
  }

  // High TTFB
  if (pageData.ttfb && pageData.ttfb > 1) {
    issues.push({
      issue_type: 'high_ttfb',
      category: 'performance',
      severity: 'medium',
      description: `High Time to First Byte (${pageData.ttfb.toFixed(2)}s) on ${pageData.url}`,
      recommendation: 'Optimize server response time and database queries',
      can_auto_fix: false,
      metadata: { ttfb: pageData.ttfb }
    });
  }

  // No compression
  if (!pageData.is_compressed) {
    issues.push({
      issue_type: 'no_compression',
      category: 'performance',
      severity: 'medium',
      description: `Content not compressed on ${pageData.url}`,
      recommendation: 'Enable Gzip or Brotli compression on the server',
      can_auto_fix: false
    });
  }

  // 301 Redirect
  if (pageData.status_code === 301) {
    issues.push({
      issue_type: 'redirect_301',
      category: 'technical',
      severity: 'low',
      description: `Permanent redirect (301) on ${pageData.url}`,
      recommendation: 'Update internal links to point directly to the final URL',
      can_auto_fix: false,
      metadata: { final_url: pageData.final_url }
    });
  }

  // 302 Redirect
  if (pageData.status_code === 302) {
    issues.push({
      issue_type: 'redirect_302',
      category: 'technical',
      severity: 'medium',
      description: `Temporary redirect (302) on ${pageData.url}`,
      recommendation: 'Consider using 301 for permanent redirects or updating links',
      can_auto_fix: false,
      metadata: { final_url: pageData.final_url }
    });
  }

  // Redirect chains
  if (pageData.redirect_chain_length && pageData.redirect_chain_length > 1) {
    const severity = pageData.redirect_chain_length >= 3 ? 'high' : 'medium';
    issues.push({
      issue_type: 'redirect_chain',
      category: 'technical',
      severity,
      description: `Redirect chain detected (${pageData.redirect_chain_length} redirects) on ${pageData.url}`,
      recommendation: 'Reduce redirect chains to improve page speed and SEO',
      can_auto_fix: false,
      metadata: { 
        redirect_chain_length: pageData.redirect_chain_length,
        final_url: pageData.final_url
      }
    });
  }

  // Broken link (404)
  if (pageData.status_code === 404) {
    issues.push({
      issue_type: 'broken_link',
      category: 'technical',
      severity: 'high',
      description: `Broken link (404) on ${pageData.url}`,
      recommendation: 'Fix or remove broken links',
      can_auto_fix: false
    });
  }

  // Server error (5xx)
  if (pageData.status_code >= 500) {
    issues.push({
      issue_type: 'server_error',
      category: 'technical',
      severity: 'critical',
      description: `Server error (${pageData.status_code}) on ${pageData.url}`,
      recommendation: 'Investigate and fix server errors immediately',
      can_auto_fix: false,
      metadata: { status_code: pageData.status_code }
    });
  }

  // Missing viewport
  if (!pageData.has_viewport) {
    issues.push({
      issue_type: 'missing_viewport',
      category: 'accessibility',
      severity: 'medium',
      description: `Missing viewport meta tag on ${pageData.url}`,
      recommendation: 'Add viewport meta tag for mobile responsiveness',
      can_auto_fix: true
    });
  }

  return issues;
}

/**
 * Classify content issues from page data
 */
function classifyContentIssues(pageData: any): ClassifiedIssue[] {
  const issues: ClassifiedIssue[] = [];

  // Thin content
  if (pageData.has_thin_content || (pageData.word_count && pageData.word_count < 150)) {
    issues.push({
      issue_type: 'thin_content',
      category: 'content',
      severity: 'medium',
      description: `Thin content (${pageData.word_count || 0} words) on ${pageData.url}`,
      recommendation: 'Expand content to at least 300 words for better SEO',
      can_auto_fix: false,
      metadata: { word_count: pageData.word_count }
    });
  }

  // Missing alt text
  if (pageData.missing_alt_images_count && pageData.missing_alt_images_count > 0) {
    issues.push({
      issue_type: 'missing_alt_text',
      category: 'content',
      severity: 'medium',
      description: `${pageData.missing_alt_images_count} images missing alt text on ${pageData.url}`,
      recommendation: 'Add descriptive alt text to all images for accessibility and SEO',
      can_auto_fix: false,
      metadata: { missing_alt_count: pageData.missing_alt_images_count }
    });
  }

  // No internal links
  if (!pageData.internal_links_count || pageData.internal_links_count === 0) {
    issues.push({
      issue_type: 'no_internal_links',
      category: 'content',
      severity: 'medium',
      description: `No internal links on ${pageData.url}`,
      recommendation: 'Add internal links to improve site navigation and SEO',
      can_auto_fix: false
    });
  }

  // Too many external links
  const internalLinks = pageData.internal_links_count || 0;
  const externalLinks = pageData.external_links_count || 0;
  if (externalLinks > internalLinks * 2 && externalLinks > 10) {
    issues.push({
      issue_type: 'too_many_external_links',
      category: 'content',
      severity: 'low',
      description: `Too many external links (${externalLinks} external vs ${internalLinks} internal) on ${pageData.url}`,
      recommendation: 'Balance external and internal links for better SEO',
      can_auto_fix: false,
      metadata: { external_links: externalLinks, internal_links: internalLinks }
    });
  }

  // Large HTML
  if (pageData.content_length && pageData.content_length > 500000) {
    issues.push({
      issue_type: 'large_html',
      category: 'performance',
      severity: 'medium',
      description: `Large HTML size (${(pageData.content_length / 1024).toFixed(0)}KB) on ${pageData.url}`,
      recommendation: 'Reduce HTML size by removing unnecessary code and optimizing structure',
      can_auto_fix: false,
      metadata: { content_length: pageData.content_length }
    });
  }

  // Poor heading structure
  const hasH1 = pageData.h1_count === 1;
  const hasH2 = pageData.h2_count && pageData.h2_count > 0;
  if (hasH1 && !hasH2) {
    issues.push({
      issue_type: 'poor_heading_structure',
      category: 'content',
      severity: 'low',
      description: `Poor heading hierarchy on ${pageData.url} (H1 without H2)`,
      recommendation: 'Use proper heading hierarchy (H1 > H2 > H3) for better structure',
      can_auto_fix: false,
      metadata: { 
        h1_count: pageData.h1_count,
        h2_count: pageData.h2_count,
        h3_count: pageData.h3_count
      }
    });
  }

  // Low text-to-HTML ratio
  if (pageData.text_html_ratio && pageData.text_html_ratio < 0.1) {
    issues.push({
      issue_type: 'low_text_html_ratio',
      category: 'content',
      severity: 'low',
      description: `Low text-to-HTML ratio (${(pageData.text_html_ratio * 100).toFixed(1)}%) on ${pageData.url}`,
      recommendation: 'Reduce unnecessary HTML and increase text content',
      can_auto_fix: false,
      metadata: { text_html_ratio: pageData.text_html_ratio }
    });
  }

  return issues;
}

/**
 * Classify all issues for a page
 */
function classifyPageIssues(pageData: any): ClassifiedIssue[] {
  return [
    ...classifySEOIssues(pageData),
    ...classifyTechnicalIssues(pageData),
    ...classifyContentIssues(pageData)
  ];
}

/**
 * Load pricing rules from database
 */
async function loadPricingRules(supabase: any) {
  const { data, error } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Failed to load pricing rules:', error);
    return [];
  }

  return data || [];
}

/**
 * Calculate fix cost for an issue based on pricing rules
 */
function calculateFixCost(issue: ClassifiedIssue, pricingRules: any[]): number {
  const rule = pricingRules.find(r => r.issue_type === issue.issue_type);
  return rule ? rule.price_per_item : 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { task_id } = await req.json();
    
    console.log(`[ISSUE-CLASSIFIER] Starting classification for task: ${task_id}`);

    // Fetch task data to get audit_id and user_id
    const { data: taskData, error: taskError } = await supabase
      .from('audit_tasks')
      .select('audit_id, user_id')
      .eq('id', task_id)
      .single();

    if (taskError || !taskData) {
      throw new Error(`Failed to fetch task data: ${taskError?.message}`);
    }

    // Fetch all page analysis data
    const { data: pages, error: pagesError } = await supabase
      .from('page_analysis')
      .select('*')
      .eq('task_id', task_id);

    if (pagesError) {
      throw new Error(`Failed to fetch page analysis: ${pagesError.message}`);
    }

    if (!pages || pages.length === 0) {
      console.log('[ISSUE-CLASSIFIER] No pages found for classification');
      return new Response(JSON.stringify({ 
        success: true, 
        issues_count: 0,
        message: 'No pages to classify'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[ISSUE-CLASSIFIER] Classifying issues for ${pages.length} pages`);

    // Load pricing rules
    const pricingRules = await loadPricingRules(supabase);
    console.log(`[ISSUE-CLASSIFIER] Loaded ${pricingRules.length} pricing rules`);

    // Classify issues for all pages
    const allIssues: ClassifiedIssue[] = [];
    for (const page of pages) {
      const pageIssues = classifyPageIssues(page);
      
      // Add page_id and calculate fix_cost
      for (const issue of pageIssues) {
        allIssues.push({
          ...issue,
          metadata: {
            ...issue.metadata,
            page_id: page.id
          }
        });
      }
    }

    console.log(`[ISSUE-CLASSIFIER] Found ${allIssues.length} total issues`);

    // Save issues to database
    if (allIssues.length > 0) {
      const issuesForDb = allIssues.map(issue => ({
        audit_id: taskData.audit_id,
        task_id: task_id,
        user_id: taskData.user_id,
        page_id: issue.metadata?.page_id || null,
        issue_type: issue.issue_type,
        category: issue.category,
        severity: issue.severity,
        description: issue.description,
        recommendation: issue.recommendation || null,
        can_auto_fix: issue.can_auto_fix || false,
        fix_cost: calculateFixCost(issue, pricingRules),
        metadata: issue.metadata || null
      }));

      const { error: insertError } = await supabase
        .from('issues')
        .insert(issuesForDb);

      if (insertError) {
        throw new Error(`Failed to save issues: ${insertError.message}`);
      }

      console.log(`[ISSUE-CLASSIFIER] ✅ Saved ${allIssues.length} issues to database`);

      // Calculate total cost and create estimate
      const totalCost = allIssues.reduce((sum, issue) => {
        return sum + calculateFixCost(issue, pricingRules);
      }, 0);

      // Group issues by type for cost breakdown
      const breakdownMap = new Map<string, any>();
      for (const issue of allIssues) {
        const key = issue.issue_type;
        if (!breakdownMap.has(key)) {
          const rule = pricingRules.find(r => r.issue_type === issue.issue_type);
          breakdownMap.set(key, {
            issue_type: issue.issue_type,
            category: issue.category,
            count: 0,
            unit_price: rule?.price_per_item || 0,
            total_price: 0
          });
        }
        const item = breakdownMap.get(key)!;
        item.count++;
        item.total_price += calculateFixCost(issue, pricingRules);
      }

      const costBreakdown = Array.from(breakdownMap.values());

      // Create job estimate
      const { error: estimateError } = await supabase
        .from('job_estimates')
        .insert({
          audit_id: taskData.audit_id,
          task_id: task_id,
          user_id: taskData.user_id,
          total_issues: allIssues.length,
          total_cost: totalCost,
          discount_applied: 0,
          final_cost: totalCost,
          cost_breakdown: costBreakdown,
          status: 'draft'
        });

      if (estimateError) {
        console.error('[ISSUE-CLASSIFIER] Failed to create estimate:', estimateError);
      } else {
        console.log(`[ISSUE-CLASSIFIER] ✅ Created estimate with total cost: ${totalCost}₽`);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      issues_count: allIssues.length,
      task_id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[ISSUE-CLASSIFIER] Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
