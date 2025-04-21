
export interface SimpleSitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number; // Added timeout option
}

export class SimpleSitemapCreator {
  options: SimpleSitemapCreatorOptions;
  private baseUrl: string = '';
  private domain: string = '';
  private debugMode: boolean = false;
  private isCancelled: boolean = false;

  constructor(options: SimpleSitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      requestDelay: options.requestDelay || 200,
      concurrentRequests: options.concurrentRequests || 5,
      retryCount: options.retryCount || 3,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 30000 // Default 30 seconds timeout
    };
  }

  // Method to set the base URL
  setBaseUrl(url: string): void {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      this.baseUrl = urlObj.origin;
      this.domain = urlObj.hostname;
    } catch (error) {
      console.error("Invalid URL format:", error);
      this.baseUrl = url;
      this.domain = url;
    }
  }

  // Method to get the domain
  getDomain(): string {
    return this.domain;
  }

  // Method to get the base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Method to enable debug mode
  enableDebugMode(enable: boolean): void {
    this.debugMode = enable;
  }

  // Method to log crawl settings
  logCrawlSettings(): void {
    if (!this.debugMode) return;
    
    console.log('Crawler Settings:');
    console.log(`- Max Pages: ${this.options.maxPages}`);
    console.log(`- Max Depth: ${this.options.maxDepth}`);
    console.log(`- Request Delay: ${this.options.requestDelay}ms`);
    console.log(`- Concurrent Requests: ${this.options.concurrentRequests}`);
    console.log(`- Domain: ${this.domain}`);
    console.log(`- Base URL: ${this.baseUrl}`);
  }

  // Method to cancel crawling
  cancel(): void {
    this.isCancelled = true;
    console.log('Crawling cancelled by user');
  }

  // Method to crawl a website and return URLs
  async crawl(
    startUrl: string, 
    progressCallback?: (scanned: number, total: number, url: string) => void
  ): Promise<string[]> {
    // Reset cancelled flag
    this.isCancelled = false;
    
    // Set base URL if not already set
    if (!this.baseUrl) {
      this.setBaseUrl(startUrl);
    }
    
    // Simple implementation for the demo
    // In a real implementation, this would do actual crawling
    const mockUrls = this.generateMockUrls(startUrl, 50);
    
    // Simulate crawling with progress updates
    for (let i = 0; i < mockUrls.length; i++) {
      if (this.isCancelled) {
        break;
      }
      
      // Call progress callback if provided
      if (progressCallback) {
        progressCallback(i + 1, mockUrls.length, mockUrls[i]);
      }
      
      // Simulate delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return mockUrls;
  }

  // Helper method to generate mock URLs for demo purposes
  private generateMockUrls(baseUrl: string, count: number): string[] {
    const normalizedUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
    let baseUrlObj: URL;
    
    try {
      baseUrlObj = new URL(normalizedUrl);
    } catch (error) {
      console.error("Invalid URL format:", error);
      return [];
    }
    
    const paths = [
      '/',
      '/about',
      '/contact',
      '/products',
      '/services',
      '/blog',
      '/team',
      '/faq',
      '/pricing',
      '/terms',
      '/privacy',
    ];
    
    const subpaths = [
      'page/1',
      'page/2',
      'details',
      'overview',
      'gallery',
      'info',
    ];
    
    const urls: string[] = [];
    
    // Add base URL
    urls.push(baseUrlObj.origin + '/');
    
    // Add main paths
    for (const path of paths) {
      urls.push(baseUrlObj.origin + path);
      
      // Add some subpaths
      for (const subpath of subpaths) {
        if (urls.length < count) {
          urls.push(baseUrlObj.origin + path + '/' + subpath);
        }
      }
      
      // Add numbered pages for some paths
      if (['blog', 'products', 'services'].includes(path.replace('/', ''))) {
        for (let i = 1; i <= 5; i++) {
          if (urls.length < count) {
            urls.push(baseUrlObj.origin + path + '/category-' + i);
          }
          
          for (let j = 1; j <= 3; j++) {
            if (urls.length < count) {
              urls.push(baseUrlObj.origin + path + '/category-' + i + '/item-' + j);
            }
          }
        }
      }
    }
    
    // Ensure we return exactly the requested number of URLs
    return urls.slice(0, count);
  }

  // Method to generate sitemap XML
  generateSitemap(urls: string[]): string {
    const date = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    return xml;
  }

  // Helper method to escape XML special characters
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
