
/**
 * Page processing utilities for the crawler
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { PageData } from './types';

export class PageProcessor {
  constructor(
    private domain: string,
    private baseUrl: string,
    private userAgent: string
  ) {}
  
  async processPage(url: string): Promise<{ pageData: PageData, links: string[] }> {
    try {
      const response = await axios.get(url, { 
        timeout: 15000,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
        },
        maxRedirects: 5
      });
      
      const $ = cheerio.load(response.data);
      const links: string[] = [];
      
      // Initialize page data
      const pageData: PageData = {
        url,
        title: $('title').text() || '',
        description: $('meta[name="description"]').attr('content') || '',
        headings: {
          h1: $('h1').map((_, el) => $(el).text().trim()).get(),
          h2: $('h2').map((_, el) => $(el).text().trim()).get(),
          h3: $('h3').map((_, el) => $(el).text().trim()).get(),
          h4: $('h4').map((_, el) => $(el).text().trim()).get(),
          h5: $('h5').map((_, el) => $(el).text().trim()).get(),
          h6: $('h6').map((_, el) => $(el).text().trim()).get(),
        },
        statusCode: response.status,
        contentType: response.headers['content-type'] || '',
        contentLength: parseInt(response.headers['content-length'] || '0') || null,
        internalLinks: [],
        externalLinks: [],
        images: [],
        hasCanonical: $('link[rel="canonical"]').length > 0,
        canonicalUrl: $('link[rel="canonical"]').attr('href') || null
      };

      // Extract all links
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              fullUrl = new URL(href, this.baseUrl).toString();
            } else if (!href.startsWith('http')) {
              fullUrl = new URL(href, url).toString();
            } else {
              fullUrl = href;
            }
            
            const urlObj = new URL(fullUrl);
            const isExternalLink = urlObj.hostname !== this.domain;
            
            // Categorize as internal or external
            if (isExternalLink) {
              pageData.externalLinks.push(fullUrl);
            } else {
              // It's an internal link
              pageData.internalLinks.push(fullUrl);
              links.push(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      // Extract image information
      $('img').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          try {
            let fullUrl = src;
            if (src.startsWith('/')) {
              fullUrl = new URL(src, this.baseUrl).toString();
            } else if (!src.startsWith('http')) {
              fullUrl = new URL(src, url).toString();
            }
            
            pageData.images.push({
              src: fullUrl,
              alt: $(element).attr('alt') || ''
            });
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      return { pageData, links };
    } catch (error) {
      console.warn(`Error processing URL ${url}:`, error);
      return { 
        pageData: {
          title: '',
          description: '',
          headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
          statusCode: 0,
          contentType: '',
          images: []
        }, 
        links: [] 
      };
    }
  }
}
