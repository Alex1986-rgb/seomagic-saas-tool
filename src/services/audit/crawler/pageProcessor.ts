
/**
 * Page processor for handling HTML content extraction and analysis
 */

import * as cheerio from 'cheerio';
import { PageData } from './types';

export class PageProcessor {
  /**
   * Processes HTML content to extract structured data
   */
  static async processPage(url: string, html: string, statusCode: number): Promise<PageData> {
    const $ = cheerio.load(html);
    
    // Extract page title
    const title = $('title').text().trim();
    
    // Extract meta description
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Extract all h1 tags
    const h1: string[] = [];
    $('h1').each((_, element) => {
      h1.push($(element).text().trim());
    });
    
    // Extract all links
    const links: string[] = [];
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    
    try {
      const baseUrl = new URL(url);
      
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (!href) return;
        
        try {
          // Resolve relative URLs
          const absoluteUrl = new URL(href, url).toString();
          links.push(absoluteUrl);
          
          // Categorize as internal or external
          const linkUrl = new URL(absoluteUrl);
          if (linkUrl.hostname === baseUrl.hostname) {
            internalLinks.push(absoluteUrl);
          } else {
            externalLinks.push(absoluteUrl);
          }
        } catch (e) {
          // Skip invalid URLs
        }
      });
    } catch (e) {
      // Handle invalid base URL
    }
    
    // Extract all images
    const images: { src: string; alt: string }[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src') || '';
      const alt = $(element).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
      }
    });
    
    // Check if the page is indexable
    const isNoindex = $('meta[name="robots"]').attr('content')?.includes('noindex') || 
                      $('meta[name="googlebot"]').attr('content')?.includes('noindex') ||
                      false;
    
    // Calculate content length
    const contentLength = html.length;
    
    // Detect potential issues
    const issues = [];
    
    if (!title) {
      issues.push({
        type: 'missing_title',
        description: 'The page is missing a title tag',
        severity: 'critical' as const
      });
    }
    
    if (!description) {
      issues.push({
        type: 'missing_description',
        description: 'The page is missing a meta description',
        severity: 'important' as const
      });
    }
    
    if (h1.length === 0) {
      issues.push({
        type: 'missing_h1',
        description: 'The page is missing an H1 heading',
        severity: 'important' as const
      });
    }
    
    return {
      url,
      title,
      description,
      h1,
      links,
      internalLinks,
      externalLinks,
      images,
      statusCode,
      contentType: 'text/html',
      loadTime: 0,
      contentLength,
      isIndexable: !isNoindex,
      issues
    };
  }
}
