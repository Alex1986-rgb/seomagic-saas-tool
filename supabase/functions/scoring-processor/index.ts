import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

/**
 * WEIGHTED SCORING ALGORITHM - Sprint 2
 * =====================================
 * 
 * This function calculates SEO audit scores using a weighted approach where
 * page importance is determined by:
 * 
 * 1. DEPTH PENALTY: Each level deeper reduces weight by 30%
 *    - Homepage (depth 0): weight = 1.0
 *    - Level 1 pages: weight = 0.7
 *    - Level 2 pages: weight = 0.49
 *    - Level 3 pages: weight = 0.343
 *    - Level 4+ pages: weight < 0.25
 * 
 * 2. PAGE TYPE MULTIPLIER:
 *    - Homepage: 5.0x (most critical)
 *    - Category pages: 2.5x (important navigation)
 *    - Product/Article pages: 1.2x (content pages)
 *    - Other pages: 1.0x (standard)
 * 
 * 3. INTERNAL LINKS BONUS:
 *    - More internal links = higher page authority
 *    - Multiplier = log10(internal_links + 10) / 2
 * 
 * EXAMPLE WEIGHTS:
 * - Homepage with 50 links: 5.0 × 1.0 × 0.9 = 4.5
 * - Category at depth 1 with 20 links: 2.5 × 0.7 × 0.65 = 1.14
 * - Product at depth 3 with 5 links: 1.2 × 0.343 × 0.39 = 0.16
 * 
 * SCORING CATEGORIES (0-100 each):
 * 
 * A) SEO SCORE (35% of global):
 *    - Missing title: -25 (critical)
 *    - Not indexable: -30 (critical)
 *    - Missing meta description: -15 (important)
 *    - Missing/multiple H1: -20 (important)
 *    - Missing canonical: -10 (minor)
 * 
 * B) TECHNICAL SCORE (25% of global):
 *    - 4xx/5xx errors: -40 (critical)
 *    - Missing viewport: -20 (important)
 *    - Wrong canonical: -15 (minor)
 * 
 * C) CONTENT SCORE (25% of global):
 *    - Very low content (<50 words): -30 (critical)
 *    - Thin content (<150 words): -25 (important)
 *    - Missing alt text: -15 (minor)
 * 
 * D) PERFORMANCE SCORE (15% of global):
 *    - Slow pages (>3s): -30
 *    - Slow TTFB (>1s): -20
 * 
 * WEIGHTED PENALTY CALCULATION:
 * penalty = base_penalty × (sum_of_affected_page_weights / total_weight)
 * 
 * This ensures that a missing title on the homepage has much more impact
 * than the same issue on a deep, rarely-linked page.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PageAnalysis {
  url: string;
  depth: number;
  page_type: string;
  title: string | null;
  meta_description: string | null;
  h1_count: number;
  h1_text: string | null;
  word_count: number;
  load_time: number;
  status_code: number;
  is_indexable: boolean;
  has_canonical: boolean;
  canonical_points_to_self: boolean | null;
  has_thin_content: boolean;
  missing_alt_images_count: number;
  internal_links_count: number;
  has_viewport: boolean;
  ttfb: number | null;
  redirect_chain_length: number;
}

interface PageWeight {
  page: PageAnalysis;
  weight: number;
}

interface ScoreBreakdown {
  seo_score: number;
  technical_score: number;
  content_score: number;
  performance_score: number;
  global_score: number;
  pct_missing_title: number;
  pct_missing_h1: number;
  pct_missing_description: number;
  pct_thin_content: number;
  pct_slow_pages: number;
  pct_not_indexable: number;
  pct_missing_canonical: number;
  pct_pages_with_redirects: number;
  pct_long_redirect_chains: number;
  pages_by_depth: Record<string, number>;
  pages_by_type: Record<string, number>;
  issues_by_severity: {
    critical: number;
    important: number;
    minor: number;
  };
}

/**
 * Calculate page weight based on depth, page type, and internal links
 * Higher weight = more important page
 */
function calculatePageWeight(page: PageAnalysis): number {
  let weight = 1.0;
  
  // Depth penalty: each level reduces weight by 30%
  weight *= Math.pow(0.7, page.depth);
  
  // Page type multiplier
  switch (page.page_type) {
    case 'home':
      weight *= 5.0; // Homepage is 5x more important
      break;
    case 'category':
      weight *= 2.5; // Categories are 2.5x more important
      break;
    case 'product':
      weight *= 1.2; // Products slightly more important
      break;
    case 'article':
      weight *= 1.2; // Articles slightly more important
      break;
    default:
      weight *= 1.0;
  }
  
  // Internal links bonus (proxy for page importance)
  // More internal links = more important page
  const linksBonus = Math.log10((page.internal_links_count || 0) + 10) / 2;
  weight *= linksBonus;
  
  return weight;
}

/**
 * Calculate weighted penalty for a specific issue
 */
function calculateWeightedPenalty(
  affectedPages: PageWeight[],
  totalWeight: number,
  basePenalty: number
): number {
  if (affectedPages.length === 0) return 0;
  
  // Sum weights of affected pages
  const affectedWeight = affectedPages.reduce((sum, pw) => sum + pw.weight, 0);
  
  // Penalty proportional to weighted impact
  const weightedImpact = affectedWeight / totalWeight;
  
  return Math.round(basePenalty * weightedImpact);
}

/**
 * Main scoring algorithm with weighted calculations
 */
function calculateWeightedScores(pages: PageAnalysis[]): ScoreBreakdown {
  console.log(`Calculating weighted scores for ${pages.length} pages`);
  
  // Calculate weights for all pages
  const pageWeights: PageWeight[] = pages.map(page => ({
    page,
    weight: calculatePageWeight(page)
  }));
  
  const totalWeight = pageWeights.reduce((sum, pw) => sum + pw.weight, 0);
  console.log(`Total weight: ${totalWeight.toFixed(2)}`);
  
  // Distribution metrics
  const pagesByDepth: Record<string, number> = {};
  const pagesByType: Record<string, number> = {};
  
  pages.forEach(page => {
    const depthKey = `depth_${page.depth}`;
    pagesByDepth[depthKey] = (pagesByDepth[depthKey] || 0) + 1;
    
    const typeKey = page.page_type || 'other';
    pagesByType[typeKey] = (pagesByType[typeKey] || 0) + 1;
  });
  
  // ===== SEO SCORE (0-100) =====
  let seoScore = 100;
  
  // Missing title (critical)
  const missingTitle = pageWeights.filter(pw => !pw.page.title || pw.page.title.trim() === '');
  seoScore -= calculateWeightedPenalty(missingTitle, totalWeight, 25);
  
  // Missing meta description (important)
  const missingDescription = pageWeights.filter(pw => !pw.page.meta_description || pw.page.meta_description.trim() === '');
  seoScore -= calculateWeightedPenalty(missingDescription, totalWeight, 15);
  
  // Missing or multiple H1 (important)
  const missingH1 = pageWeights.filter(pw => pw.page.h1_count !== 1);
  seoScore -= calculateWeightedPenalty(missingH1, totalWeight, 20);
  
  // Not indexable (critical for indexable pages)
  const notIndexable = pageWeights.filter(pw => !pw.page.is_indexable);
  seoScore -= calculateWeightedPenalty(notIndexable, totalWeight, 30);
  
  // Missing canonical (minor)
  const missingCanonical = pageWeights.filter(pw => !pw.page.has_canonical);
  seoScore -= calculateWeightedPenalty(missingCanonical, totalWeight, 10);
  
  seoScore = Math.max(0, Math.min(100, seoScore));
  
  // ===== TECHNICAL SCORE (0-100) =====
  let technicalScore = 100;
  
  // 4xx/5xx errors (critical)
  const errorPages = pageWeights.filter(pw => pw.page.status_code >= 400);
  technicalScore -= calculateWeightedPenalty(errorPages, totalWeight, 40);
  
  // Missing viewport (important for mobile)
  const noViewport = pageWeights.filter(pw => !pw.page.has_viewport);
  technicalScore -= calculateWeightedPenalty(noViewport, totalWeight, 20);
  
  // Canonical not pointing to self (minor warning)
  const wrongCanonical = pageWeights.filter(pw => 
    pw.page.has_canonical && pw.page.canonical_points_to_self === false
  );
  technicalScore -= calculateWeightedPenalty(wrongCanonical, totalWeight, 15);
  
  // Redirects penalties (Sprint 3)
  const redirectPages = pageWeights.filter(pw => (pw.page.redirect_chain_length || 0) > 0);
  if (redirectPages.length > 0) {
    technicalScore -= calculateWeightedPenalty(redirectPages, totalWeight, 30); // Moderate penalty
  }
  
  // Severe penalty for long redirect chains (3+)
  const longChains = pageWeights.filter(pw => (pw.page.redirect_chain_length || 0) >= 3);
  if (longChains.length > 0) {
    technicalScore -= calculateWeightedPenalty(longChains, totalWeight, 80); // Serious penalty
  }
  
  technicalScore = Math.max(0, Math.min(100, technicalScore));
  
  // ===== CONTENT SCORE (0-100) =====
  let contentScore = 100;
  
  // Thin content (important)
  const thinContent = pageWeights.filter(pw => pw.page.has_thin_content);
  contentScore -= calculateWeightedPenalty(thinContent, totalWeight, 25);
  
  // Missing alt text on images (minor)
  const missingAlt = pageWeights.filter(pw => (pw.page.missing_alt_images_count || 0) > 0);
  contentScore -= calculateWeightedPenalty(missingAlt, totalWeight, 15);
  
  // Very low word count (critical for content pages)
  const veryLowContent = pageWeights.filter(pw => pw.page.word_count < 50);
  contentScore -= calculateWeightedPenalty(veryLowContent, totalWeight, 30);
  
  contentScore = Math.max(0, Math.min(100, contentScore));
  
  // ===== PERFORMANCE SCORE (0-100) =====
  let performanceScore = 100;
  
  // Slow pages (load_time > 3s)
  const slowPages = pageWeights.filter(pw => pw.page.load_time > 3);
  performanceScore -= calculateWeightedPenalty(slowPages, totalWeight, 30);
  
  // Very slow TTFB (> 1s)
  const slowTTFB = pageWeights.filter(pw => (pw.page.ttfb || 0) > 1);
  performanceScore -= calculateWeightedPenalty(slowTTFB, totalWeight, 20);
  
  performanceScore = Math.max(0, Math.min(100, performanceScore));
  
  // ===== GLOBAL SCORE (weighted average) =====
  const globalScore = Math.round(
    seoScore * 0.35 +           // SEO is 35% of score
    technicalScore * 0.25 +      // Technical is 25%
    contentScore * 0.25 +        // Content is 25%
    performanceScore * 0.15      // Performance is 15%
  );
  
  // Calculate percentage metrics
  const totalPages = pages.length;
  const pct = (count: number) => parseFloat(((count / totalPages) * 100).toFixed(2));
  
  // Count issues by severity
  const criticalIssues = 
    missingTitle.length + 
    notIndexable.length + 
    errorPages.length + 
    veryLowContent.length;
  
  const importantIssues = 
    missingDescription.length + 
    missingH1.length + 
    noViewport.length + 
    thinContent.length + 
    slowPages.length;
  
  const minorIssues = 
    missingCanonical.length + 
    wrongCanonical.length + 
    missingAlt.length + 
    slowTTFB.length;
  
  console.log(`Scores - SEO: ${seoScore}, Technical: ${technicalScore}, Content: ${contentScore}, Performance: ${performanceScore}, Global: ${globalScore}`);
  
  return {
    seo_score: seoScore,
    technical_score: technicalScore,
    content_score: contentScore,
    performance_score: performanceScore,
    global_score: globalScore,
    pct_missing_title: pct(missingTitle.length),
    pct_missing_h1: pct(missingH1.length),
    pct_missing_description: pct(missingDescription.length),
    pct_thin_content: pct(thinContent.length),
    pct_slow_pages: pct(slowPages.length),
    pct_not_indexable: pct(notIndexable.length),
    pct_missing_canonical: pct(missingCanonical.length),
    pct_pages_with_redirects: pct(pages.filter(p => (p.redirect_chain_length || 0) > 0).length),
    pct_long_redirect_chains: pct(pages.filter(p => (p.redirect_chain_length || 0) >= 3).length),
    pages_by_depth: pagesByDepth,
    pages_by_type: pagesByType,
    issues_by_severity: {
      critical: criticalIssues,
      important: importantIssues,
      minor: minorIssues
    }
  };
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
    
    console.log(`Starting scoring for task: ${task_id}`);

    // Fetch all page analysis data
    const { data: pages, error: pagesError } = await supabase
      .from('page_analysis')
      .select('*')
      .eq('task_id', task_id);

    if (pagesError) {
      throw new Error(`Failed to fetch page analysis: ${pagesError.message}`);
    }

    if (!pages || pages.length === 0) {
      throw new Error('No pages found for scoring');
    }

    console.log(`Analyzing ${pages.length} pages`);

    // Calculate weighted scores
    const scores = calculateWeightedScores(pages as PageAnalysis[]);

    // Fetch task status to determine if this is partial data
    const { data: taskData } = await supabase
      .from('audit_tasks')
      .select('status, total_urls, pages_scanned')
      .eq('id', task_id)
      .single();

    console.log('[SCORING] Task status:', {
      status: taskData?.status,
      totalUrls: taskData?.total_urls,
      pagesScanned: taskData?.pages_scanned
    });

    const taskStatus = taskData?.status || 'processing';
    const totalPages = taskData?.total_urls || pages.length;
    const pagesScanned = taskData?.pages_scanned || pages.length;
    
    const isPartial = taskStatus !== 'completed' || pagesScanned < totalPages * 0.9;
    const completionPercentage = Math.round((pagesScanned / totalPages) * 100);
    const partialNote = isPartial 
      ? `Частичный аудит: просканировано ${pagesScanned} из ${totalPages} страниц (${completionPercentage}%)`
      : null;

    console.log(`[SCORING] Completion status: ${isPartial ? 'PARTIAL' : 'COMPLETE'} (${completionPercentage}%)`);

    console.log(`📊 Saving results as ${isPartial ? 'PARTIAL' : 'COMPLETE'} (${completionPercentage}%)`);

    // Fetch task data to get audit_id
    const { data: task, error: taskError } = await supabase
      .from('audit_tasks')
      .select('audit_id, user_id, url')
      .eq('id', task_id)
      .single();

    if (taskError || !task) {
      throw new Error(`Failed to fetch task data: ${taskError?.message}`);
    }

    // Upsert audit_results with scores (insert if not exists, update if exists)
    const { error: updateError } = await supabase
      .from('audit_results')
      .upsert({
        task_id: task_id,
        audit_id: task.audit_id,
        score: scores.global_score,
        seo_score: scores.seo_score,
        technical_score: scores.technical_score,
        content_score: scores.content_score,
        performance_score: scores.performance_score,
        global_score: scores.global_score,
        pct_missing_title: scores.pct_missing_title,
        pct_missing_h1: scores.pct_missing_h1,
        pct_missing_description: scores.pct_missing_description,
        pct_thin_content: scores.pct_thin_content,
        pct_slow_pages: scores.pct_slow_pages,
        pct_not_indexable: scores.pct_not_indexable,
        pct_missing_canonical: scores.pct_missing_canonical,
        pct_pages_with_redirects: scores.pct_pages_with_redirects,
        pct_long_redirect_chains: scores.pct_long_redirect_chains,
        pages_by_depth: scores.pages_by_depth,
        pages_by_type: scores.pages_by_type,
        issues_by_severity: scores.issues_by_severity,
        page_count: pages.length,
        is_partial: isPartial,
        completion_percentage: completionPercentage,
        partial_data_note: partialNote
      }, {
        onConflict: 'task_id'
      });

    if (updateError) {
      throw new Error(`Failed to update scores: ${updateError.message}`);
    }

    console.log(`Scoring complete for task ${task_id}`);

    // Update audit status to completed
    const { error: auditUpdateError } = await supabase
      .from('audits')
      .update({ 
        status: isPartial ? 'partial' : 'completed',
        pages_scanned: pages.length,
        seo_score: scores.global_score,
        completed_at: new Date().toISOString()
      })
      .eq('id', task.audit_id);

    if (auditUpdateError) {
      console.error('[SCORING] ⚠️ Failed to update audits table:', auditUpdateError);
      // Don't throw - this is not critical
    } else {
      console.log(`[SCORING] ✅ Updated audits table status to ${isPartial ? 'partial' : 'completed'}`);
    }
    
    // Автоматически рассчитываем смету после сохранения оценок
    console.log('[SCORING] ✅ Scores saved, triggering optimization calculation...');
    
    try {
      const { data: optData, error: optError } = await supabase.functions.invoke('optimization-calculate', {
        body: { task_id: task_id }
      });
      
      if (optError) {
        console.error('[SCORING] ❌ Failed to calculate optimization:', optError);
      } else {
        console.log('[SCORING] ✅ Optimization calculated:', optData);
      }
    } catch (error) {
      console.error('[SCORING] ❌ Exception in optimization calculation:', error);
    }
    
    // Create notification in background (don't block response)
    const { data: task } = await supabase
      .from('audit_tasks')
      .select('user_id, url')
      .eq('id', task_id)
      .single();
    
    if (task?.user_id) {
      console.log(`Creating notification for user ${task.user_id}`);
      
      // Fire and forget - don't await
      supabase.functions.invoke('create-notification', {
        body: {
          user_id: task.user_id,
          task_id: task_id,
          type: 'audit_completed',
          audit_data: {
            url: task.url,
            score: finalMetrics.globalScore,
            seo_score: finalMetrics.seoScore,
            pages_scanned: scoringResult.pageCount,
            issues_count: scoringResult.issuesCount,
          }
        }
      }).then(({ error }) => {
        if (error) {
          console.error('Failed to create notification:', error);
        } else {
          console.log('Notification created successfully');
        }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        task_id,
        scores
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Scoring processor error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
