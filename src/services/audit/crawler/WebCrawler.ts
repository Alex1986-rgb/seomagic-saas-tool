
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SitemapExtractor } from './sitemapExtractor';

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  includeAssets?: boolean;
  followExternalLinks?: boolean;
  requestDelay?: number;
}

export interface CrawlProgress {
  pagesScanned: number;
  estimatedTotal: number;
  currentUrl: string;
  stage: 'sitemap' | 'crawling' | 'analyzing';
}

export interface PageContent {
  url: string;
  html: string;
  title: string;
  meta: {
    description: string;
    keywords: string;
    canonical: string;
    robots: string;
    ogTags: Record<string, string>;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  images: {
    src: string;
    alt: string;
  }[];
  links: {
    internal: string[];
    external: string[];
  };
  wordCount: number;
  issues: string[];
}

export class WebCrawler {
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private pages: Map<string, PageContent> = new Map();
  private baseUrl: string = '';
  private domain: string = '';
  private options: CrawlOptions;
  private onProgress: (progress: CrawlProgress) => void;
  private sitemapExtractor: SitemapExtractor;
  
  constructor(options: CrawlOptions = {}, onProgress?: (progress: CrawlProgress) => void) {
    this.options = {
      maxPages: options.maxPages || 1000,
      maxDepth: options.maxDepth || 5,
      includeAssets: options.includeAssets || false,
      followExternalLinks: options.followExternalLinks || false,
      requestDelay: options.requestDelay || 200
    };
    this.onProgress = onProgress || (() => {});
    this.sitemapExtractor = new SitemapExtractor();
  }
  
  async crawlWebsite(startUrl: string): Promise<Map<string, PageContent>> {
    // Reset state
    this.visited.clear();
    this.queue = [];
    this.pages.clear();
    
    try {
      // Format the URL
      this.baseUrl = this.normalizeUrl(startUrl);
      this.domain = new URL(this.baseUrl).hostname;
      
      // First try to extract URLs from sitemap.xml
      this.reportProgress({
        pagesScanned: 0,
        estimatedTotal: 0,
        currentUrl: `${this.baseUrl}/sitemap.xml`,
        stage: 'sitemap'
      });
      
      const sitemapUrls = await this.extractUrlsFromSitemap();
      
      if (sitemapUrls.length > 0) {
        console.log(`Found ${sitemapUrls.length} URLs in sitemap.xml`);
        // Add all sitemap URLs to the queue
        sitemapUrls.forEach(url => {
          this.queue.push({ url, depth: 0 });
        });
      } else {
        // If no sitemap found, start with the base URL
        console.log('No sitemap found, starting from base URL');
        this.queue.push({ url: this.baseUrl, depth: 0 });
      }
      
      // Process the queue
      let estimatedTotal = this.queue.length || 1;
      
      this.reportProgress({
        pagesScanned: 0,
        estimatedTotal,
        currentUrl: this.baseUrl,
        stage: 'crawling'
      });
      
      // Start crawling
      while (this.queue.length > 0 && this.visited.size < this.options.maxPages!) {
        const { url, depth } = this.queue.shift()!;
        
        if (this.visited.has(url) || depth > this.options.maxDepth!) {
          continue;
        }
        
        this.reportProgress({
          pagesScanned: this.visited.size,
          estimatedTotal,
          currentUrl: url,
          stage: 'crawling'
        });
        
        try {
          await this.processUrl(url, depth);
          
          // Update estimated total
          if (this.queue.length > estimatedTotal - this.visited.size) {
            estimatedTotal = this.visited.size + this.queue.length;
          }
          
          // Add a delay between requests to avoid overloading the server
          await new Promise(resolve => setTimeout(resolve, this.options.requestDelay));
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
        }
      }
      
      this.reportProgress({
        pagesScanned: this.visited.size,
        estimatedTotal: this.visited.size,
        currentUrl: '',
        stage: 'analyzing'
      });
      
      console.log(`Crawled ${this.visited.size} pages of ${this.domain}`);
      return this.pages;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }
  
  private async extractUrlsFromSitemap(): Promise<string[]> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      const response = await axios.get(sitemapUrl, { timeout: 10000 });
      return this.sitemapExtractor.extractUrlsFromSitemap(response.data);
    } catch (error) {
      console.log('Error extracting sitemap:', error);
      return [];
    }
  }
  
  private async processUrl(url: string, depth: number): Promise<void> {
    // Skip if already visited
    if (this.visited.has(url)) {
      return;
    }
    
    // Skip if URL is not from the same domain
    if (!this.isSameDomain(url) && !this.options.followExternalLinks) {
      return;
    }
    
    // Add to visited set
    this.visited.add(url);
    
    try {
      // Fetch the page
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SeoAuditBot/1.0; +http://www.example.com/bot)'
        }
      });
      
      // Parse HTML
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract meta information
      const pageContent: PageContent = this.extractPageContent(url, html, $);
      
      // Add to pages map
      this.pages.set(url, pageContent);
      
      // Extract links and add to queue
      if (depth < this.options.maxDepth!) {
        const links = $('a[href]')
          .map((_, el) => $(el).attr('href'))
          .get()
          .map(href => this.resolveUrl(url, href))
          .filter(href => this.isValidUrl(href));
        
        // Add new links to queue
        for (const link of links) {
          if (!this.visited.has(link) && (this.isSameDomain(link) || this.options.followExternalLinks)) {
            this.queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
    }
  }
  
  private extractPageContent(url: string, html: string, $: cheerio.CheerioAPI): PageContent {
    // Extract title
    const title = $('title').text().trim();
    
    // Extract meta tags
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';
    const robots = $('meta[name="robots"]').attr('content') || '';
    
    // Extract Open Graph tags
    const ogTags: Record<string, string> = {};
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property');
      const content = $(el).attr('content');
      if (property && content) {
        ogTags[property] = content;
      }
    });
    
    // Extract headings
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get(),
      h4: $('h4').map((_, el) => $(el).text().trim()).get(),
      h5: $('h5').map((_, el) => $(el).text().trim()).get(),
      h6: $('h6').map((_, el) => $(el).text().trim()).get()
    };
    
    // Extract images
    const images = $('img').map((_, el) => ({
      src: $(el).attr('src') || '',
      alt: $(el).attr('alt') || ''
    })).get();
    
    // Extract links
    const allLinks = $('a[href]').map((_, el) => $(el).attr('href')).get()
      .map(href => this.resolveUrl(url, href))
      .filter(href => this.isValidUrl(href));
    
    const internalLinks = allLinks.filter(link => this.isSameDomain(link));
    const externalLinks = allLinks.filter(link => !this.isSameDomain(link));
    
    // Count words in content
    const text = $('body').text();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    // Identify issues
    const issues: string[] = [];
    
    if (!title) issues.push('Missing title');
    if (!metaDescription) issues.push('Missing meta description');
    if (!metaKeywords) issues.push('Missing meta keywords');
    if (headings.h1.length === 0) issues.push('Missing H1 heading');
    if (headings.h1.length > 1) issues.push('Multiple H1 headings');
    if (images.some(img => !img.alt)) issues.push('Images missing alt text');
    
    return {
      url,
      html,
      title,
      meta: {
        description: metaDescription,
        keywords: metaKeywords,
        canonical,
        robots,
        ogTags
      },
      headings,
      images,
      links: {
        internal: internalLinks,
        external: externalLinks
      },
      wordCount,
      issues
    };
  }
  
  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }
  
  private resolveUrl(base: string, href: string): string {
    try {
      // Handle absolute URLs
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return href;
      }
      
      // Handle protocol-relative URLs
      if (href.startsWith('//')) {
        const baseUrl = new URL(base);
        return `${baseUrl.protocol}${href}`;
      }
      
      // Handle root-relative URLs
      if (href.startsWith('/')) {
        const baseUrl = new URL(base);
        return `${baseUrl.origin}${href}`;
      }
      
      // Handle fragment-only URLs
      if (href.startsWith('#')) {
        return base;
      }
      
      // Handle relative URLs
      const baseUrl = new URL(base);
      return new URL(href, baseUrl.href).href;
    } catch (error) {
      return '';
    }
  }
  
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (error) {
      return false;
    }
  }
  
  private isSameDomain(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === this.domain;
    } catch (error) {
      return false;
    }
  }
  
  private reportProgress(progress: CrawlProgress): void {
    if (this.onProgress) {
      this.onProgress(progress);
    }
  }
}
