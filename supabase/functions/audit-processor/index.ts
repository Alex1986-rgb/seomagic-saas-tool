import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Micro-batch constants for reliable processing
const MICRO_BATCH_SIZE = 5; // Process 5 pages per invocation
const PAGE_TIMEOUT = 8000; // 8 seconds per page
const MAX_BATCH_CALLS = 500; // Prevent infinite loops (fallback only)

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
    const timeoutId = setTimeout(() => controller.abort(), PAGE_TIMEOUT);
    
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

// Get next batch of URLs from queue
async function getNextBatch(supabase: any, taskId: string, batchSize: number) {
  const { data, error } = await supabase
    .from('url_queue')
    .select('*')
    .eq('task_id', taskId)
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(batchSize);

  if (error) {
    console.error('Error fetching batch:', error);
    return [];
  }

  return data || [];
}

// Process a micro-batch of URLs
async function processMicroBatch(supabase: any, taskId: string, domain: string) {
  // Get current task with all needed fields
  const { data: task } = await supabase
    .from('audit_tasks')
    .select('pages_scanned, estimated_pages, audit_id, user_id')
    .eq('id', taskId)
    .single();

  if (!task) {
    console.error('Task not found');
    return { hasMore: false, processed: 0 };
  }

  // Calculate remaining pages needed
  const remainingPages = (task.estimated_pages || 100) - (task.pages_scanned || 0);
  
  if (remainingPages <= 0) {
    console.log('✅ Target pages already reached');
    return { hasMore: false, processed: 0 };
  }

  // Limit batch size to remaining pages
  const batchSize = Math.min(MICRO_BATCH_SIZE, remainingPages);
  const batch = await getNextBatch(supabase, taskId, batchSize);
  
  if (batch.length === 0) {
    console.log('⚠️ No more URLs to process in queue');
    return { hasMore: false, processed: 0 };
  }

  console.log(`🔄 Processing micro-batch: ${batch.length} URLs (${remainingPages} remaining)`);

  // Mark URLs as processing
  await supabase
    .from('url_queue')
    .update({ status: 'processing' })
    .in('id', batch.map((b: any) => b.id));

  // Process URLs in parallel
  const results = await Promise.all(
    batch.map((item: any) => crawlPage(item.url, domain))
  );

  // Save page analysis results
  const pageAnalysisData = results.map(page => ({
    audit_id: task.audit_id,
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

  // Mark URLs as completed and discover new URLs
  for (let i = 0; i < results.length; i++) {
    const page = results[i];
    const queueItem = batch[i];

    await supabase
      .from('url_queue')
      .update({ 
        status: page.status_code >= 200 && page.status_code < 400 ? 'completed' : 'failed',
        error_message: page.status_code >= 400 ? `HTTP ${page.status_code}` : null
      })
      .eq('id', queueItem.id);

    // Add newly discovered internal links to queue
    if (page.internalLinks && page.internalLinks.length > 0) {
      const newUrls = page.internalLinks.slice(0, 20); // Limit to prevent explosion
      
      // Check which URLs are already in queue
      const { data: existing } = await supabase
        .from('url_queue')
        .select('url')
        .eq('task_id', taskId)
        .in('url', newUrls);

      const existingUrls = new Set(existing?.map((e: any) => e.url) || []);
      const toInsert = newUrls
        .filter(url => !existingUrls.has(url))
        .map(url => ({
          task_id: taskId,
          url,
          status: 'pending',
          priority: 0
        }));

      if (toInsert.length > 0) {
        await supabase.from('url_queue').insert(toInsert);
        console.log(`➕ Added ${toInsert.length} new URLs to queue`);
      }
    }
  }

  // Check if there are more pending URLs
  const { data: pendingCheck } = await supabase
    .from('url_queue')
    .select('id')
    .eq('task_id', taskId)
    .eq('status', 'pending')
    .limit(1);
  
  const hasMore = (pendingCheck?.length || 0) > 0;
  console.log(`📋 URLs discovered: ${hasMore ? 'Yes' : 'No'}, processed: ${batch.length}`);
  
  return { hasMore, processed: batch.length };
}

// Update task progress
async function updateProgress(supabase: any, taskId: string) {
  const { data: task } = await supabase
    .from('audit_tasks')
    .select('estimated_pages')
    .eq('id', taskId)
    .single();

  const { data: counts } = await supabase
    .from('url_queue')
    .select('status')
    .eq('task_id', taskId);

  if (!counts || !task) return;

  const total = counts.length;
  const completed = counts.filter((c: any) => c.status === 'completed').length;
  const failed = counts.filter((c: any) => c.status === 'failed').length;
  const pagesScanned = completed + failed;
  
  // Calculate progress based on estimated_pages (target)
  const targetPages = task.estimated_pages || total;
  const progress = targetPages > 0 
    ? Math.round((pagesScanned / targetPages) * 100) 
    : 0;

  await supabase
    .from('audit_tasks')
    .update({
      pages_scanned: pagesScanned,
      total_urls: total,
      progress: Math.min(progress, 90), // Cap at 90% until analysis
      stage: `Сканирование (${Math.min(progress, 90)}%)`
    })
    .eq('id', taskId);

  console.log(`📈 Progress: ${pagesScanned}/${targetPages} pages (${progress}%)`);
}

// Removed triggerNextBatch - using pull-based model instead

// Analyze all pages and complete audit
async function completeAudit(supabase: any, taskId: string) {
  console.log('=== COMPLETING AUDIT ===');
  
  const { data: task } = await supabase
    .from('audit_tasks')
    .select('*, audit_id, user_id, url')
    .eq('id', taskId)
    .single();

  if (!task) throw new Error('Task not found');

  // Update to analysis phase
  await supabase
    .from('audit_tasks')
    .update({ 
      status: 'analyzing', 
      stage: 'analysis', 
      progress: 90 
    })
    .eq('id', taskId);

  // Get all page analysis results
  const { data: pages } = await supabase
    .from('page_analysis')
    .select('*')
    .eq('audit_id', task.audit_id);

  // Simple SEO analysis
  const missingTitles = pages?.filter((p: any) => !p.title || p.title.trim() === '') || [];
  const missingH1 = pages?.filter((p: any) => p.h1_count === 0) || [];
  const missingDesc = pages?.filter((p: any) => !p.meta_description) || [];

  const items = [];
  let score = 100;

  if (missingTitles.length > 0) {
    score -= 20;
    items.push({
      id: 'missing-title',
      title: 'Отсутствуют meta title',
      description: `${missingTitles.length} страниц без meta title`,
      status: 'error',
      impact: 'high'
    });
  }

  if (missingH1.length > 0) {
    score -= 20;
    items.push({
      id: 'missing-h1',
      title: 'Отсутствует H1 заголовок',
      description: `${missingH1.length} страниц без H1`,
      status: 'error',
      impact: 'high'
    });
  }

  if (missingDesc.length > 0) {
    score -= 15;
    items.push({
      id: 'missing-desc',
      title: 'Отсутствуют meta description',
      description: `${missingDesc.length} страниц без описания`,
      status: 'warning',
      impact: 'medium'
    });
  }

  const seoAnalysis = {
    score: Math.max(score, 0),
    items,
    passed: items.filter(i => i.status === 'good').length,
    warning: items.filter(i => i.status === 'warning').length,
    failed: items.filter(i => i.status === 'error').length
  };

  const auditData = {
    url: task.url,
    pages_scanned: pages?.length || 0,
    seo: seoAnalysis,
    details: {
      seo: seoAnalysis,
      performance: { score: 75, items: [] },
      content: { score: 80, items: [] },
      technical: { score: 85, items: [] }
    }
  };

  // Save audit results
  await supabase
    .from('audit_results')
    .insert({
      task_id: taskId,
      audit_id: task.audit_id,
      user_id: task.user_id,
      audit_data: auditData,
      score: seoAnalysis.score,
      page_count: pages?.length || 0,
      issues_count: seoAnalysis.failed + seoAnalysis.warning
    });

  // Update audit and task to completed
  await supabase
    .from('audits')
    .update({
      status: 'completed',
      pages_scanned: pages?.length || 0,
      seo_score: seoAnalysis.score,
      completed_at: new Date().toISOString()
    })
    .eq('id', task.audit_id);

  await supabase
    .from('audit_tasks')
    .update({
      status: 'completed',
      stage: 'completed',
      progress: 100
    })
    .eq('id', taskId);

  console.log(`✅ Audit completed: ${pages?.length} pages, score: ${seoAnalysis.score}`);
}

// Simplified analyze function for compatibility
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

// Main task processor with micro-batch architecture
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

    console.log(`🔄 Processing task ${taskId}, batch #${task.batch_count + 1}`);

    // Check if target page limit reached (with default fallback)
    const targetPages = task.estimated_pages || 100;
    if ((task.pages_scanned || 0) >= targetPages) {
      console.log(`✅ Reached target page limit: ${targetPages}`);
      await completeAudit(supabase, taskId);
      return;
    }

    // Check batch limit as fallback protection
    if (task.batch_count >= MAX_BATCH_CALLS) {
      console.warn(`⚠️ Max batch calls (${MAX_BATCH_CALLS}) reached, force completing...`);
      await completeAudit(supabase, taskId);
      return;
    }

    // Increment batch counter
    await supabase
      .from('audit_tasks')
      .update({ batch_count: (task.batch_count || 0) + 1 })
      .eq('id', taskId);

    // Extract domain
    const urlObj = new URL(task.url);
    const domain = urlObj.hostname;

    // If this is the first batch, initialize the queue
    if (task.batch_count === 0 || task.stage === 'queued') {
      console.log('=== INITIALIZING QUEUE ===');
      
      await supabase
        .from('audit_tasks')
        .update({ 
          status: 'scanning', 
          stage: 'discovery', 
          progress: 5 
        })
        .eq('id', taskId);

      // Create audit record if not exists
      let auditId = task.audit_id;
      if (!auditId) {
        const { data: audit } = await supabase
          .from('audits')
          .insert({
            user_id: task.user_id,
            url: task.url,
            status: 'scanning'
          })
          .select()
          .single();

        auditId = audit.id;
        await supabase
          .from('audit_tasks')
          .update({ audit_id: auditId })
          .eq('id', taskId);
      }

      // Add initial URL to queue
      await supabase
        .from('url_queue')
        .insert({
          task_id: taskId,
          url: task.url,
          status: 'pending',
          priority: 100 // Highest priority for start page
        });

      console.log('🎬 Queue initialized with start URL');
    }

    // Update to fetching phase
    if (task.stage === 'discovery') {
      await supabase
        .from('audit_tasks')
        .update({ stage: 'fetching' })
        .eq('id', taskId);
    }

    // Process micro-batch
    const { hasMore, processed } = await processMicroBatch(supabase, taskId, domain);

    console.log(`✅ Batch #${task.batch_count + 1} completed: ${processed} URLs processed`);

    // Update progress
    await updateProgress(supabase, taskId);

    // Check queue status
    const { data: queueStatus } = await supabase
      .from('url_queue')
      .select('status')
      .eq('task_id', taskId);
    
    const pending = queueStatus?.filter((q: any) => q.status === 'pending').length || 0;
    const completed = queueStatus?.filter((q: any) => q.status === 'completed').length || 0;
    
    console.log(`📊 Queue status: ${pending} pending, ${completed} completed, ${queueStatus?.length || 0} total`);

    // Get updated task to check page limit
    const { data: updatedTask } = await supabase
      .from('audit_tasks')
      .select('pages_scanned, estimated_pages')
      .eq('id', taskId)
      .single();

    // Check if target pages reached (with default fallback)
    const updatedTargetPages = updatedTask?.estimated_pages || 100;
    if (updatedTask && (updatedTask.pages_scanned || 0) >= updatedTargetPages) {
      console.log(`✅ Target pages reached: ${updatedTask.pages_scanned}/${updatedTargetPages}`);
      await completeAudit(supabase, taskId);
      return;
    }

    // Check if we should complete or continue
    if (!hasMore || processed === 0) {
      // No more URLs to process - complete the audit
      console.log('🏁 No more URLs to process - completing audit');
      await completeAudit(supabase, taskId);
    } else {
      // More URLs to process - trigger next batch (self-triggering)
      console.log('🔄 More URLs pending - triggering next batch...');
      
      // Use EdgeRuntime.waitUntil for non-blocking background trigger
      const nextBatchPromise = supabase.functions.invoke('audit-processor', {
        body: { task_id: taskId }
      }).then(() => {
        console.log('✅ Next batch triggered successfully');
      }).catch((err: Error) => {
        console.error('❌ Failed to trigger next batch:', err.message);
      });
      
      // Don't await - let it run in background
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        EdgeRuntime.waitUntil(nextBatchPromise);
      }
    }

  } catch (error) {
    console.error('❌ Error processing audit task:', error);
    
    await supabase
      .from('audit_tasks')
      .update({
        status: 'failed',
        stage: 'failed',
        error_message: error.message
      })
      .eq('id', taskId);

    throw error;
  }
}

serve(async (req) => {
  console.log('=== 🚀 AUDIT PROCESSOR STARTED ===');
  console.log('📋 Request method:', req.method);
  console.log('🌐 Environment check:', {
    hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
    hasAnonKey: !!Deno.env.get('SUPABASE_ANON_KEY'),
    hasLovableKey: !!Deno.env.get('LOVABLE_API_KEY')
  });
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task_id } = await req.json();
    console.log('📝 Received request for task:', task_id);

    if (!task_id) {
      console.error('❌ No task_id provided in request');
      return new Response(
        JSON.stringify({ error: 'Missing task_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📝 Received request for task: ${task_id}`);

    // Process one micro-batch synchronously
    await processAuditTask(task_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Batch processed successfully',
        task_id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

