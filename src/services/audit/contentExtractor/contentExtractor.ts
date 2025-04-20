import * as cheerio from 'cheerio';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ExtractionOptions {
  extractText?: boolean;
  extractImages?: boolean;
  extractLinks?: boolean;
  extractMeta?: boolean;
  maxPages?: number;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

export interface ExtractedContent {
  url: string;
  title: string;
  metaTags: {
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
  };
  text: string;
  links: string[];
  images: {
    src: string;
    alt: string;
  }[];
  html: string;
  timestamp: string;
}

export class ContentExtractor {
  private options: ExtractionOptions;
  private extractedContent: Map<string, ExtractedContent> = new Map();
  private failedUrls: string[] = [];
  private processedCount: number = 0;
  private domain: string = '';
  
  constructor(options: ExtractionOptions = {}) {
    this.options = {
      extractText: true,
      extractImages: true,
      extractLinks: true,
      extractMeta: true,
      maxPages: 1000,
      timeout: 15000,
      retryCount: 3,
      retryDelay: 2000,
      ...options
    };
  }
  
  /**
   * Reset the extractor state
   */
  reset(): void {
    this.extractedContent.clear();
    this.failedUrls = [];
    this.processedCount = 0;
  }
  
  /**
   * Extract content from a list of URLs
   */
  async extractFromUrls(
    urls: string[], 
    progressCallback?: (processed: number, total: number, currentUrl: string) => void
  ): Promise<Map<string, ExtractedContent>> {
    this.reset();
    
    // Try to determine domain from the first URL
    if (urls.length > 0) {
      try {
        const urlObj = new URL(urls[0]);
        this.domain = urlObj.hostname;
      } catch (error) {
        console.error("Invalid URL:", urls[0]);
      }
    }
    
    // Limit the number of pages to process
    const urlsToProcess = urls.slice(0, this.options.maxPages);
    const total = urlsToProcess.length;
    
    for (const url of urlsToProcess) {
      if (progressCallback) {
        progressCallback(this.processedCount, total, url);
      }
      
      try {
        const content = await this.extractFromUrl(url);
        if (content) {
          this.extractedContent.set(url, content);
        }
      } catch (error) {
        console.error(`Failed to extract content from ${url}:`, error);
        this.failedUrls.push(url);
      }
      
      this.processedCount++;
    }
    
    return this.extractedContent;
  }
  
  /**
   * Extract content from a single URL with retry logic
   */
  private async extractFromUrl(url: string): Promise<ExtractedContent | null> {
    let retries = 0;
    const maxRetries = this.options.retryCount || 3;
    
    while (retries <= maxRetries) {
      try {
        const response = await axios.get(url, {
          timeout: this.options.timeout,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ContentExtractor/1.0; +https://example.com/bot)',
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
          }
        });
        
        if (response.status === 200 && response.data) {
          return this.parseContent(url, response.data);
        }
        return null;
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
      }
    }
    
    return null;
  }
  
  /**
   * Parse HTML content and extract structured data
   */
  private parseContent(url: string, html: string): ExtractedContent {
    const $ = cheerio.load(html);
    const now = new Date().toISOString();
    
    // Extract title
    const title = $('title').text().trim() || url;
    
    // Extract meta tags
    const metaTags = {
      description: $('meta[name="description"]').attr('content') || undefined,
      keywords: $('meta[name="keywords"]').attr('content') || undefined,
      ogTitle: $('meta[property="og:title"]').attr('content') || undefined,
      ogDescription: $('meta[property="og:description"]').attr('content') || undefined,
      ogImage: $('meta[property="og:image"]').attr('content') || undefined
    };
    
    // Extract headings
    const headings = {
      h1: [] as string[],
      h2: [] as string[],
      h3: [] as string[],
      h4: [] as string[]
    };
    
    $('h1').each((_, el) => {
      headings.h1.push($(el).text().trim());
    });
    
    $('h2').each((_, el) => {
      headings.h2.push($(el).text().trim());
    });
    
    $('h3').each((_, el) => {
      headings.h3.push($(el).text().trim());
    });
    
    $('h4').each((_, el) => {
      headings.h4.push($(el).text().trim());
    });
    
    // Extract main text content
    const mainContent = $('main, article, #content, .content, .main');
    let text = '';
    
    if (mainContent.length > 0) {
      // If we found a main content container, use that
      text = mainContent.text().trim();
    } else {
      // Otherwise try to get text from the body, excluding navigation, footer, etc.
      $('nav, header, footer, script, style, .menu, .navigation, .sidebar, .footer').remove();
      text = $('body').text().trim();
    }
    
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    // Extract links
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        try {
          // Convert relative URLs to absolute
          const absoluteUrl = new URL(href, url).href;
          links.push(absoluteUrl);
        } catch (error) {
          // Skip invalid URLs
        }
      }
    });
    
    // Extract images
    const images: { src: string; alt: string }[] = [];
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      
      if (src) {
        try {
          // Convert relative URLs to absolute
          const absoluteSrc = new URL(src, url).href;
          images.push({ src: absoluteSrc, alt });
        } catch (error) {
          // Skip invalid URLs
        }
      }
    });
    
    return {
      url,
      title,
      metaTags,
      headings,
      text,
      links,
      images,
      html,
      timestamp: now
    };
  }
  
  /**
   * Get statistics about the extraction
   */
  getStats() {
    return {
      totalProcessed: this.processedCount,
      successful: this.extractedContent.size,
      failed: this.failedUrls.length,
      failedUrls: this.failedUrls
    };
  }
  
  /**
   * Export extracted content to HTML files
   */
  exportToHtml(): string {
    let index = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sitemap for ${this.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #2563eb; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .page-list { margin-top: 30px; }
    .page-item { margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sitemap for ${this.domain}</h1>
    <p>Total pages: ${this.extractedContent.size}</p>
    <div class="page-list">`;
    
    // Add links to all pages
    for (const [url, content] of this.extractedContent.entries()) {
      const pageFilename = this.urlToFilename(url, 'html');
      index += `
      <div class="page-item">
        <a href="${pageFilename}">${content.title}</a> - <span class="url">${url}</span>
      </div>`;
    }
    
    index += `
    </div>
  </div>
</body>
</html>`;
    
    return index;
  }
  
  /**
   * Export extracted content to Markdown files
   */
  exportToMarkdown(): string {
    let markdown = `# Sitemap for ${this.domain}\n\n`;
    markdown += `Total pages: ${this.extractedContent.size}\n\n`;
    
    // Add links to all pages
    for (const [url, content] of this.extractedContent.entries()) {
      markdown += `- [${content.title}](${url})\n`;
    }
    
    return markdown;
  }
  
  /**
   * Export all content to a ZIP file
   */
  async exportAll(): Promise<Blob> {
    const zip = new JSZip();
    
    // Add index.html
    const index = this.exportToHtml();
    zip.file("index.html", index);
    
    // Add sitemap.md
    const markdown = this.exportToMarkdown();
    zip.file("sitemap.md", markdown);
    
    // Add sitemap.xml
    const xml = this.generateSitemap();
    zip.file("sitemap.xml", xml);
    
    // Add pages folder
    const pagesFolder = zip.folder("pages");
    
    // Add individual HTML files for each page
    for (const [url, content] of this.extractedContent.entries()) {
      const pageFilename = this.urlToFilename(url, 'html');
      
      const pageHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  ${content.metaTags.description ? `<meta name="description" content="${content.metaTags.description}">` : ''}
  ${content.metaTags.keywords ? `<meta name="keywords" content="${content.metaTags.keywords}">` : ''}
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { color: #2563eb; }
    a { color: #2563eb; }
    .metadata { margin: 20px 0; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px; }
    .metadata h3 { margin-top: 0; }
    .content { margin-top: 30px; }
    .back-link { margin-top: 30px; display: block; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${content.title}</h1>
    <div class="metadata">
      <h3>Page Metadata</h3>
      <p><strong>URL:</strong> ${content.url}</p>
      <p><strong>Title:</strong> ${content.title}</p>
      ${content.metaTags.description ? `<p><strong>Description:</strong> ${content.metaTags.description}</p>` : ''}
      ${content.metaTags.keywords ? `<p><strong>Keywords:</strong> ${content.metaTags.keywords}</p>` : ''}
    </div>
    
    <div class="content">
      ${content.html}
    </div>
    
    <a href="../index.html" class="back-link">Back to Index</a>
  </div>
</body>
</html>`;
      
      pagesFolder?.file(pageFilename, pageHtml);
    }
    
    // Add JSON data of all pages
    const jsonData = JSON.stringify(Array.from(this.extractedContent.entries()), null, 2);
    zip.file("data.json", jsonData);
    
    return await zip.generateAsync({ type: "blob" });
  }
  
  /**
   * Generate a sitemap XML file
   */
  private generateSitemap(): string {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const [url, content] of this.extractedContent.entries()) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }
  
  /**
   * Download the exported content
   */
  async downloadAll(filename: string = 'site-content.zip'): Promise<void> {
    const blob = await this.exportAll();
    saveAs(blob, filename);
  }
  
  // Helper function to convert URL to a valid filename
  private urlToFilename(url: string, extension: string): string {
    try {
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      
      // Handle root path
      if (path === '/') {
        return 'index.' + extension;
      }
      
      // Remove leading slash
      path = path.startsWith('/') ? path.substring(1) : path;
      
      // Replace any remaining slashes with underscores
      path = path.replace(/\//g, '_');
      
      // Remove any file extension if present
      path = path.replace(/\.[^/.]+$/, '');
      
      // Add our desired extension
      path = path + '.' + extension;
      
      // Replace any special characters
      path = path.replace(/[^a-zA-Z0-9_.-]/g, '_');
      
      return path;
    } catch (error) {
      // Fallback for invalid URLs
      return 'page_' + Math.random().toString(36).substring(2, 10) + '.' + extension;
    }
  }
  
  // Helper function to escape XML special characters
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

export const contentExtractorService = new ContentExtractor();
