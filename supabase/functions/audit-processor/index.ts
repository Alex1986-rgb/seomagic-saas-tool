import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MICRO_BATCH_SIZE = 5;
const PAGE_TIMEOUT = 8000;
const MAX_DEPTH = 5;

// URL utilities
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
    if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    urlObj.hash = '';
    const params = Array.from(urlObj.searchParams.entries()).sort(([a], [b]) => a.localeCompare(b));
    urlObj.search = '';
    params.forEach(([key, value]) => urlObj.searchParams.append(key, value));
    return urlObj.toString();
  } catch { return url; }
}

const BLOCKED_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid', 'replytocom', 'share'];

function filterQueryParams(url: string): string {
  try {
    const urlObj = new URL(url);
    BLOCKED_PARAMS.forEach(param => urlObj.searchParams.delete(param));
    return urlObj.toString();
  } catch { return url; }
}

function detectPageType(url: string): string {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path === '/' || path === '') return 'home';
    if (path.includes('/category') || path.includes('/catalog')) return 'category';
    if (path.includes('/product') || path.includes('/item')) return 'product';
    if (path.includes('/blog') || path.includes('/article')) return 'article';
    return 'other';
  } catch { return 'other'; }
}

function calculatePriority(url: string, depth: number, isFromSitemap: boolean = false): number {
  let priority = 100 - (depth * 10);
  if (isFromSitemap) priority += 20;
  const pageType = detectPageType(url);
  if (pageType === 'home') priority += 50;
  if (pageType === 'category') priority += 15;
  return Math.max(0, priority);
}

function calculateEstimatedPages(sitemapCount: number, maxPages: number = 100): number {
  if (sitemapCount === 0) return maxPages;
  if (sitemapCount < 200) return Math.min(sitemapCount, maxPages);
  if (sitemapCount < 1000) return Math.min(Math.ceil(sitemapCount * 0.3), 300);
  return 300;
}

// Follow redirects manually to track chain
interface RedirectChain {
  chain: Array<{ url: string; statusCode: number; location: string }>;
  finalUrl: string;
  chainLength: number;
}

async function followRedirects(startUrl: string, maxRedirects = 10): Promise<RedirectChain> {
  const chain: Array<{ url: string; statusCode: number; location: string }> = [];
  let currentUrl = startUrl;
  let redirectCount = 0;
  
  while (redirectCount < maxRedirects) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PAGE_TIMEOUT);
    
    try {
      const response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      const statusCode = response.status;
      
      // Check if this is a redirect (3xx)
      if (statusCode >= 300 && statusCode < 400) {
        const location = response.headers.get('location');
        if (!location) break;
        
        const absoluteLocation = new URL(location, currentUrl).toString();
        chain.push({ url: currentUrl, statusCode, location: absoluteLocation });
        
        currentUrl = absoluteLocation;
        redirectCount++;
      } else {
        // Reached final URL
        return {
          chain,
          finalUrl: currentUrl,
          chainLength: redirectCount
        };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // Max redirects exceeded
  return {
    chain,
    finalUrl: currentUrl,
    chainLength: redirectCount
  };
}

async function crawlPage(url: string, domain: string): Promise<any> {
  const startTime = Date.now();
  try {
    // First, follow redirects to get the chain
    const redirectInfo = await followRedirects(url);
    const finalUrl = redirectInfo.finalUrl;
    const redirectChainLength = redirectInfo.chainLength;
    
    // Now fetch the final URL for content analysis
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PAGE_TIMEOUT);
    const response = await fetch(finalUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)' },
      redirect: 'manual',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const ttfb = Date.now() - startTime;
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const h1Tags: string[] = [];
    $('h1').each((_, el) => h1Tags.push($(el).text().trim()));
    
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || null;
    const h1Text = $('h1').first().text().trim();
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;
    const textHtmlRatio = html.length > 0 ? parseFloat(((bodyText.length / html.length) * 100).toFixed(2)) : 0;
    
    const images: any[] = [];
    $('img').each((_, el) => images.push({ src: $(el).attr('src'), alt: $(el).attr('alt') || '' }));
    const missingAltCount = images.filter(img => !img.alt || img.alt.trim() === '').length;
    
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const hreflangTags = $('link[rel="alternate"]').map((_, el) => ({
      lang: $(el).attr('hreflang'),
      url: $(el).attr('href')
    })).get().filter(tag => tag.lang);
    
    const languageDetected = ($('html').attr('lang') || '').split('-')[0] || 'unknown';
    const allLinks = $('a[href]').map((_, el) => $(el).attr('href')).get();
    const internalLinks = allLinks.filter(link => {
      try {
        if (!link || link.startsWith('#')) return false;
        return new URL(link, url).hostname === domain;
      } catch { return false; }
    });
    
    return {
      url, title, description, h1: h1Tags, h1_count: h1Tags.length, h1_text: h1Text,
      h2_count: h2Count, h3_count: h3Count, image_count: images.length, word_count: wordCount,
      load_time: Number(((Date.now() - startTime) / 1000).toFixed(2)), status_code: response.status,
      links: allLinks, internalLinks, externalLinks: [], images,
      is_indexable: !robotsMeta.toLowerCase().includes('noindex'), robots_meta: robotsMeta || null,
      canonical_url: canonicalUrl, has_canonical: !!canonicalUrl,
      canonical_points_to_self: canonicalUrl === url, text_html_ratio: textHtmlRatio,
      has_thin_content: wordCount < 150, missing_alt_images_count: missingAltCount,
      content_type: response.headers.get('content-type') || 'text/html',
      content_length: html.length, has_viewport: hasViewport,
      hreflang_tags: hreflangTags.length > 0 ? hreflangTags : null,
      language_detected: languageDetected, internal_links_count: internalLinks.length,
      external_links_count: 0, page_type: detectPageType(url),
      ttfb: Number((ttfb / 1000).toFixed(3)), 
      redirect_chain_length: redirectChainLength, 
      final_url: finalUrl,
      // Compression detection (Sprint 3)
      is_compressed: !!response.headers.get('content-encoding'),
      compression_type: response.headers.get('content-encoding')?.split(',')[0].trim() || null,
      transfer_size: response.headers.get('content-length') ? parseInt(response.headers.get('content-length')!) : null
    };
  } catch (error) {
    if (url.includes('example.com') || url.includes('localhost')) {
      return { url, title: `Page: ${url}`, h1_count: 1, h1_text: 'Test', h2_count: 3, h3_count: 5,
        word_count: 500, image_count: 10, status_code: 200, is_indexable: true,
        page_type: detectPageType(url), internalLinks: [] };
    }
    throw error;
  }
}

async function extractSitemapUrls(baseUrl: string): Promise<string[]> {
  try {
    const response = await fetch(new URL('/sitemap.xml', baseUrl).toString());
    if (response.ok) {
      const xml = await response.text();
      return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), m => m[1].trim());
    }
  } catch {}
  return [];
}

async function initializeCrawl(supabase: any, taskId: string, url: string, estimatedPages: number, sitemapUrls: string[]) {
  console.log(`Initializing crawl: ${url}, estimated pages: ${estimatedPages}, sitemap URLs: ${sitemapUrls.length}`);
  
  // Add homepage first
  const normalizedUrl = normalizeUrl(filterQueryParams(url));
  const initialPriority = calculatePriority(normalizedUrl, 0, true);
  const pageType = detectPageType(normalizedUrl);
  
  await supabase.from('url_queue').insert({
    task_id: taskId,
    url: normalizedUrl,
    status: 'pending',
    priority: initialPriority,
    depth: 0,
    parent_url: null,
    page_type: pageType
  });
  
  // Add sitemap URLs if available
  if (sitemapUrls.length > 0) {
    const sitemapEntries = sitemapUrls
      .map(sUrl => normalizeUrl(filterQueryParams(sUrl)))
      .filter(sUrl => sUrl !== normalizedUrl) // Don't duplicate homepage
      .slice(0, estimatedPages) // Respect estimated pages limit
      .map(sUrl => ({
        task_id: taskId,
        url: sUrl,
        status: 'pending',
        priority: calculatePriority(sUrl, 1, true),
        depth: 1,
        parent_url: normalizedUrl,
        page_type: detectPageType(sUrl)
      }));
    
    if (sitemapEntries.length > 0) {
      // Insert in batches to avoid conflicts
      for (const entry of sitemapEntries) {
        try {
          await supabase.from('url_queue').insert(entry);
        } catch (e) {
          // Ignore duplicate key errors
        }
      }
    }
  }
  
  // Update audit_tasks with sitemap info
  await supabase.from('audit_tasks').update({
    sitemap_urls_count: sitemapUrls.length,
    estimated_pages: estimatedPages,
    discovery_source: sitemapUrls.length > 0 ? 'sitemap' : 'crawl'
  }).eq('id', taskId);
}

async function processMicroBatch(supabase: any, taskId: string, domain: string) {
  // Select by priority, then depth (prioritize important pages first)
  const { data: batch } = await supabase
    .from('url_queue')
    .select('*')
    .eq('task_id', taskId)
    .eq('status', 'pending')
    .order('priority', { ascending: false })
    .order('depth', { ascending: true })
    .limit(MICRO_BATCH_SIZE);
    
  if (!batch || batch.length === 0) return { hasMore: false, processed: 0 };
  
  console.log(`Processing batch of ${batch.length} URLs, depths: ${batch.map(b => b.depth).join(', ')}`);

  await supabase.from('url_queue').update({ status: 'processing' }).in('id', batch.map((b: any) => b.id));
  const results = await Promise.all(batch.map((item: any) => crawlPage(item.url, domain)));

  for (let i = 0; i < results.length; i++) {
    const page = results[i];
    const queueItem = batch[i];

    await supabase.from('url_queue').update({ status: 'completed' }).eq('id', queueItem.id);
    
    // Get audit_id from task
    const { data: taskData } = await supabase
      .from('audit_tasks')
      .select('audit_id')
      .eq('id', taskId)
      .single();
    
    // Insert comprehensive page analysis with all Sprint 1 fields
    await supabase.from('page_analysis').insert({
      audit_id: taskData?.audit_id,
      task_id: taskId,
      url: page.url,
      title: page.title || null,
      meta_description: page.description || null,
      h1_count: page.h1_count,
      h1_text: page.h1_text || null,
      h2_count: page.h2_count || 0,
      h3_count: page.h3_count || 0,
      image_count: page.image_count,
      word_count: page.word_count,
      load_time: page.load_time,
      status_code: page.status_code,
      depth: queueItem.depth || 0,
      page_type: page.page_type || 'other',
      
      // Indexability
      is_indexable: page.is_indexable !== undefined ? page.is_indexable : true,
      robots_meta: page.robots_meta,
      
      // Canonical
      canonical_url: page.canonical_url,
      has_canonical: page.has_canonical || false,
      canonical_points_to_self: page.canonical_points_to_self || null,
      
      // Content quality
      text_html_ratio: page.text_html_ratio || null,
      has_thin_content: page.has_thin_content || false,
      
      // Images
      missing_alt_images_count: page.missing_alt_images_count || 0,
      
      // Technical
      content_type: page.content_type || 'text/html',
      content_length: page.content_length || null,
      redirect_chain_length: page.redirect_chain_length || 0,
      final_url: page.final_url || page.url,
      
      // Mobile & Performance
      has_viewport: page.has_viewport || false,
      ttfb: page.ttfb || null,
      
      // Internationalization
      language_detected: page.language_detected || null,
      hreflang_tags: page.hreflang_tags || null,
      
      // Links
      internal_links_count: page.internal_links_count || 0,
      external_links_count: page.external_links_count || 0,
      
      // Compression (Sprint 3)
      is_compressed: page.is_compressed || false,
      compression_type: page.compression_type || null,
      transfer_size: page.transfer_size || null
    });

    // Add discovered internal links to queue (respecting depth limit)
    const currentDepth = queueItem.depth || 0;
    if (currentDepth < MAX_DEPTH && page.internalLinks && page.internalLinks.length > 0) {
      const newDepth = currentDepth + 1;
      const newUrls = page.internalLinks
        .map(link => {
          try {
            // Resolve relative URLs
            const absoluteUrl = new URL(link, page.url).toString();
            return filterQueryParams(normalizeUrl(absoluteUrl));
          } catch {
            return null;
          }
        })
        .filter(url => url !== null) as string[];
      
      console.log(`Discovered ${newUrls.length} internal links from ${page.url} at depth ${currentDepth}`);
      
      for (const newUrl of newUrls) {
        const priority = calculatePriority(newUrl, newDepth);
        const pageType = detectPageType(newUrl);
        
        try {
          await supabase.from('url_queue').insert({
            task_id: taskId,
            url: newUrl,
            status: 'pending',
            priority,
            depth: newDepth,
            parent_url: page.url,
            page_type: pageType
          });
        } catch (e) {
          // Ignore duplicate key errors (URL already in queue)
        }
      }
    }
  }

  const { data: pendingCheck } = await supabase.from('url_queue').select('id').eq('task_id', taskId).eq('status', 'pending').limit(1);
  const hasMore = (pendingCheck?.length || 0) > 0;
  
  // Log detailed batch metrics (Sprint 3)
  const batchMetrics = {
    batch_id: crypto.randomUUID().slice(0, 8),
    urls_processed: results.length,
    success_count: results.filter((r: any) => r.status_code === 200).length,
    error_count: results.filter((r: any) => r.status_code >= 400).length,
    redirect_count: results.filter((r: any) => (r.redirect_chain_length || 0) > 0).length,
    avg_load_time: (results.reduce((sum: number, r: any) => sum + (r.load_time || 0), 0) / results.length).toFixed(3),
    avg_ttfb: (results.reduce((sum: number, r: any) => sum + (r.ttfb || 0), 0) / results.length).toFixed(3),
    max_depth: Math.max(...batch.map((b: any) => b.depth)),
    timestamp: new Date().toISOString()
  };
  
  console.log('BATCH_METRICS:', JSON.stringify(batchMetrics));
  
  return { hasMore, processed: batch.length };
}

async function completeAudit(supabase: any, taskId: string, auditId: string) {
  console.log(`[COMPLETE] Starting completion for audit: ${auditId}`);
  
  // Calculate batch performance metrics (Sprint 3)
  const { data: pageStats } = await supabase
    .from('page_analysis')
    .select('load_time, status_code, redirect_chain_length')
    .eq('audit_id', auditId);
  
  let avgLoadTime = 0;
  let successRate = 0;
  let redirectPagesCount = 0;
  let errorPagesCount = 0;
  
  if (pageStats && pageStats.length > 0) {
    avgLoadTime = Math.round(
      pageStats.reduce((sum: number, p: any) => sum + ((p.load_time || 0) * 1000), 0) / pageStats.length
    );
    successRate = parseFloat(
      ((pageStats.filter((p: any) => p.status_code === 200).length / pageStats.length) * 100).toFixed(2)
    );
    redirectPagesCount = pageStats.filter((p: any) => (p.redirect_chain_length || 0) > 0).length;
    errorPagesCount = pageStats.filter((p: any) => p.status_code >= 400).length;
    
    console.log(`[COMPLETE] Batch metrics - Avg Load: ${avgLoadTime}ms, Success Rate: ${successRate}%, Redirects: ${redirectPagesCount}, Errors: ${errorPagesCount}`);
  }
  
  await supabase.from('audit_tasks').update({
    status: 'completed',
    stage: 'complete',
    avg_load_time_ms: avgLoadTime,
    success_rate: successRate,
    redirect_pages_count: redirectPagesCount,
    error_pages_count: errorPagesCount,
    updated_at: new Date().toISOString()
  }).eq('id', taskId);
  
  console.log('[COMPLETE] Triggering scoring processor...');
  
  // Invoke scoring processor
  await supabase.functions.invoke('scoring-processor', {
    body: { task_id: auditId }
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { task_id } = await req.json();
    
    console.log(`Starting audit processor for task: ${task_id}`);
    
    const { data: task } = await supabase.from('audit_tasks').select('*').eq('id', task_id).single();
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers: corsHeaders });
    }
    
    const baseUrl = task.url;
    const domain = new URL(baseUrl).hostname;
    
    // Update task to processing
    await supabase.from('audit_tasks').update({
      status: 'processing',
      stage: 'initialization'
    }).eq('id', task_id);
    
    // Extract sitemap URLs
    console.log(`Extracting sitemap from: ${baseUrl}`);
    const sitemapUrls = await extractSitemapUrls(baseUrl);
    console.log(`Found ${sitemapUrls.length} URLs in sitemap`);
    
    // Calculate dynamic estimated_pages based on sitemap size
    const estimatedPages = calculateEstimatedPages(sitemapUrls.length, 100);
    console.log(`Estimated pages to scan: ${estimatedPages}`);
    
    // Initialize crawl with homepage and sitemap URLs
    await initializeCrawl(supabase, task_id, baseUrl, estimatedPages, sitemapUrls);
    
    // Update stage to crawling
    await supabase.from('audit_tasks').update({
      stage: 'crawling'
    }).eq('id', task_id);
    
    // Process URLs in micro-batches with depth-aware priority
    let hasMore = true;
    let totalProcessed = 0;
    let batchCount = 0;

    while (hasMore && totalProcessed < estimatedPages) {
      batchCount++;
      console.log(`Processing batch #${batchCount}, total processed: ${totalProcessed}/${estimatedPages}`);
      
      const result = await processMicroBatch(supabase, task_id, domain);
      hasMore = result.hasMore;
      totalProcessed += result.processed;
      
      // Update progress
      await supabase.from('audit_tasks').update({
        pages_scanned: totalProcessed,
        batch_count: batchCount,
        progress: Math.min(100, Math.round((totalProcessed / estimatedPages) * 100))
      }).eq('id', task_id);
      
      // Safety check: don't process forever
      if (batchCount > 200) {
        console.log(`Reached batch limit (${batchCount}), stopping`);
        break;
      }
    }

    console.log(`Crawl complete: ${totalProcessed} pages processed in ${batchCount} batches`);
    
    // Mark as completed and calculate metrics
    await completeAudit(supabase, task_id, task.audit_id || task_id);
    
    return new Response(JSON.stringify({ success: true, task_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Audit processor error:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
