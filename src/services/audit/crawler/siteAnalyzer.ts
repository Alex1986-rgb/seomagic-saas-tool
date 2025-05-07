
import { PageData } from './types';

/**
 * Analyzes site structure based on crawl results
 */
export class SiteAnalyzer {
  /**
   * Analyze site structure based on crawled pages
   */
  analyzeSiteStructure(pages: PageData[]) {
    const depthMap: Record<string, number> = {};
    const pageTypesMap: Record<string, number> = {};
    let totalInternalLinks = 0;
    let totalExternalLinks = 0;

    // Process each page to gather statistics
    pages.forEach(page => {
      // Calculate page depth
      const depth = this.getPageDepth(page.url);
      const depthKey = `depth_${depth}`;
      depthMap[depthKey] = (depthMap[depthKey] || 0) + 1;

      // Categorize page by type
      const pageType = this.detectPageType(page);
      pageTypesMap[pageType] = (pageTypesMap[pageType] || 0) + 1;

      // Count links
      totalInternalLinks += page.internalLinks?.length || 0;
      totalExternalLinks += page.externalLinks?.length || 0;
    });

    return {
      totalPages: pages.length,
      depth: depthMap,
      pageTypes: pageTypesMap,
      linkDistribution: {
        internal: totalInternalLinks,
        external: totalExternalLinks
      }
    };
  }

  /**
   * Static method for analyzing site structure
   */
  static analyzeSiteStructure(urls: Set<string>, domain: string) {
    const analyzer = new SiteAnalyzer();
    
    // Convert URLs to simple PageData objects
    const pages = Array.from(urls).map(url => ({
      url,
      title: '',
      description: '',
      h1: [],
      links: [],
      internalLinks: [],
      externalLinks: [],
      images: [],
      statusCode: 200,
      contentType: 'text/html',
      loadTime: 0,
      contentLength: 0,
      isIndexable: true,
      issues: []
    }));
    
    return analyzer.analyzeSiteStructure(pages);
  }

  /**
   * Calculate the depth of a page URL
   */
  private getPageDepth(url: string): number {
    try {
      const pathname = new URL(url).pathname;
      // Count segments, filter out empty ones
      const segments = pathname.split('/').filter(Boolean);
      return segments.length;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Detect page type based on URL patterns and content
   */
  private detectPageType(page: PageData): string {
    const url = page.url.toLowerCase();
    let pathSegments: string[] = [];
    
    try {
      pathSegments = new URL(url).pathname.split('/').filter(Boolean);
    } catch (e) {
      return 'other';
    }
    
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Check for common page types by URL patterns
    if (pathSegments.length === 0 || url.endsWith('/')) {
      return 'homepage';
    } else if (url.includes('/blog/') || url.includes('/news/') || url.includes('/article/')) {
      return 'article';
    } else if (url.includes('/product/') || url.includes('/item/')) {
      return 'product';
    } else if (url.includes('/category/') || url.includes('/catalog/')) {
      return 'category';
    } else if (url.includes('/about')) {
      return 'about';
    } else if (url.includes('/contact')) {
      return 'contact';
    } else {
      // Fallback to generic page type
      return 'other';
    }
  }
}

export const siteAnalyzer = new SiteAnalyzer();
