
/**
 * Сервис для более глубокого анализа сайта
 */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlCache } from './linkExtraction';

export interface BrokenLink {
  url: string;
  statusCode: number;
  fromPage: string;
  linkText: string;
}

export interface Redirect {
  url: string;
  redirectsTo: string;
  statusCode: number;
  fromPage: string;
}

export interface DuplicatePage {
  urls: string[];
  contentHash: string;
  contentLength: number;
  title: string;
}

export interface DuplicateMetaTag {
  tag: string;
  value: string;
  pages: string[];
}

export interface PageNode {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  pageRank: number;
  level: number;
}

export interface SiteStructure {
  nodes: PageNode[];
  links: { source: number; target: number; strength: number }[];
}

export interface PageContent {
  url: string;
  title: string;
  content: string;
  contentHash: string;
  uniquenessScore: number;
}

export interface ContentAnalysisResult {
  uniquePages: number;
  duplicatePages: DuplicatePage[];
  overallUniqueness: number;
  pageContents: PageContent[];
}

/**
 * Обнаружение битых ссылок на сайте
 */
export const detectBrokenLinks = async (
  domain: string,
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<{ brokenLinks: BrokenLink[]; redirects: Redirect[] }> => {
  const brokenLinks: BrokenLink[] = [];
  const redirects: Redirect[] = [];
  const sampleSize = Math.min(urls.length, 100); // Ограничиваем количество проверяемых URL
  const samplesToCheck = urls.slice(0, sampleSize);
  
  let processed = 0;
  
  for (const pageUrl of samplesToCheck) {
    try {
      // Извлекаем ссылки со страницы
      const response = await axios.get(pageUrl, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      const links = $('a[href]').map((_, el) => {
        return {
          url: $(el).attr('href'),
          text: $(el).text().trim() || 'Без текста'
        };
      }).get();
      
      // Проверяем каждую ссылку
      for (const link of links) {
        if (!link.url) continue;
        
        try {
          let fullUrl = link.url;
          if (link.url.startsWith('/')) {
            fullUrl = `https://${domain}${link.url}`;
          } else if (!link.url.match(/^https?:\/\//)) {
            fullUrl = `https://${domain}/${link.url}`;
          }
          
          const linkCheck = await axios.get(fullUrl, { 
            maxRedirects: 0,
            validateStatus: (status) => true // Принимаем любой статус
          });
          
          if (linkCheck.status >= 300 && linkCheck.status < 400) {
            // Это редирект
            redirects.push({
              url: fullUrl,
              redirectsTo: linkCheck.headers.location || 'Неизвестно',
              statusCode: linkCheck.status,
              fromPage: pageUrl
            });
          } else if (linkCheck.status >= 400) {
            // Битая ссылка
            brokenLinks.push({
              url: fullUrl,
              statusCode: linkCheck.status,
              fromPage: pageUrl,
              linkText: link.text
            });
          }
        } catch (error) {
          // Ошибка запроса также считается битой ссылкой
          brokenLinks.push({
            url: link.url,
            statusCode: 0,
            fromPage: pageUrl,
            linkText: link.text
          });
        }
      }
      
      processed++;
      if (onProgress) {
        onProgress(processed, sampleSize);
      }
      
    } catch (error) {
      console.error(`Ошибка при анализе страницы ${pageUrl}:`, error);
    }
  }
  
  return { brokenLinks, redirects };
};

/**
 * Обнаружение дубликатов страниц
 */
export const detectDuplicates = async (
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<{ duplicatePages: DuplicatePage[]; duplicateMeta: DuplicateMetaTag[] }> => {
  const contentHashes = new Map<string, DuplicatePage>();
  const metaTags = new Map<string, DuplicateMetaTag>();
  const sampleSize = Math.min(urls.length, 200);
  const samplesToCheck = urls.slice(0, sampleSize);
  
  let processed = 0;
  
  for (const url of samplesToCheck) {
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Генерируем хеш содержимого страницы
      const contentText = $('body').text().replace(/\s+/g, ' ').trim();
      const contentHash = hashString(contentText);
      
      // Проверяем дубликаты содержимого
      if (contentHashes.has(contentHash)) {
        const duplicate = contentHashes.get(contentHash)!;
        duplicate.urls.push(url);
      } else {
        contentHashes.set(contentHash, {
          urls: [url],
          contentHash,
          contentLength: contentText.length,
          title: $('title').text() || 'Без заголовка'
        });
      }
      
      // Проверяем дубликаты мета-тегов
      const metaDescription = $('meta[name="description"]').attr('content');
      if (metaDescription) {
        const metaKey = `description:${metaDescription}`;
        if (metaTags.has(metaKey)) {
          const duplicate = metaTags.get(metaKey)!;
          duplicate.pages.push(url);
        } else {
          metaTags.set(metaKey, {
            tag: 'description',
            value: metaDescription,
            pages: [url]
          });
        }
      }
      
      // Проверяем дубликаты title
      const title = $('title').text();
      if (title) {
        const titleKey = `title:${title}`;
        if (metaTags.has(titleKey)) {
          const duplicate = metaTags.get(titleKey)!;
          duplicate.pages.push(url);
        } else {
          metaTags.set(titleKey, {
            tag: 'title',
            value: title,
            pages: [url]
          });
        }
      }
      
      processed++;
      if (onProgress) {
        onProgress(processed, sampleSize);
      }
      
    } catch (error) {
      console.error(`Ошибка при анализе страницы ${url}:`, error);
    }
  }
  
  // Фильтруем только дубликаты (больше одной страницы)
  const duplicatePages = Array.from(contentHashes.values())
    .filter(item => item.urls.length > 1);
  
  const duplicateMeta = Array.from(metaTags.values())
    .filter(item => item.pages.length > 1);
  
  return { duplicatePages, duplicateMeta };
};

/**
 * Создание карты сайта на основе обнаруженных URL
 */
export const generateSitemap = (domain: string, urls: string[]): string => {
  const filteredUrls = urls.filter(url => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === domain;
    } catch {
      return false;
    }
  });
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const url of filteredUrls) {
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
  }
  
  sitemap += '</urlset>';
  return sitemap;
};

/**
 * Визуализация структуры сайта и расчет PageRank
 */
export const analyzeSiteStructure = async (
  domain: string,
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<SiteStructure> => {
  const nodes: PageNode[] = [];
  const edges: Map<string, Set<string>> = new Map();
  const urlToIndex = new Map<string, number>();
  
  const sampleSize = Math.min(urls.length, 200);
  const samplesToCheck = urls.slice(0, sampleSize);
  
  let processed = 0;
  
  // Инициализируем узлы
  samplesToCheck.forEach((url, index) => {
    urlToIndex.set(url, index);
    nodes.push({
      url,
      title: '',
      incomingLinks: 0,
      outgoingLinks: 0,
      pageRank: 1, // Начальное значение
      level: 0
    });
    edges.set(url, new Set());
  });
  
  // Анализируем связи
  for (const [index, url] of samplesToCheck.entries()) {
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Обновляем заголовок
      nodes[index].title = $('title').text() || url;
      
      // Рассчитываем уровень URL (глубину от корня)
      const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
      nodes[index].level = pathSegments.length;
      
      // Собираем ссылки
      const outLinks: string[] = [];
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        
        try {
          let targetUrl = href;
          if (href.startsWith('/')) {
            targetUrl = `https://${domain}${href}`;
          } else if (!href.startsWith('http')) {
            targetUrl = `https://${domain}/${href}`;
          }
          
          const targetUrlObj = new URL(targetUrl);
          if (targetUrlObj.hostname !== domain) return; // Пропускаем внешние ссылки
          
          const normalizedUrl = targetUrl.split('#')[0].split('?')[0]; // Убираем фрагменты и параметры
          if (urlToIndex.has(normalizedUrl)) {
            outLinks.push(normalizedUrl);
            edges.get(url)!.add(normalizedUrl);
          }
        } catch {
          // Пропускаем некорректные URL
        }
      });
      
      nodes[index].outgoingLinks = outLinks.length;
      
      processed++;
      if (onProgress) {
        onProgress(processed, sampleSize);
      }
    } catch (error) {
      console.error(`Ошибка при анализе структуры страницы ${url}:`, error);
    }
  }
  
  // Обновляем число входящих ссылок
  for (const [url, targets] of edges.entries()) {
    for (const target of targets) {
      const targetIndex = urlToIndex.get(target)!;
      nodes[targetIndex].incomingLinks++;
    }
  }
  
  // Расчёт PageRank (упрощенная реализация)
  calculatePageRank(nodes, edges, urlToIndex);
  
  // Преобразуем в формат для визуализации
  const links = [];
  for (const [source, targets] of edges.entries()) {
    const sourceIndex = urlToIndex.get(source)!;
    for (const target of targets) {
      const targetIndex = urlToIndex.get(target)!;
      links.push({
        source: sourceIndex,
        target: targetIndex,
        strength: 1
      });
    }
  }
  
  return { nodes, links };
};

/**
 * Упрощенная реализация алгоритма PageRank
 */
function calculatePageRank(
  nodes: PageNode[], 
  edges: Map<string, Set<string>>, 
  urlToIndex: Map<string, number>, 
  iterations = 10, 
  dampingFactor = 0.85
) {
  const n = nodes.length;
  let pageRanks = nodes.map(() => 1 / n);
  
  for (let iter = 0; iter < iterations; iter++) {
    const newPageRanks = new Array(n).fill((1 - dampingFactor) / n);
    
    for (const [url, targets] of edges.entries()) {
      const sourceIndex = urlToIndex.get(url)!;
      const sourceRank = pageRanks[sourceIndex];
      const outDegree = targets.size || 1; // Избегаем деления на ноль
      
      for (const target of targets) {
        const targetIndex = urlToIndex.get(target)!;
        newPageRanks[targetIndex] += dampingFactor * sourceRank / outDegree;
      }
    }
    
    pageRanks = newPageRanks;
  }
  
  // Нормализуем и обновляем значения
  const sum = pageRanks.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    nodes[i].pageRank = pageRanks[i] / sum * 100; // Как процент
  }
}

/**
 * Анализ уникальности контента
 */
export const analyzeContentUniqueness = async (
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<ContentAnalysisResult> => {
  const pageContents: PageContent[] = [];
  const contentHashes = new Map<string, string[]>();
  const sampleSize = Math.min(urls.length, 100);
  const samplesToCheck = urls.slice(0, sampleSize);
  
  let processed = 0;
  
  for (const url of samplesToCheck) {
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const $ = cheerio.load(response.data);
      
      // Извлекаем основной контент
      const title = $('title').text() || 'Без заголовка';
      const mainContent = $('main, article, .content, #content, #main').text() || $('body').text();
      const cleanContent = mainContent
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000); // Берем первые 5000 символов для анализа
      
      const contentHash = hashString(cleanContent);
      
      // Сохраняем контент
      pageContents.push({
        url,
        title,
        content: cleanContent,
        contentHash,
        uniquenessScore: 100 // Изначально считаем уникальным
      });
      
      // Отслеживаем хеши для обнаружения дубликатов
      if (contentHashes.has(contentHash)) {
        contentHashes.get(contentHash)!.push(url);
      } else {
        contentHashes.set(contentHash, [url]);
      }
      
      processed++;
      if (onProgress) {
        onProgress(processed, sampleSize);
      }
    } catch (error) {
      console.error(`Ошибка при анализе контента страницы ${url}:`, error);
    }
  }
  
  // Находим дубликаты
  const duplicatePages: DuplicatePage[] = [];
  for (const [hash, urls] of contentHashes.entries()) {
    if (urls.length > 1) {
      const content = pageContents.find(p => p.contentHash === hash);
      duplicatePages.push({
        urls,
        contentHash: hash,
        contentLength: content?.content.length || 0,
        title: content?.title || 'Без заголовка'
      });
      
      // Обновляем оценку уникальности для дубликатов
      for (const url of urls) {
        const page = pageContents.find(p => p.url === url);
        if (page) {
          page.uniquenessScore = 100 / urls.length;
        }
      }
    }
  }
  
  // Вычисляем общую уникальность
  const uniquePages = pageContents.filter(p => p.uniquenessScore === 100).length;
  const overallUniqueness = (uniquePages / pageContents.length) * 100;
  
  return {
    uniquePages,
    duplicatePages,
    overallUniqueness,
    pageContents
  };
};

/**
 * Функция хеширования строки
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
