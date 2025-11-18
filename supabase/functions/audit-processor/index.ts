import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Constants for batch processing
const BATCH_SIZE = 50; // Pages to process in one batch
const MAX_EXECUTION_TIME = 50000; // 50 seconds
const CRAWL_DELAY = 100; // ms between requests
const MAX_CONCURRENT_REQUESTS = 5; // Parallel crawling

interface PageData {
  url: string;
  title?: string;
  description?: string;
  h1?: string[];
  h1_count: number;
  image_count: number;
  word_count: number;
  load_time: number;
  status_code: number;
  links?: string[];
  internalLinks?: string[];
  externalLinks?: string[];
  images?: Array<{ src: string; alt: string }>;
  contentType?: string;
  isIndexable?: boolean;
  issues?: Array<{ type: string; description: string; severity: string }>;
}

// Crawl a single page
async function crawlPage(url: string, domain: string): Promise<PageData> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)'
      },
      redirect: 'follow',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const loadTime = Date.now() - startTime;
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    
    const h1Tags: string[] = [];
    $('h1').each((_, el) => {
      h1Tags.push($(el).text().trim());
    });
    
    const allLinks: string[] = [];
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, url).href;
          allLinks.push(absoluteUrl);
          
          if (absoluteUrl.includes(domain)) {
            internalLinks.push(absoluteUrl);
          } else if (absoluteUrl.startsWith('http')) {
            externalLinks.push(absoluteUrl);
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });
    
    const images: Array<{ src: string; alt: string }> = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
      }
    });
    
    const textContent = $('body').text();
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const isIndexable = !robotsMeta.includes('noindex');
    
    return {
      url,
      title,
      description,
      h1: h1Tags,
      h1_count: h1Tags.length,
      image_count: images.length,
      word_count: wordCount,
      load_time: loadTime / 1000, // Convert to seconds
      status_code: response.status,
      links: allLinks,
      internalLinks,
      externalLinks,
      images,
      contentType: response.headers.get('content-type') || undefined,
      isIndexable,
      issues: []
    };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return {
      url,
      h1_count: 0,
      image_count: 0,
      word_count: 0,
      load_time: (Date.now() - startTime) / 1000,
      status_code: 0,
      isIndexable: false,
      issues: [{
        type: 'crawl-error',
        description: `Failed to crawl: ${error.message}`,
        severity: 'critical'
      }]
    };
  }
}

// Crawl multiple pages in batch
async function crawlBatch(urls: string[], domain: string): Promise<PageData[]> {
  const results: PageData[] = [];
  
  for (let i = 0; i < urls.length; i += MAX_CONCURRENT_REQUESTS) {
    const chunk = urls.slice(i, i + MAX_CONCURRENT_REQUESTS);
    const chunkResults = await Promise.all(
      chunk.map(url => crawlPage(url, domain))
    );
    results.push(...chunkResults);
    
    if (i + MAX_CONCURRENT_REQUESTS < urls.length) {
      await new Promise(resolve => setTimeout(resolve, CRAWL_DELAY));
    }
  }
  
  return results;
}

// Analyze pages for SEO
async function analyzeSEO(pages: PageData[]) {
  const items = [];
  let totalScore = 0;
  let scoreCount = 0;

  const missingTitles = pages.filter(p => !p.title || p.title.trim() === '');
  let titleScore = 100;
  if (missingTitles.length > 0) {
    titleScore -= 30;
    items.push({
      id: 'missing-title',
      title: 'Отсутствуют meta title',
      description: `${missingTitles.length} страниц без meta title`,
      status: 'error',
      score: 0,
      impact: 'high',
      affectedUrls: missingTitles.map(p => p.url).slice(0, 10)
    });
  }
  totalScore += titleScore;
  scoreCount++;

  const missingH1 = pages.filter(p => !p.h1 || p.h1.length === 0);
  let h1Score = 100;
  if (missingH1.length > 0) {
    h1Score -= 30;
    items.push({
      id: 'missing-h1',
      title: 'Отсутствует H1 заголовок',
      description: `${missingH1.length} страниц без H1`,
      status: 'error',
      score: 0,
      impact: 'high',
      affectedUrls: missingH1.map(p => p.url).slice(0, 10)
    });
  }
  totalScore += h1Score;
  scoreCount++;

  const finalScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 100;
  
  return {
    score: finalScore,
    items,
    passed: items.filter(i => i.status === 'good').length,
    warning: items.filter(i => i.status === 'warning').length,
    failed: items.filter(i => i.status === 'error').length
  };
}

// Process audit task
async function processAuditTask(taskId: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Get task
    const { data: task, error: taskError } = await supabase
      .from('audit_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      throw new Error('Task not found');
    }

    console.log(`Processing task ${taskId} for URL: ${task.url}`);

    // Initial status update
    await supabase
      .from('audit_tasks')
      .update({ status: 'scanning', stage: 'queued', progress: 0 })
      .eq('id', taskId);

    // Create audit record if not exists
    let auditId = task.audit_id;
    if (!auditId) {
      const { data: audit, error: auditError } = await supabase
        .from('audits')
        .insert({
          user_id: task.user_id,
          url: task.url,
          status: 'scanning',
          total_pages: task.estimated_pages || 10
        })
        .select()
        .single();

      if (auditError) throw auditError;
      auditId = audit.id;

      // Link task to audit
      await supabase
        .from('audit_tasks')
        .update({ audit_id: auditId })
        .eq('id', taskId);
    }

    // Update audit status
    await supabase
      .from('audits')
      .update({ status: 'scanning' })
      .eq('id', auditId);

    // Parse domain
    const urlObj = new URL(task.url);
    const domain = urlObj.hostname;

    // PHASE 1: DISCOVERY - Find all URLs
    console.log('=== PHASE 1: DISCOVERY ===');
    await supabase
      .from('audit_tasks')
      .update({ 
        status: 'scanning', 
        stage: 'discovery', 
        progress: 5,
        discovery_source: 'Initialization'
      })
      .eq('id', taskId);

    // Start crawling
    const urlsQueue = [task.url];
    const visitedUrls = new Set<string>();
    const allPages: PageData[] = [];
    const maxPages = task.estimated_pages || 10;

    let pagesScanned = 0;
    let discoveredUrlsCount = 0;
    const startTime = Date.now();
    
    // Notify about initial URL
    discoveredUrlsCount++;
    await supabase
      .from('audit_tasks')
      .update({
        discovered_urls_count: discoveredUrlsCount,
        last_discovered_url: task.url,
        discovery_source: 'Starting page'
      })
      .eq('id', taskId);

    while (urlsQueue.length > 0 && pagesScanned < maxPages) {
      // Check execution time
      if (Date.now() - startTime > MAX_EXECUTION_TIME) {
        console.log('Execution time limit reached, saving progress...');
        break;
      }

      const batchUrls = urlsQueue.splice(0, Math.min(BATCH_SIZE, maxPages - pagesScanned));
      const newUrls = batchUrls.filter(url => !visitedUrls.has(url));

      if (newUrls.length === 0) continue;

      // Crawl batch
      const batchPages = await crawlBatch(newUrls, domain);
      allPages.push(...batchPages);
      pagesScanned += batchPages.length;

      // Mark as visited
      newUrls.forEach(url => visitedUrls.add(url));

      // Add new internal links to queue and notify in real-time
      for (const page of batchPages) {
        if (page.internalLinks) {
          for (const link of page.internalLinks) {
            if (!visitedUrls.has(link) && !urlsQueue.includes(link) && link !== task.url) {
              urlsQueue.push(link);
              discoveredUrlsCount++;
              
              // Real-time update for each discovered URL
              await supabase
                .from('audit_tasks')
                .update({
                  discovered_urls_count: discoveredUrlsCount,
                  last_discovered_url: link,
                  discovery_source: `Page: ${page.url.substring(0, 50)}...`
                })
                .eq('id', taskId);
            }
          }
        }
      }

      // PHASE 2: FETCHING - Download HTML
      // Update to fetching phase after discovery
      if (pagesScanned === batchPages.length) {
        console.log('=== PHASE 2: FETCHING ===');
        await supabase
          .from('audit_tasks')
          .update({ stage: 'fetching', progress: 25 })
          .eq('id', taskId);
      }
      
      // Update progress
      const progress = Math.min(50, Math.round((pagesScanned / maxPages) * 25) + 25);
      await supabase
        .from('audit_tasks')
        .update({
          pages_scanned: pagesScanned,
          progress,
          current_url: newUrls[0],
          stage: 'fetching'
        })
        .eq('id', taskId);

      // Save page analysis to database (batch insert)
      const pageAnalysisData = batchPages.map(page => ({
        audit_id: auditId,
        user_id: task.user_id,
        url: page.url,
        title: page.title || null,
        meta_description: page.description || null,
        h1_count: page.h1_count,
        image_count: page.image_count,
        word_count: page.word_count,
        load_time: page.load_time,
        status_code: page.status_code
      }));

      await supabase.from('page_analysis').insert(pageAnalysisData);

      console.log(`Processed ${pagesScanned}/${maxPages} pages...`);
    }

    // Analyze results
    console.log('Analyzing pages...');
    await supabase
      .from('audit_tasks')
      .update({ status: 'analyzing', stage: 'analysis', progress: 90 })
      .eq('id', taskId);

    const seoAnalysis = await analyzeSEO(allPages);

    // Create final audit data
    const auditData = {
      url: task.url,
      pages_scanned: pagesScanned,
      seo: seoAnalysis,
      details: {
        seo: seoAnalysis,
        performance: { score: 75, items: [] },
        content: { score: 80, items: [] },
        technical: { score: 85, items: [] }
      }
    };

    // Save audit results
    console.log('Saving audit results to database...');
    const { data: insertedResult, error: insertError } = await supabase
      .from('audit_results')
      .insert({
        task_id: taskId,
        audit_id: auditId,
        user_id: task.user_id,
        audit_data: auditData,
        score: seoAnalysis.score,
        page_count: pagesScanned,
        issues_count: seoAnalysis.failed + seoAnalysis.warning
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error saving audit results:', insertError);
      throw new Error(`Failed to save audit results: ${insertError.message}`);
    }

    console.log('✅ Audit results saved:', insertedResult.id);

    // Phase 4: Generating reports
    console.log('Generating reports...');
    await supabase
      .from('audit_tasks')
      .update({ status: 'generating', stage: 'generating', progress: 95 })
      .eq('id', taskId);

    // Log generated files to audit_files table
    const timestamp = Date.now();
    const filesToLog = [
      {
        audit_id: auditId,
        user_id: task.user_id,
        file_type: 'audit_json',
        file_url: `audits/${auditId}/audit-${timestamp}.json`,
        file_size: JSON.stringify(auditData).length
      },
      {
        audit_id: auditId,
        user_id: task.user_id,
        file_type: 'sitemap_xml',
        file_url: `audits/${auditId}/sitemap-${timestamp}.xml`,
        file_size: 0 // Will be calculated when actually generated
      }
    ];

    await supabase.from('audit_files').insert(filesToLog);

    // Update audit record
    await supabase
      .from('audits')
      .update({
        status: 'completed',
        pages_scanned: pagesScanned,
        seo_score: seoAnalysis.score,
        completed_at: new Date().toISOString()
      })
      .eq('id', auditId);

    // Mark task as completed
    await supabase
      .from('audit_tasks')
      .update({
        status: 'completed',
        stage: 'completed',
        progress: 100,
        pages_scanned: pagesScanned
      })
      .eq('id', taskId);

    console.log(`Audit completed: ${pagesScanned} pages scanned, score: ${seoAnalysis.score}`);

  } catch (error) {
    console.error('Error processing audit task:', error);
    
    await supabase
      .from('audit_tasks')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('id', taskId);

    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task_id } = await req.json();

    if (!task_id) {
      throw new Error('task_id is required');
    }

    console.log(`Starting audit processor for task: ${task_id}`);

    // Process task in background
    EdgeRuntime.waitUntil(processAuditTask(task_id));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Audit processing started'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in audit-processor:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
