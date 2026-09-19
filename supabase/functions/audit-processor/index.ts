import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  canonicalizeUrl,
  formatSiteOrigin,
  isSameSite,
  parseSiteOrigin,
  siteOriginAfterRedirects,
  type SiteOrigin,
} from "../_shared/crawl-url.ts";
import { type CompressionInfo, detectCompression } from "../_shared/compression.ts";
import { assertPublicUrlResolved, isPublicUrl } from "../_shared/url-guard.ts";
import { assertServiceRole, authErrorResponse } from "../_shared/auth.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MICRO_BATCH_SIZE = 5;
const PAGE_TIMEOUT = 8000;
const MAX_DEPTH = 5;
/** Сколько карт из индекса карт сайта читаем при запуске. */
const SITEMAP_CHILD_LIMIT = 3;

// Вид адресов сайта (протокол и «www») раньше лежал в переменной модуля. Один
// воркер ведёт несколько запросов сразу: аудит второго сайта переключал её, и
// у первого все ссылки становились «чужими». Теперь вид определяется при
// запуске, хранится в задаче и передаётся параметром.

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

/**
 * Сколько страниц обходим.
 *
 * Раньше на большом сайте выбранный лимит не действовал: формула возвращала
 * треть карты сайта, но не больше трёхсот, — и «быстрый аудит до 10 страниц»
 * молча превращался в обход трёхсот. Лимит должен быть лимитом: обходим не
 * больше, чем попросили, и не больше, чем есть на сайте.
 */
function calculateEstimatedPages(sitemapCount: number, maxPages: number = 100): number {
  if (sitemapCount === 0) return maxPages;
  return Math.min(sitemapCount, maxPages);
}

/** Адрес этого же сайта, по которому можно ходить: http(s), не внутренняя сеть, обычный порт. */
function isCrawlableSiteUrl(rawUrl: string, origin: SiteOrigin | null): boolean {
  try {
    const parsed = new URL(rawUrl);
    return isSameSite(parsed.hostname, origin) && isPublicUrl(parsed.toString());
  } catch {
    return false;
  }
}

interface FetchedPage {
  chain: Array<{ url: string; statusCode: number; location: string }>;
  finalUrl: string;
  chainLength: number;
  /** Ответ последнего шага — его и разбираем. */
  response: Response;
  /** Когда ушёл последний запрос: от него меряется время ответа. */
  startedAt: number;
}

/**
 * Загрузка страницы с ручным проходом переадресаций.
 *
 * Каждый шаг проверяется заново: публичный сайт мог увести переадресацией на
 * http://169.254.169.254 или localhost, а раньше обходчик шёл по любому
 * `Location`. Ответ последнего шага возвращается целиком — раньше страница
 * после цепочки запрашивалась второй раз.
 */
async function fetchWithRedirects(startUrl: string, maxRedirects = 10): Promise<FetchedPage> {
  const chain: FetchedPage['chain'] = [];
  let currentUrl = startUrl;

  for (let hop = 0; ; hop++) {
    await assertPublicUrlResolved(currentUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PAGE_TIMEOUT);
    const startedAt = Date.now();
    let response: Response;
    try {
      response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)' },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const statusCode = response.status;
    const location = response.headers.get('location');
    const isRedirect = statusCode >= 300 && statusCode < 400 && !!location;

    if (!isRedirect || hop >= maxRedirects) {
      return { chain, finalUrl: currentUrl, chainLength: chain.length, response, startedAt };
    }

    const absoluteLocation = new URL(location!, currentUrl).toString();
    chain.push({ url: currentUrl, statusCode, location: absoluteLocation });
    await response.body?.cancel().catch(() => {});
    currentUrl = absoluteLocation;
  }
}

async function crawlPage(url: string, origin: SiteOrigin | null): Promise<any> {
  const fetched = await fetchWithRedirects(url);
  const { response, finalUrl } = fetched;
  const redirectChainLength = fetched.chainLength;

  // Время меряем от запроса самой страницы. Раньше отсчёт шёл до обхода
  // переадресаций, и в «ответ сервера» попадала вся цепочка — страницы
  // помечались медленными на ровном месте.
  const ttfb = Date.now() - fetched.startedAt;
  const html = await response.text();
  const loadTime = Date.now() - fetched.startedAt;
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

  // Относительные ссылки разрешаем от адреса, где страница открылась на самом
  // деле, и сразу отбрасываем mailto:, javascript: и чужие сайты.
  const internalLinks: string[] = [];
  for (const link of allLinks) {
    if (!link || link.startsWith('#')) continue;
    try {
      const absolute = new URL(link, finalUrl);
      if (absolute.protocol !== 'http:' && absolute.protocol !== 'https:') continue;
      if (isSameSite(absolute.hostname, origin)) internalLinks.push(absolute.toString());
    } catch { /* битая ссылка — пропускаем */ }
  }

  // Сравниваем адреса в одном виде: раньше canonical сайта сверялся с
  // переписанным адресом и почти всегда «не совпадал». Битый canonical
  // (пустой шаблон «https://» и подобное) раньше бросал исключение вне
  // try и ронял весь аудит — теперь это просто «не удалось сравнить».
  let canonicalPointsToSelf: boolean | null = null;
  if (canonicalUrl) {
    try {
      canonicalPointsToSelf = canonicalizeUrl(new URL(canonicalUrl, finalUrl).toString(), origin)
        === canonicalizeUrl(finalUrl, origin);
    } catch {
      canonicalPointsToSelf = null;
    }
  }

  return {
    url, title, description, h1: h1Tags, h1_count: h1Tags.length, h1_text: h1Text,
    h2_count: h2Count, h3_count: h3Count, image_count: images.length, word_count: wordCount,
    load_time: Number((loadTime / 1000).toFixed(2)), status_code: response.status,
    links: allLinks, internalLinks, externalLinks: [], images,
    is_indexable: !robotsMeta.toLowerCase().includes('noindex'), robots_meta: robotsMeta || null,
    canonical_url: canonicalUrl, has_canonical: !!canonicalUrl,
    canonical_points_to_self: canonicalPointsToSelf,
    text_html_ratio: textHtmlRatio,
    has_thin_content: wordCount < 150, missing_alt_images_count: missingAltCount,
    content_type: response.headers.get('content-type') || 'text/html',
    content_length: html.length, has_viewport: hasViewport,
    hreflang_tags: hreflangTags.length > 0 ? hreflangTags : null,
    language_detected: languageDetected, internal_links_count: internalLinks.length,
    external_links_count: 0, page_type: detectPageType(url),
    ttfb: Number((ttfb / 1000).toFixed(3)),
    redirect_chain_length: redirectChainLength,
    final_url: finalUrl,
    transfer_size: response.headers.get('content-length') ? parseInt(response.headers.get('content-length')!) : null
  };
}

/** Текст XML по адресу или null. Переадресации проходят через ту же проверку адресов. */
async function fetchXml(url: string): Promise<string | null> {
  try {
    const fetched = await fetchWithRedirects(url, 3);
    if (!fetched.response.ok) {
      await fetched.response.body?.cancel().catch(() => {});
      return null;
    }
    return await fetched.response.text();
  } catch {
    return null;
  }
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function readLocs(xml: string): string[] {
  return Array.from(
    xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/loc>/gi),
    (m) => decodeXmlEntities(m[1].trim()),
  );
}

/**
 * Адреса страниц из карты сайта.
 *
 * Раньше в очередь уходил любой `<loc>`: адреса чужих доменов и внутренней
 * сети, а у индекса карт (WordPress/Yoast) — сами XML-карты, которые потом
 * разбирались как страницы без заголовка и текста и давали замечания в смету.
 * Теперь индекс карт раскрывается (первые несколько карт), XML в обход не
 * идёт, чужие и внутренние адреса отбрасываются.
 */
async function extractSitemapUrls(baseUrl: string, origin: SiteOrigin | null): Promise<string[]> {
  let sitemapUrl: string;
  try {
    sitemapUrl = new URL('/sitemap.xml', baseUrl).toString();
  } catch {
    return [];
  }

  const xml = await fetchXml(sitemapUrl);
  if (!xml) return [];

  let locs = readLocs(xml);
  if (/<sitemapindex[\s>]/i.test(xml)) {
    const children = locs.filter((loc) => isCrawlableSiteUrl(loc, origin)).slice(0, SITEMAP_CHILD_LIMIT);
    const nested = await Promise.all(children.map((child) => fetchXml(child)));
    locs = nested.flatMap((childXml) => (childXml ? readLocs(childXml) : []));
  }

  return locs.filter((loc) => {
    if (!isCrawlableSiteUrl(loc, origin)) return false;
    return !/\.xml(\.gz)?$/i.test(new URL(loc).pathname);
  });
}

/**
 * Ставит адреса в очередь, пропуская уже поставленные.
 *
 * Раньше каждая ссылка добавлялась обычной вставкой, обёрнутой в try/catch с
 * пометкой «ошибки дублей игнорируем». Но клиент базы не бросает исключение на
 * ошибке вставки, а возвращает её в ответе, и никто её не смотрел. Сквозные
 * ссылки — меню, подвал — попадали в очередь заново с каждой страницы, и сайт
 * обходился по кругу. Теперь повторы отсекает база: уникальность пары
 * «задача + адрес», повторная вставка молча пропускается.
 */
async function enqueueUrls(supabase: any, entries: any[]): Promise<void> {
  if (entries.length === 0) return;

  const { error } = await supabase
    .from('url_queue')
    .upsert(entries, { onConflict: 'task_id,url', ignoreDuplicates: true });

  if (error) {
    console.error('Не удалось поставить адреса в очередь:', error.message);
  }
}

/**
 * Вид адресов сайта по стартовой странице после переадресаций. Если страница
 * не открылась, остаёмся при введённом адресе — обход сам запишет ошибку.
 */
async function resolveSiteOrigin(url: string): Promise<SiteOrigin | null> {
  try {
    const fetched = await fetchWithRedirects(url);
    await fetched.response.body?.cancel().catch(() => {});
    return siteOriginAfterRedirects(url, fetched.finalUrl);
  } catch (error) {
    console.warn('Стартовая страница не открылась, вид адресов берём из введённого:', error instanceof Error ? error.message : error);
    return parseSiteOrigin(url);
  }
}

async function initializeCrawl(
  supabase: any,
  taskId: string,
  url: string,
  estimatedPages: number,
  sitemapUrls: string[],
  origin: SiteOrigin | null,
) {
  console.log(`Initializing crawl: ${url}, estimated pages: ${estimatedPages}, sitemap URLs: ${sitemapUrls.length}`);

  // Add homepage first
  const normalizedUrl = canonicalizeUrl(url, origin);
  const initialPriority = calculatePriority(normalizedUrl, 0, true);
  const pageType = detectPageType(normalizedUrl);

  await enqueueUrls(supabase, [{
    task_id: taskId,
    url: normalizedUrl,
    status: 'pending',
    priority: initialPriority,
    depth: 0,
    parent_url: null,
    page_type: pageType
  }]);

  // Add sitemap URLs if available
  if (sitemapUrls.length > 0) {
    const sitemapEntries = Array.from(new Set(sitemapUrls.map(sUrl => canonicalizeUrl(sUrl, origin))))
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
      await enqueueUrls(supabase, sitemapEntries);
    }
  }

  // Update audit_tasks with sitemap info
  await supabase.from('audit_tasks').update({
    sitemap_urls_count: sitemapUrls.length,
    estimated_pages: estimatedPages,
    discovery_source: sitemapUrls.length > 0 ? 'sitemap' : 'crawl'
  }).eq('id', taskId);
}

/**
 * Сохраняет в задаче вид адресов и результат проверки сжатия: следующие заходы
 * обработчика (он работает пачками, каждый заход — отдельный вызов) берут их
 * отсюда. Возвращает false, если сохранить не удалось (например, миграция
 * 20260916180000 ещё не применена).
 */
async function saveSiteFacts(
  supabase: any,
  taskId: string,
  origin: SiteOrigin | null,
  compression: CompressionInfo,
): Promise<boolean> {
  const { error } = await supabase.from('audit_tasks').update({
    site_origin: formatSiteOrigin(origin),
    site_is_compressed: compression.compressed,
    site_compression_type: compression.type,
  }).eq('id', taskId);

  if (error) {
    console.error('Не удалось сохранить вид адресов и сжатие в задаче:', error.message);
    return false;
  }
  return true;
}

async function processMicroBatch(
  supabase: any,
  taskId: string,
  auditId: string | null,
  origin: SiteOrigin | null,
  compression: CompressionInfo,
) {
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

  console.log(`Processing batch of ${batch.length} URLs, depths: ${batch.map((b: any) => b.depth).join(', ')}`);

  await supabase.from('url_queue').update({ status: 'processing' }).in('id', batch.map((b: any) => b.id));

  // Одна недоступная страница (таймаут, DNS, переадресация во внутреннюю сеть)
  // раньше роняла весь аудит через Promise.all, а возобновление падало на ней
  // же снова. Теперь такая страница помечается в очереди, обход идёт дальше.
  const settled: PromiseSettledResult<any>[] = await Promise.allSettled(
    (batch as any[]).map((item: any) => crawlPage(item.url, origin))
  );
  const pages: any[] = [];

  for (let i = 0; i < settled.length; i++) {
    const outcome = settled[i];
    const queueItem = batch[i];

    if (outcome.status === 'rejected') {
      const reason = outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason);
      console.error(`Не удалось загрузить ${queueItem.url}:`, reason);
      await supabase
        .from('url_queue')
        .update({ status: 'failed', error_message: reason.slice(0, 500) })
        .eq('id', queueItem.id);
      continue;
    }

    const page = outcome.value;
    pages.push(page);

    await supabase.from('url_queue').update({ status: 'completed' }).eq('id', queueItem.id);

    // Insert comprehensive page analysis with all Sprint 1 fields
    // Повторный разбор того же адреса (возобновление аудита, ссылка на себя)
    // обновляет запись, а не плодит вторую: страницы считаются по адресам.
    const { error: insertError } = await supabase
      .from('page_analysis')
      .upsert({
      audit_id: auditId,
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
      // «?? null», а не «|| null»: false («canonical указывает на другую
      // страницу») превращался в null, и замечание wrong_canonical не
      // выставлялось никогда.
      canonical_points_to_self: page.canonical_points_to_self ?? null,

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
      // Сжатие проверено один раз на задачу, по стартовой странице. Не
      // проверили — пишем «неизвестно»: раньше здесь стояло `|| false`, и
      // непроверенное превращалось в «сжатия нет» с оплатой работ по смете.
      is_compressed: compression.compressed,
      compression_type: compression.type,
      transfer_size: page.transfer_size || null
      }, { onConflict: 'task_id,url' });

    if (insertError) {
      console.error('Failed to insert page_analysis:', {
        error: insertError,
        audit_id: auditId,
        task_id: taskId,
        url: page.url
      });
      throw new Error(`Page analysis insert failed: ${insertError.message}`);
    }

    // Add discovered internal links to queue (respecting depth limit)
    const currentDepth = queueItem.depth || 0;
    if (currentDepth < MAX_DEPTH && page.internalLinks && page.internalLinks.length > 0) {
      const newDepth = currentDepth + 1;
      const newUrls = Array.from(new Set<string>(
        (page.internalLinks as string[])
          .filter((link) => isPublicUrl(link))
          .map((link) => canonicalizeUrl(link, origin))
      ));

      console.log(`Discovered ${newUrls.length} internal links from ${page.url} at depth ${currentDepth}`);

      await enqueueUrls(supabase, newUrls.map(newUrl => ({
        task_id: taskId,
        url: newUrl,
        status: 'pending',
        priority: calculatePriority(newUrl, newDepth),
        depth: newDepth,
        parent_url: page.url,
        page_type: detectPageType(newUrl)
      })));
    }
  }

  const { data: pendingCheck } = await supabase.from('url_queue').select('id').eq('task_id', taskId).eq('status', 'pending').limit(1);
  const hasMore = (pendingCheck?.length || 0) > 0;

  // Log detailed batch metrics (Sprint 3)
  const loaded = pages.length || 1;
  const batchMetrics = {
    batch_id: crypto.randomUUID().slice(0, 8),
    urls_processed: batch.length,
    failed_count: batch.length - pages.length,
    success_count: pages.filter((r: any) => r.status_code === 200).length,
    error_count: pages.filter((r: any) => r.status_code >= 400).length,
    redirect_count: pages.filter((r: any) => (r.redirect_chain_length || 0) > 0).length,
    avg_load_time: (pages.reduce((sum: number, r: any) => sum + (r.load_time || 0), 0) / loaded).toFixed(3),
    avg_ttfb: (pages.reduce((sum: number, r: any) => sum + (r.ttfb || 0), 0) / loaded).toFixed(3),
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

  // Invoke scoring processor with retry mechanism
  let scoringSuccess = false;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  while (!scoringSuccess && retryCount < MAX_RETRIES) {
    try {
      console.log(`[COMPLETE] Scoring attempt ${retryCount + 1}/${MAX_RETRIES}`);
      const scoringStartTime = Date.now();

      const { data: scoringResult, error: scoringError } = await supabase.functions.invoke('scoring-processor', {
        body: { task_id: taskId }
      });

      if (scoringError) {
        throw scoringError;
      }

      const scoringDuration = Date.now() - scoringStartTime;
      console.log(`[COMPLETE] ✅ Scoring completed in ${scoringDuration}ms`);
      console.log('[COMPLETE] Scoring result:', scoringResult);
      scoringSuccess = true;

    } catch (error) {
      retryCount++;
      console.error(`[COMPLETE] ❌ Scoring attempt ${retryCount} failed:`, error.message);

      if (retryCount >= MAX_RETRIES) {
        console.error('[COMPLETE] All retry attempts exhausted');
        await supabase.from('audit_tasks').update({
          error_message: `Scoring failed after ${MAX_RETRIES} attempts: ${error.message}`,
          updated_at: new Date().toISOString()
        }).eq('id', taskId);
      } else {
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`[COMPLETE] Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}

// Background processing function
async function processAuditInBackground(task_id: string) {
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

  try {
    const { data: task } = await supabase.from('audit_tasks').select('*').eq('id', task_id).single();
    if (!task) {
      console.error(`Task not found: ${task_id}`);
      return;
    }

    // Обход идёт пачками, каждая — отдельный заход функции. Вид адресов и
    // сжатие определены при запуске и лежат в задаче, так что все заходы
    // приводят ссылки к одному облику сайта. У задач, запущенных до этой
    // правки, вида в задаче нет — для них остаётся введённый адрес, как и
    // было, чтобы не разойтись с уже поставленной очередью.
    const origin = parseSiteOrigin(task.site_origin || task.url);
    const compression: CompressionInfo = {
      compressed: task.site_is_compressed ?? null,
      type: task.site_compression_type ?? null,
    };

    const estimatedPages = task.estimated_pages || 100;

    // Process URLs in micro-batches
    let hasMore = true;
    let totalProcessed = task.pages_scanned || 0;
    let batchCount = task.batch_count || 0;
    const MAX_BATCHES_PER_RUN = 3; // Process max 3 batches per invocation (~25s) to stay under CPU limit

    let batchesThisRun = 0;
    while (hasMore && totalProcessed < estimatedPages && batchesThisRun < MAX_BATCHES_PER_RUN) {
      batchCount++;
      batchesThisRun++;
      console.log(`Processing batch #${batchCount}, total processed: ${totalProcessed}/${estimatedPages}`);

      const result = await processMicroBatch(supabase, task_id, task.audit_id ?? null, origin, compression);
      hasMore = result.hasMore;
      totalProcessed += result.processed;

      // Update progress
      await supabase.from('audit_tasks').update({
        pages_scanned: totalProcessed,
        batch_count: batchCount,
        progress: Math.min(100, Math.round((totalProcessed / estimatedPages) * 100))
      }).eq('id', task_id);

      // Safety check
      if (batchCount > 200) {
        console.log(`Reached batch limit (${batchCount}), stopping`);
        hasMore = false;
        break;
      }
    }

    // If there's more work, re-invoke ourselves
    if (hasMore && totalProcessed < estimatedPages) {
      console.log(`More work remaining, re-invoking processor...`);
      await supabase.functions.invoke('audit-processor', {
        body: { task_id }
      });
    } else {
      console.log(`Crawl complete: ${totalProcessed} pages processed in ${batchCount} batches`);

      // Ни одна страница не открылась — это провал аудита, а не «завершён с
      // нулём страниц»: иначе оценка падала на пустых данных, а аудит висел
      // незавершённым без понятной причины.
      const { count: analyzedCount } = await supabase
        .from('page_analysis')
        .select('id', { count: 'exact', head: true })
        .eq('task_id', task_id);

      if (!analyzedCount) {
        const { data: failedItem } = await supabase
          .from('url_queue')
          .select('url, error_message')
          .eq('task_id', task_id)
          .eq('status', 'failed')
          .limit(1)
          .maybeSingle();
        throw new Error(
          failedItem?.error_message
            ? `Не удалось загрузить ни одной страницы сайта: ${failedItem.error_message}`
            : 'Не удалось загрузить ни одной страницы сайта'
        );
      }

      await completeAudit(supabase, task_id, task.audit_id || task_id);
    }
  } catch (error) {
    console.error('Background processing error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update audit_tasks to failed
    await supabase.from('audit_tasks').update({
      status: 'failed',
      error_message: errorMessage
    }).eq('id', task_id);

    // Also update audits table if audit_id exists
    const { data: taskData } = await supabase
      .from('audit_tasks')
      .select('audit_id')
      .eq('id', task_id)
      .single();

    if (taskData?.audit_id) {
      console.log('[ERROR] Updating audits table to failed status');
      await supabase.from('audits').update({
        status: 'failed',
        error_message: errorMessage
      }).eq('id', taskData.audit_id);
    }
  }
}

/** С каких статусов задачу можно запустить с нуля. */
const STARTABLE_STATUSES = ['queued', 'pending'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Обработчик работает служебным ключом и был открыт всем: любой, кто знал
  // task_id, мог перезапустить завершённый аудит — замечания и смета
  // задваивались, хозяину снова приходили уведомления. Зовут его только свои:
  // audit-start, audit-status, audit-resume и он сам при переходе к следующей
  // пачке — все служебным ключом.
  try {
    assertServiceRole(req);
  } catch (err) {
    const denied = authErrorResponse(err, corsHeaders);
    if (denied) return denied;
    throw err;
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    const { task_id } = await req.json();

    console.log(`Starting audit processor for task: ${task_id}`);

    const { data: task } = await supabase.from('audit_tasks').select('*').eq('id', task_id).single();
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // If task is already processing, continue from where it left off
    if (task.status === 'processing') {
      console.log(`Continuing existing task processing...`);
      EdgeRuntime.waitUntil(processAuditInBackground(task_id));
      return new Response(JSON.stringify({ success: true, task_id, status: 'continuing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Завершённую, отменённую или упавшую задачу заново не запускаем: для
    // упавшей есть audit-resume, он сам переводит её в обработку.
    if (!STARTABLE_STATUSES.includes(task.status)) {
      return new Response(
        JSON.stringify({ success: false, error: `Задачу в статусе «${task.status}» запустить нельзя` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = task.url;

    // Update task to processing
    await supabase.from('audit_tasks').update({
      status: 'processing',
      stage: 'initialization'
    }).eq('id', task_id);

    // Вид адресов — по тому, где стартовая страница открылась на самом деле.
    const resolvedOrigin = await resolveSiteOrigin(baseUrl);
    const startPage = canonicalizeUrl(baseUrl, resolvedOrigin);

    // Карта сайта и сжатие — параллельно: оба запроса к тому же серверу.
    console.log(`Extracting sitemap from: ${startPage}`);
    const [sitemapUrls, compression] = await Promise.all([
      extractSitemapUrls(startPage, resolvedOrigin),
      detectCompression(startPage),
    ]);
    console.log(`Found ${sitemapUrls.length} URLs in sitemap, compression:`, compression);

    // Если вид не сохранился в задаче, следующие заходы его не узнают и
    // возьмут введённый адрес. Чтобы очередь не разошлась, берём его и сейчас.
    const saved = await saveSiteFacts(supabase, task_id, resolvedOrigin, compression);
    const origin = saved ? resolvedOrigin : parseSiteOrigin(baseUrl);

    // Calculate dynamic estimated_pages
    const estimatedPages = calculateEstimatedPages(sitemapUrls.length, task.estimated_pages || 100);
    console.log(`Estimated pages to scan: ${estimatedPages}`);

    // Initialize crawl
    await initializeCrawl(supabase, task_id, baseUrl, estimatedPages, sitemapUrls, origin);

    // Update stage to crawling
    await supabase.from('audit_tasks').update({
      stage: 'crawling'
    }).eq('id', task_id);

    // Start background processing
    EdgeRuntime.waitUntil(processAuditInBackground(task_id));

    // Return immediately
    return new Response(JSON.stringify({ success: true, task_id, status: 'started' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Audit processor error:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        // Стек остаётся в логах функции: наружу его отдавать нельзя —
        // он раскрывает устройство сервиса.
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
