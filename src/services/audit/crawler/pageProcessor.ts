
/**
 * Page processor class for extracting data from crawled pages
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { PageData } from './types';

export class PageProcessor {
  private domain: string;
  private baseUrl: string;
  private userAgent: string;

  constructor(domain: string, baseUrl: string, userAgent: string) {
    this.domain = domain;
    this.baseUrl = baseUrl;
    this.userAgent = userAgent;
  }

  async processPage(url: string): Promise<{ pageData: PageData | null; links: string[] }> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const title = $('title').text().trim() || '';
      const description = $('meta[name="description"]').attr('content') || '';
      
      // Extract headings
      const h1s = $('h1').map((_, el) => $(el).text().trim()).get();
      const h2s = $('h2').map((_, el) => $(el).text().trim()).get();
      const h3s = $('h3').map((_, el) => $(el).text().trim()).get();
      const h4s = $('h4').map((_, el) => $(el).text().trim()).get();
      const h5s = $('h5').map((_, el) => $(el).text().trim()).get();
      const h6s = $('h6').map((_, el) => $(el).text().trim()).get();

      // Extract all links
      const links: string[] = [];
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            const resolvedUrl = new URL(href, url).href;
            links.push(resolvedUrl);
          } catch (error) {
            // Skip invalid URLs
          }
        }
      });

      // Separate internal and external links
      const internalLinks: string[] = [];
      const externalLinks: string[] = [];

      for (const link of links) {
        try {
          const linkDomain = new URL(link).hostname;
          if (linkDomain === this.domain) {
            internalLinks.push(link);
          } else {
            externalLinks.push(link);
          }
        } catch (error) {
          // Skip invalid URLs
        }
      }

      // Extract images
      const images = $('img').map((_, el) => {
        const src = $(el).attr('src') || '';
        const alt = $(el).attr('alt') || '';
        const title = $(el).attr('title') || undefined;
        
        try {
          const imageUrl = new URL(src, url).href;
          return {
            src: imageUrl,
            alt,
            title,
            url: imageUrl // Adding url property to match the type
          };
        } catch (error) {
          return null;
        }
      }).get().filter(Boolean);

      const pageData: PageData = {
        url,
        title,
        description,
        h1s,
        headings: { h1: h1s, h2: h2s, h3: h3s, h4: h4s, h5: h5s, h6: h6s },
        wordCount: $('body').text().split(/\s+/).length,
        links: { internal: internalLinks, external: externalLinks },
        internalLinks, // Add these properties to match the expected interface
        externalLinks,
        images,
        statusCode: response.status,
        contentType: response.headers['content-type'] || '',
        loadTime: 0, // This would need to be measured properly
        contentLength: parseInt(response.headers['content-length'] || '0', 10) || null,
        metaDescription: description // For backward compatibility
      };

      return { pageData, links };
    } catch (error) {
      console.error(`Error processing page ${url}:`, error);
      return { pageData: null, links: [] };
    }
  }
}
