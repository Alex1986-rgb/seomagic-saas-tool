
/**
 * URL processing utility for handling URL normalization and analysis
 */

export class UrlProcessor {
  private url: string;
  private baseUrl: string;
  private domain: string;
  private urlObj: URL;
  private robotsTxtPaths: string[] = [];

  constructor(url: string) {
    // Normalize URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    try {
      this.urlObj = new URL(url);
      this.url = url;
      this.baseUrl = this.urlObj.origin;
      this.domain = this.urlObj.hostname;
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Get the domain for the current URL
   */
  getDomain(): string {
    return this.domain;
  }

  /**
   * Get the base URL (protocol + domain)
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Normalize a URL against the base URL
   */
  normalizeUrl(href: string): string {
    try {
      return new URL(href, this.baseUrl).toString();
    } catch (e) {
      return '';
    }
  }

  /**
   * Check if a URL is internal relative to the base domain
   */
  isInternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === this.domain;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if a URL should be excluded based on common patterns
   */
  shouldExcludeUrl(url: string, patterns: RegExp[]): boolean {
    try {
      for (const pattern of patterns) {
        if (pattern.test(url)) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return true;
    }
  }

  /**
   * Get the path depth of a URL
   */
  getUrlDepth(url: string): number {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      // Count segments, excluding empty ones
      return path.split('/').filter(Boolean).length;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Removes trailing slashes, query parameters, and fragments from URL
   */
  getCanonicalUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query parameters and hash
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch (e) {
      return url;
    }
  }

  /**
   * Sets robot.txt paths for the URL processor
   */
  setRobotsTxtPaths(paths: string[]): void {
    this.robotsTxtPaths = paths;
  }

  /**
   * Checks if a URL is allowed by robots.txt rules
   */
  isAllowedByRobotsTxt(url: string): boolean {
    // Implement robots.txt checking logic
    try {
      const urlPath = new URL(url).pathname;
      
      // Check if URL path starts with any disallowed path
      for (const disallowedPath of this.robotsTxtPaths) {
        if (urlPath.startsWith(disallowedPath)) {
          return false;
        }
      }
      
      return true;
    } catch (e) {
      return true; // If URL can't be parsed, assume it's allowed
    }
  }

  /**
   * Sort URLs by priority for crawling
   */
  sortByPriority(urls: string[]): string[] {
    // Implement URL prioritization logic
    return urls.filter(url => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname === this.domain; // prioritize internal URLs
      } catch (e) {
        return false;
      }
    });
  }

  /**
   * Determine whether a URL should be crawled
   */
  shouldCrawl(url: string): boolean {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      
      // Don't crawl non-HTTP protocols
      if (!urlObj.protocol.startsWith('http')) {
        return false;
      }
      
      // Check if it's an internal URL
      if (urlObj.hostname !== this.domain) {
        return false;
      }
      
      // Exclude common static assets and other file types
      const excludedExtensions = /\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|pdf|zip|doc|docx|xls|xlsx|ppt|pptx|mp3|mp4|avi|mov|wmv)$/i;
      if (excludedExtensions.test(urlObj.pathname)) {
        return false;
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }
}
