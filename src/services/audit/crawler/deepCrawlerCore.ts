
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlResult, DeepCrawlerOptions } from '../../api/firecrawl/types';
import { UrlProcessor } from './urlProcessor';
import { QueueManager } from './queueManager';

export class DeepCrawlerCore {
  protected visited = new Set<string>();
  protected queue: { url: string; depth: number }[] = [];
  protected domain: string;
  protected baseUrl: string;
  protected options: DeepCrawlerOptions;
  protected userAgent = 'Mozilla/5.0 (compatible; SEOAuditBot/1.0)';

  constructor(url: string, options: DeepCrawlerOptions) {
    this.options = options;
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    this.domain = new URL(this.baseUrl).hostname;
  }

  async startCrawling(): Promise<CrawlResult> {
    this.queue = [{ url: this.baseUrl, depth: 0 }];
    this.visited.clear();
    
    const result: CrawlResult = {
      urls: [],
      metadata: {
        keywords: [],
        links: { internal: 0, external: 0, broken: 0 }
      },
      brokenLinks: []
    };

    while (this.queue.length > 0) {
      const { url, depth } = this.queue.shift()!;
      
      if (this.visited.has(url) || depth > this.options.maxDepth) {
        continue;
      }

      try {
        const response = await axios.get(url, {
          headers: { 'User-Agent': this.userAgent },
          timeout: 10000
        });

        const $ = cheerio.load(response.data);
        this.visited.add(url);
        result.urls.push(url);

        // Extract metadata
        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content');
        const keywords = $('meta[name="keywords"]').attr('content')?.split(',') || [];
        
        // Update keywords in result
        result.metadata!.keywords = [...new Set([...result.metadata!.keywords || [], ...keywords])];

        // Process links
        const links = await this.processLinks($, url);
        result.metadata!.links!.internal += links.internal.length;
        result.metadata!.links!.external += links.external.length;
        
        // Добавляем в brokenLinks объекты с url и statusCode
        if (links.broken.length > 0) {
          if (!result.brokenLinks) {
            result.brokenLinks = [];
          }
          
          // Преобразуем строки в объекты { url, statusCode }
          for (const brokenUrl of links.broken) {
            (result.brokenLinks as { url: string; statusCode: number }[]).push({ 
              url: brokenUrl, 
              statusCode: 404 
            });
          }
        }

        // Add internal links to queue
        for (const link of links.internal) {
          if (!this.visited.has(link)) {
            this.queue.push({ url: link, depth: depth + 1 });
          }
        }

        // Progress callback
        if (this.options.onProgress) {
          this.options.onProgress({
            pagesScanned: this.visited.size,
            currentUrl: url,
            totalUrls: this.queue.length + this.visited.size
          });
        }

      } catch (error) {
        console.error(`Error crawling ${url}:`, error);
        if (!result.brokenLinks) {
          result.brokenLinks = [];
        }
        
        // Добавляем в brokenLinks объект с url и statusCode
        (result.brokenLinks as { url: string; statusCode: number }[]).push({ 
          url, 
          statusCode: error instanceof axios.AxiosError && error.response ? error.response.status : 0 
        });
        
        result.metadata!.links!.broken++;
      }

      // Check limits
      if (this.visited.size >= this.options.maxPages) {
        break;
      }
    }

    return result;
  }

  private async processLinks($: cheerio.CheerioAPI, currentUrl: string) {
    const links = {
      internal: [] as string[],
      external: [] as string[],
      broken: [] as string[]
    };

    const currentUrlObj = new URL(currentUrl);

    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        const absoluteUrl = new URL(href, currentUrl);
        const isSameDomain = absoluteUrl.hostname === this.domain;

        if (isSameDomain) {
          links.internal.push(absoluteUrl.href);
        } else {
          links.external.push(absoluteUrl.href);
        }
      } catch (error) {
        console.warn(`Invalid URL ${href} on page ${currentUrl}`);
      }
    });

    return links;
  }
}
