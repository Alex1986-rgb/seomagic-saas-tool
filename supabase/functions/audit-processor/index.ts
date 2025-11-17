import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

async function crawlPage(url: string, domain: string): Promise<PageData> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0; +https://example.com/bot)'
      },
      redirect: 'follow'
    });

    const loadTime = Date.now() - startTime;
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract meta data
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Extract H1 tags
    const h1Tags: string[] = [];
    $('h1').each((_, el) => {
      h1Tags.push($(el).text().trim());
    });
    
    // Extract links
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
    
    // Extract images
    const images: Array<{ src: string; alt: string }> = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
      }
    });
    
    // Check indexability
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

async function processSEOAnalysis(pages: PageData[]) {
  const items = [];
  let totalScore = 0;
  let scoreCount = 0;

  // Meta Titles Analysis
  const missingTitles = pages.filter(p => !p.title || p.title.trim() === '');
  const tooLongTitles = pages.filter(p => p.title && p.title.length > 60);
  const tooShortTitles = pages.filter(p => p.title && p.title.length < 30);
  
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
      affectedUrls: missingTitles.map(p => p.url)
    });
  }
  
  if (tooLongTitles.length > 0) {
    titleScore -= 15;
    items.push({
      id: 'long-title',
      title: 'Слишком длинные meta title',
      description: `${tooLongTitles.length} страниц с title длиннее 60 символов`,
      status: 'warning',
      score: 70,
      impact: 'medium',
      affectedUrls: tooLongTitles.map(p => p.url)
    });
  }
  
  totalScore += titleScore;
  scoreCount++;

  // H1 Analysis
  const missingH1 = pages.filter(p => !p.h1 || p.h1.length === 0);
  const multipleH1 = pages.filter(p => p.h1 && p.h1.length > 1);
  
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
      affectedUrls: missingH1.map(p => p.url)
    });
  }
  
  totalScore += h1Score;
  scoreCount++;

  const finalScore = Math.round(totalScore / scoreCount);
  
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

  // HTTPS Analysis
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
      affectedUrls: httpPages.map(p => p.url)
    });
  }
  
  totalScore += httpsScore;
  scoreCount++;

  // Status Codes Analysis
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
      affectedUrls: serverErrors.map(p => p.url)
    });
  }
  
  if (clientErrors.length > 0) {
    statusScore -= 30;
    items.push({
      id: 'client-errors',
      title: 'Найдены ошибки 4xx',
      description: `${clientErrors.length} страниц возвращают ошибки клиента`,
      status: 'error',
      score: 30,
      impact: 'high',
      affectedUrls: clientErrors.map(p => p.url)
    });
  }
  
  totalScore += statusScore;
  scoreCount++;

  // Response Time Analysis
  const pagesWithLoadTime = pages.filter(p => p.loadTime !== undefined);
  if (pagesWithLoadTime.length > 0) {
    const avgLoadTime = pagesWithLoadTime.reduce((sum, p) => sum + (p.loadTime || 0), 0) / pagesWithLoadTime.length;
    let perfScore = 100;
    
    if (avgLoadTime > 3000) {
      perfScore -= 30;
      items.push({
        id: 'slow-response-time',
        title: 'Медленное время загрузки',
        description: `Среднее время: ${(avgLoadTime / 1000).toFixed(2)}с`,
        status: 'error',
        score: 40,
        impact: 'high'
      });
    }
    
    totalScore += perfScore;
    scoreCount++;
  }

  const finalScore = Math.round(totalScore / scoreCount);
  
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

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get pending tasks
    const { data: tasks, error: tasksError } = await supabaseClient
      .from('audit_tasks')
      .select('*')
      .eq('status', 'queued')
      .order('created_at', { ascending: true })
      .limit(1);

    if (tasksError || !tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending tasks' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const task = tasks[0];
    
    // Update task status
    await supabaseClient
      .from('audit_tasks')
      .update({ 
        status: 'processing',
        stage: 'crawling',
        started_at: new Date().toISOString()
      })
      .eq('id', task.id);

    console.log(`Processing task ${task.id} for URL: ${task.url}`);

    // Extract domain
    const domain = new URL(task.url).hostname;
    
    // Crawl pages
    const maxPages = task.estimated_pages || 10;
    const pages: PageData[] = [];
    const urlsToVisit = [task.url];
    const visitedUrls = new Set<string>();
    
    while (urlsToVisit.length > 0 && pages.length < maxPages) {
      const currentUrl = urlsToVisit.shift()!;
      
      if (visitedUrls.has(currentUrl)) continue;
      visitedUrls.add(currentUrl);
      
      console.log(`Crawling: ${currentUrl}`);
      const pageData = await crawlPage(currentUrl, domain);
      pages.push(pageData);
      
      // Update progress
      await supabaseClient
        .from('audit_tasks')
        .update({
          pages_scanned: pages.length,
          progress: Math.round((pages.length / maxPages) * 100),
          current_url: currentUrl
        })
        .eq('id', task.id);
      
      // Add internal links to queue
      if (pageData.internalLinks && pages.length < maxPages) {
        for (const link of pageData.internalLinks) {
          if (!visitedUrls.has(link) && !urlsToVisit.includes(link)) {
            urlsToVisit.push(link);
          }
        }
      }
    }

    console.log(`Crawled ${pages.length} pages, analyzing...`);

    // Update stage to analysis
    await supabaseClient
      .from('audit_tasks')
      .update({ stage: 'analyzing' })
      .eq('id', task.id);

    // Perform analyses
    const seoAnalysis = await processSEOAnalysis(pages);
    const technicalAnalysis = await processTechnicalAnalysis(pages);

    // Calculate overall score
    const overallScore = Math.round((seoAnalysis.score * 0.4 + technicalAnalysis.score * 0.4 + 100 * 0.2));

    // Store results
    const auditResult = {
      task_id: task.id,
      url: task.url,
      domain: domain,
      score: overallScore,
      pages_analyzed: pages.length,
      seo_score: seoAnalysis.score,
      technical_score: technicalAnalysis.score,
      seo_data: seoAnalysis,
      technical_data: technicalAnalysis,
      pages_data: pages,
      completed_at: new Date().toISOString()
    };

    await supabaseClient
      .from('audit_results')
      .insert(auditResult);

    // Update task as completed
    await supabaseClient
      .from('audit_tasks')
      .update({
        status: 'completed',
        stage: 'completed',
        progress: 100,
        completed_at: new Date().toISOString()
      })
      .eq('id', task.id);

    console.log(`Task ${task.id} completed successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        task_id: task.id,
        pages_analyzed: pages.length,
        score: overallScore
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

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
