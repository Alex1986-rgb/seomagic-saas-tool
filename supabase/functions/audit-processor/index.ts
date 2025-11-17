import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Constants for batch processing large sites
const BATCH_SIZE = 500; // Pages to process in one batch
const MAX_EXECUTION_TIME = 50000; // 50 seconds (buffer before timeout)
const CRAWL_DELAY = 50; // ms between requests to avoid overload
const MAX_CONCURRENT_REQUESTS = 10; // Parallel crawling

interface PageData {
  url: string;
  title?: string;
  description?: string;
  h1?: string[];
  links?: string[];
  internalLinks?: string[];
  externalLinks?: string[];
  images?: Array<{ src: string; alt: string }>;
  statusCode?: number;
  contentType?: string;
  loadTime?: number;
  redirectChain?: string[];
  contentLength?: number;
  isIndexable?: boolean;
  issues?: Array<{ type: string; description: string; severity: string }>;
}

interface TaskState {
  urlsQueue: string[];
  visitedUrls: Set<string>;
  pages: PageData[];
}

async function crawlPage(url: string, domain: string): Promise<PageData> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout per page
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0; +https://example.com/bot)'
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
    
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const isIndexable = !robotsMeta.includes('noindex');
    
    return {
      url,
      title,
      description,
      h1: h1Tags,
      links: allLinks,
      internalLinks,
      externalLinks,
      images,
      statusCode: response.status,
      contentType: response.headers.get('content-type') || undefined,
      loadTime,
      contentLength: html.length,
      isIndexable,
      issues: []
    };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return {
      url,
      statusCode: 0,
      loadTime: Date.now() - startTime,
      isIndexable: false,
      issues: [{
        type: 'crawl-error',
        description: `Failed to crawl: ${error.message}`,
        severity: 'critical'
      }]
    };
  }
}

async function crawlBatch(
  urls: string[],
  domain: string
): Promise<PageData[]> {
  const results: PageData[] = [];
  
  // Process in chunks for concurrent requests
  for (let i = 0; i < urls.length; i += MAX_CONCURRENT_REQUESTS) {
    const chunk = urls.slice(i, i + MAX_CONCURRENT_REQUESTS);
    const chunkResults = await Promise.all(
      chunk.map(url => crawlPage(url, domain))
    );
    results.push(...chunkResults);
    
    // Small delay between chunks
    if (i + MAX_CONCURRENT_REQUESTS < urls.length) {
      await new Promise(resolve => setTimeout(resolve, CRAWL_DELAY));
    }
  }
  
  return results;
}

async function loadTaskState(supabase: any, taskId: string): Promise<TaskState> {
  const { data: task } = await supabase
    .from('audit_tasks')
    .select('task_state')
    .eq('id', taskId)
    .single();
    
  if (task?.task_state) {
    return {
      urlsQueue: task.task_state.urlsQueue || [],
      visitedUrls: new Set(task.task_state.visitedUrls || []),
      pages: task.task_state.pages || []
    };
  }
  
  return {
    urlsQueue: [],
    visitedUrls: new Set(),
    pages: []
  };
}

async function saveTaskState(supabase: any, taskId: string, state: TaskState) {
  await supabase
    .from('audit_tasks')
    .update({
      task_state: {
        urlsQueue: state.urlsQueue,
        visitedUrls: Array.from(state.visitedUrls),
        pages: state.pages
      }
    })
    .eq('id', taskId);
}

async function processSEOAnalysis(pages: PageData[]) {
  const items = [];
  let totalScore = 0;
  let scoreCount = 0;

  const missingTitles = pages.filter(p => !p.title || p.title.trim() === '');
  const tooLongTitles = pages.filter(p => p.title && p.title.length > 60);
  
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
      affectedUrls: missingTitles.map(p => p.url).slice(0, 10) // Limit URLs to save space
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

async function processTechnicalAnalysis(pages: PageData[]) {
  const items = [];
  let totalScore = 0;
  let scoreCount = 0;

  const httpPages = pages.filter(p => p.url.startsWith('http://'));
  let httpsScore = 100;
  
  if (httpPages.length > 0) {
    httpsScore -= 40;
    items.push({
      id: 'no-https',
      title: 'Сайт не использует HTTPS',
      description: `${httpPages.length} страниц используют небезопасный HTTP`,
      status: 'error',
      score: 0,
      impact: 'high',
      affectedUrls: httpPages.map(p => p.url).slice(0, 10)
    });
  }
  
  totalScore += httpsScore;
  scoreCount++;

  const clientErrors = pages.filter(p => p.statusCode && p.statusCode >= 400 && p.statusCode < 500);
  const serverErrors = pages.filter(p => p.statusCode && p.statusCode >= 500);
  
  let statusScore = 100;
  if (serverErrors.length > 0) {
    statusScore -= 40;
    items.push({
      id: 'server-errors',
      title: 'Найдены ошибки 5xx',
      description: `${serverErrors.length} страниц возвращают ошибки сервера`,
      status: 'error',
      score: 0,
      impact: 'high',
      affectedUrls: serverErrors.map(p => p.url).slice(0, 10)
    });
  }
  
  totalScore += statusScore;
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const executionStart = Date.now();

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get one task to process
    const { data: tasks, error: tasksError } = await supabaseClient
      .from('audit_tasks')
      .select('*')
      .in('status', ['queued', 'processing'])
      .order('created_at', { ascending: true })
      .limit(1);

    if (tasksError || !tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending tasks' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const task = tasks[0];
    const isResuming = task.status === 'processing';
    const maxPages = task.estimated_pages || 1000;
    
    console.log(`${isResuming ? 'Resuming' : 'Starting'} task ${task.id} for URL: ${task.url}`);
    console.log(`Target: ${maxPages} pages, Already scanned: ${task.pages_scanned || 0}`);

    // Update status if starting fresh
    if (!isResuming) {
      await supabaseClient
        .from('audit_tasks')
        .update({ 
          status: 'processing',
          stage: 'crawling',
          started_at: new Date().toISOString()
        })
        .eq('id', task.id);
    }

    const domain = new URL(task.url).hostname;
    
    // Load or initialize state
    let state = await loadTaskState(supabaseClient, task.id);
    
    if (state.urlsQueue.length === 0 && state.pages.length === 0) {
      // First run - initialize with start URL
      state.urlsQueue = [task.url];
    }
    
    // Process batch
    const batchStart = Date.now();
    const pagesInBatch: PageData[] = [];
    
    while (
      state.urlsQueue.length > 0 && 
      state.pages.length < maxPages &&
      pagesInBatch.length < BATCH_SIZE &&
      (Date.now() - batchStart) < MAX_EXECUTION_TIME
    ) {
      // Get URLs for this iteration
      const urlsToProcess = [];
      while (urlsToProcess.length < MAX_CONCURRENT_REQUESTS && state.urlsQueue.length > 0) {
        const url = state.urlsQueue.shift()!;
        if (!state.visitedUrls.has(url)) {
          urlsToProcess.push(url);
          state.visitedUrls.add(url);
        }
      }
      
      if (urlsToProcess.length === 0) break;
      
      // Crawl batch
      const batchResults = await crawlBatch(urlsToProcess, domain);
      pagesInBatch.push(...batchResults);
      state.pages.push(...batchResults);
      
      // Add new URLs to queue
      for (const page of batchResults) {
        if (page.internalLinks) {
          for (const link of page.internalLinks) {
            if (!state.visitedUrls.has(link) && !state.urlsQueue.includes(link)) {
              state.urlsQueue.push(link);
            }
          }
        }
      }
      
      // Update progress
      const progress = Math.min(Math.round((state.pages.length / maxPages) * 100), 100);
      await supabaseClient
        .from('audit_tasks')
        .update({
          pages_scanned: state.pages.length,
          progress: progress,
          current_url: urlsToProcess[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id);
        
      console.log(`Processed batch: ${pagesInBatch.length} pages, Total: ${state.pages.length}/${maxPages}`);
    }
    
    // Check if we're done or need to continue
    const isDone = state.pages.length >= maxPages || state.urlsQueue.length === 0;
    
    if (isDone) {
      console.log(`Task ${task.id} crawling complete with ${state.pages.length} pages. Starting analysis...`);
      
      // Perform analyses
      const seoAnalysis = await processSEOAnalysis(state.pages);
      const technicalAnalysis = await processTechnicalAnalysis(state.pages);
      
      const overallScore = Math.round((seoAnalysis.score * 0.4 + technicalAnalysis.score * 0.4 + 100 * 0.2));

      // Store results
      await supabaseClient
        .from('audit_results')
        .insert({
          task_id: task.id,
          url: task.url,
          domain: domain,
          score: overallScore,
          pages_analyzed: state.pages.length,
          seo_score: seoAnalysis.score,
          technical_score: technicalAnalysis.score,
          seo_data: seoAnalysis,
          technical_data: technicalAnalysis,
          pages_data: state.pages,
          completed_at: new Date().toISOString()
        });

      // Mark task as completed
      await supabaseClient
        .from('audit_tasks')
        .update({
          status: 'completed',
          stage: 'completed',
          progress: 100,
          completed_at: new Date().toISOString(),
          task_state: null // Clear state
        })
        .eq('id', task.id);

      console.log(`Task ${task.id} completed successfully`);
      
      return new Response(
        JSON.stringify({
          success: true,
          task_id: task.id,
          pages_analyzed: state.pages.length,
          score: overallScore,
          completed: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } else {
      // Save state for next batch
      await saveTaskState(supabaseClient, task.id, state);
      
      console.log(`Batch completed. Progress: ${state.pages.length}/${maxPages}. Queue: ${state.urlsQueue.length} URLs remaining`);
      
      return new Response(
        JSON.stringify({
          success: true,
          task_id: task.id,
          pages_analyzed: state.pages.length,
          progress: Math.round((state.pages.length / maxPages) * 100),
          remaining_urls: state.urlsQueue.length,
          completed: false,
          message: 'Batch processed, more to come'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Error in audit-processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
