
import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

// Types for crawler service
export interface CrawlOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  checkImages: boolean;
  checkPerformance: boolean;
  userAgent?: string;
}

export interface PageData {
  url: string;
  statusCode: number;
  title: string | null;
  metaTags: {
    description: string | null;
    keywords: string | null;
    robots: string | null;
    viewport: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
  };
  content: string;
  links: {
    internal: string[];
    external: string[];
    broken: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    large: number;
  };
  performance: {
    size: number;
    loadTime: number | null;
    resourceCount: number;
  };
  issues: {
    critical: string[];
    important: string[];
    opportunities: string[];
  };
  html: string;
}

export interface CrawlResult {
  domain: string;
  pageCount: number;
  pages: Map<string, PageData>;
  sitemap: string;
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
  score: number;
  startTime: Date;
  endTime: Date | null;
}

class CrawlerService {
  private defaultOptions: CrawlOptions = {
    maxPages: 100,
    maxDepth: 5,
    followExternalLinks: false,
    checkImages: true,
    checkPerformance: true,
    userAgent: 'SEOAuditCrawler/1.0'
  };
  
  private activeCrawls: Map<string, CrawlResult> = new Map();
  private pageQueue: Map<string, string[]> = new Map();
  private visitedUrls: Map<string, Set<string>> = new Map();

  /**
   * Start crawling a website
   */
  async startCrawl(url: string, options?: Partial<CrawlOptions>): Promise<string> {
    const crawlId = uuidv4();
    const normalizedUrl = this.normalizeUrl(url);
    const domain = this.extractDomain(normalizedUrl);
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // Initialize crawl result
    const crawlResult: CrawlResult = {
      domain,
      pageCount: 0,
      pages: new Map(),
      sitemap: '',
      issues: {
        critical: 0,
        important: 0,
        opportunities: 0
      },
      score: 0,
      startTime: new Date(),
      endTime: null
    };
    
    this.activeCrawls.set(crawlId, crawlResult);
    this.pageQueue.set(crawlId, [normalizedUrl]);
    this.visitedUrls.set(crawlId, new Set());
    
    // Start the crawl process
    this.processCrawlQueue(crawlId, mergedOptions);
    
    return crawlId;
  }
  
  /**
   * Get the current status of a crawl
   */
  getCrawlStatus(crawlId: string): { 
    completed: boolean; 
    pageCount: number; 
    totalPages: number;
    currentUrl?: string;
  } {
    const crawl = this.activeCrawls.get(crawlId);
    const queue = this.pageQueue.get(crawlId) || [];
    
    if (!crawl) {
      return { completed: false, pageCount: 0, totalPages: 0 };
    }
    
    return {
      completed: !!crawl.endTime,
      pageCount: crawl.pageCount,
      totalPages: crawl.pageCount + queue.length,
      currentUrl: queue[0]
    };
  }
  
  /**
   * Get the results of a completed crawl
   */
  getCrawlResult(crawlId: string): CrawlResult | null {
    return this.activeCrawls.get(crawlId) || null;
  }
  
  /**
   * Generate a sitemap from the crawl results
   */
  generateSitemap(crawlId: string): string {
    const crawl = this.activeCrawls.get(crawlId);
    if (!crawl) return '';
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    crawl.pages.forEach((pageData, url) => {
      const lastmod = new Date().toISOString();
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    
    // Update the crawl result with the sitemap
    crawl.sitemap = sitemap;
    this.activeCrawls.set(crawlId, crawl);
    
    return sitemap;
  }
  
  /**
   * Download the sitemap as an XML file
   */
  downloadSitemap(crawlId: string): void {
    const crawl = this.activeCrawls.get(crawlId);
    if (!crawl) return;
    
    // Generate the sitemap if it hasn't been already
    if (!crawl.sitemap) {
      this.generateSitemap(crawlId);
    }
    
    const blob = new Blob([crawl.sitemap], { type: 'application/xml' });
    saveAs(blob, `sitemap-${crawl.domain}.xml`);
  }
  
  /**
   * Export the crawl results as a JSON file
   */
  exportCrawlData(crawlId: string): void {
    const crawl = this.activeCrawls.get(crawlId);
    if (!crawl) return;
    
    // Convert Map to a regular object for JSON serialization
    const pagesObject: Record<string, PageData> = {};
    crawl.pages.forEach((value, key) => {
      pagesObject[key] = value;
    });
    
    const exportData = {
      ...crawl,
      pages: pagesObject
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    saveAs(blob, `crawl-data-${crawl.domain}.json`);
  }
  
  /**
   * Process the crawl queue
   */
  private async processCrawlQueue(crawlId: string, options: CrawlOptions): Promise<void> {
    const queue = this.pageQueue.get(crawlId) || [];
    const visited = this.visitedUrls.get(crawlId) || new Set();
    const crawl = this.activeCrawls.get(crawlId);
    
    if (!crawl || queue.length === 0 || crawl.pageCount >= options.maxDepth) {
      // Crawl is complete
      if (crawl) {
        crawl.endTime = new Date();
        this.activeCrawls.set(crawlId, crawl);
        
        // Generate the sitemap
        this.generateSitemap(crawlId);
        
        // Calculate the overall score
        this.calculateScore(crawlId);
      }
      return;
    }
    
    // Get the next URL from the queue
    const url = queue.shift()!;
    this.pageQueue.set(crawlId, queue);
    
    // Skip if already visited
    if (visited.has(url)) {
      setImmediate(() => this.processCrawlQueue(crawlId, options));
      return;
    }
    
    // Mark as visited
    visited.add(url);
    this.visitedUrls.set(crawlId, visited);
    
    try {
      // Crawl the page
      const pageData = await this.crawlPage(url, options);
      
      // Add the page data to the crawl result
      crawl.pages.set(url, pageData);
      crawl.pageCount++;
      
      // Update issues count
      crawl.issues.critical += pageData.issues.critical.length;
      crawl.issues.important += pageData.issues.important.length;
      crawl.issues.opportunities += pageData.issues.opportunities.length;
      
      // Add internal links to the queue
      if (pageData.links.internal.length > 0) {
        const newQueue = [...queue];
        
        for (const link of pageData.links.internal) {
          if (!visited.has(link) && !newQueue.includes(link)) {
            newQueue.push(link);
          }
        }
        
        this.pageQueue.set(crawlId, newQueue);
      }
      
      this.activeCrawls.set(crawlId, crawl);
    } catch (error) {
      console.error(`Error crawling ${url}:`, error);
    }
    
    // Process the next URL in the queue
    setTimeout(() => this.processCrawlQueue(crawlId, options), 1000);
  }
  
  /**
   * Crawl a single page
   */
  private async crawlPage(url: string, options: CrawlOptions): Promise<PageData> {
    console.log(`Crawling ${url}`);
    
    const start = performance.now();
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': options.userAgent
        },
        timeout: 30000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });
      
      const end = performance.now();
      const loadTime = end - start;
      
      const $ = cheerio.load(response.data);
      
      // Extract links
      const links = this.extractLinks($, url);
      
      // Extract metadata
      const metaTags = this.extractMetaTags($);
      
      // Extract headings
      const headings = this.extractHeadings($);
      
      // Extract images
      const images = this.extractImages($);
      
      // Calculate page size
      const pageSize = response.data.length;
      
      // Check for issues
      const issues = this.identifyIssues({
        $,
        url,
        statusCode: response.status,
        metaTags,
        headings,
        links,
        images,
        pageSize,
        loadTime
      });
      
      return {
        url,
        statusCode: response.status,
        title: $('title').text() || null,
        metaTags,
        headings,
        content: $('body').text(),
        links,
        images,
        performance: {
          size: pageSize,
          loadTime,
          resourceCount: $('script, link, img').length
        },
        issues,
        html: response.data
      };
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      
      return {
        url,
        statusCode: 0,
        title: null,
        metaTags: {
          description: null,
          keywords: null,
          robots: null,
          viewport: null,
          ogTitle: null,
          ogDescription: null,
          ogImage: null
        },
        headings: {
          h1: [],
          h2: [],
          h3: [],
          h4: []
        },
        content: '',
        links: {
          internal: [],
          external: [],
          broken: [url]
        },
        images: {
          total: 0,
          withAlt: 0,
          withoutAlt: 0,
          large: 0
        },
        performance: {
          size: 0,
          loadTime: null,
          resourceCount: 0
        },
        issues: {
          critical: ['Page could not be accessed'],
          important: [],
          opportunities: []
        },
        html: ''
      };
    }
  }
  
  /**
   * Extract links from a page
   */
  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): {
    internal: string[];
    external: string[];
    broken: string[];
  } {
    const domain = this.extractDomain(baseUrl);
    const links = {
      internal: [] as string[],
      external: [] as string[],
      broken: [] as string[]
    };
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      
      if (!href) return;
      
      try {
        const fullUrl = new URL(href, baseUrl).href;
        const linkDomain = this.extractDomain(fullUrl);
        
        if (linkDomain === domain) {
          if (!links.internal.includes(fullUrl)) {
            links.internal.push(fullUrl);
          }
        } else {
          if (!links.external.includes(fullUrl)) {
            links.external.push(fullUrl);
          }
        }
      } catch (error) {
        // Invalid URL
        links.broken.push(href);
      }
    });
    
    return links;
  }
  
  /**
   * Extract meta tags from a page
   */
  private extractMetaTags($: cheerio.CheerioAPI): {
    description: string | null;
    keywords: string | null;
    robots: string | null;
    viewport: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
  } {
    return {
      description: $('meta[name="description"]').attr('content') || null,
      keywords: $('meta[name="keywords"]').attr('content') || null,
      robots: $('meta[name="robots"]').attr('content') || null,
      viewport: $('meta[name="viewport"]').attr('content') || null,
      ogTitle: $('meta[property="og:title"]').attr('content') || null,
      ogDescription: $('meta[property="og:description"]').attr('content') || null,
      ogImage: $('meta[property="og:image"]').attr('content') || null
    };
  }
  
  /**
   * Extract headings from a page
   */
  private extractHeadings($: cheerio.CheerioAPI): {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
  } {
    return {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get()
    };
  }
  
  /**
   * Extract images from a page
   */
  private extractImages($: cheerio.CheerioAPI): {
    total: number;
    withAlt: number;
    withoutAlt: number;
    large: number;
  } {
    let withAlt = 0;
    let withoutAlt = 0;
    let large = 0;
    
    $('img').each((_, element) => {
      const alt = $(element).attr('alt');
      const width = parseInt($(element).attr('width') || '0', 10);
      const height = parseInt($(element).attr('height') || '0', 10);
      
      if (alt) {
        withAlt++;
      } else {
        withoutAlt++;
      }
      
      if (width > 1000 || height > 1000) {
        large++;
      }
    });
    
    return {
      total: withAlt + withoutAlt,
      withAlt,
      withoutAlt,
      large
    };
  }
  
  /**
   * Identify issues on a page
   */
  private identifyIssues(data: {
    $: cheerio.CheerioAPI;
    url: string;
    statusCode: number;
    metaTags: any;
    headings: any;
    links: any;
    images: any;
    pageSize: number;
    loadTime: number;
  }): {
    critical: string[];
    important: string[];
    opportunities: string[];
  } {
    const { $, statusCode, metaTags, headings, images, pageSize, loadTime } = data;
    
    const critical: string[] = [];
    const important: string[] = [];
    const opportunities: string[] = [];
    
    // Check for critical issues
    if (statusCode >= 400) {
      critical.push(`Page returns HTTP status code ${statusCode}`);
    }
    
    if (!$('title').text()) {
      critical.push('Missing page title');
    }
    
    if (!metaTags.description) {
      critical.push('Missing meta description');
    }
    
    if (headings.h1.length === 0) {
      critical.push('Missing H1 heading');
    } else if (headings.h1.length > 1) {
      important.push('Multiple H1 headings detected');
    }
    
    // Check for important issues
    if (!metaTags.viewport) {
      important.push('Missing viewport meta tag');
    }
    
    if (images.withoutAlt > 0) {
      important.push(`${images.withoutAlt} images missing alt text`);
    }
    
    if ($('a').filter('[href="#"]').length > 0) {
      important.push('Page contains links with href="#"');
    }
    
    // Check for opportunities
    if (loadTime > 3000) {
      opportunities.push('Page load time is slow (> 3s)');
    }
    
    if (pageSize > 1000000) { // 1MB
      opportunities.push('Page size is large (> 1MB)');
    }
    
    if (!metaTags.keywords) {
      opportunities.push('Missing keywords meta tag');
    }
    
    return {
      critical,
      important,
      opportunities
    };
  }
  
  /**
   * Calculate the overall score for a crawl
   */
  private calculateScore(crawlId: string): void {
    const crawl = this.activeCrawls.get(crawlId);
    if (!crawl) return;
    
    const totalIssues = crawl.issues.critical + crawl.issues.important + crawl.issues.opportunities;
    const totalPages = crawl.pageCount;
    
    if (totalPages === 0) {
      crawl.score = 0;
      return;
    }
    
    // Base score is 100
    let score = 100;
    
    // Deduct points for issues
    score -= (crawl.issues.critical / totalPages) * 50;
    score -= (crawl.issues.important / totalPages) * 20;
    score -= (crawl.issues.opportunities / totalPages) * 5;
    
    // Ensure score is between 0 and 100
    crawl.score = Math.max(0, Math.min(100, Math.round(score)));
    
    this.activeCrawls.set(crawlId, crawl);
  }
  
  /**
   * Normalize a URL
   */
  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    try {
      const urlObj = new URL(url);
      return urlObj.href;
    } catch (error) {
      return url;
    }
  }
  
  /**
   * Extract the domain from a URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }
}

export const crawlerService = new CrawlerService();
