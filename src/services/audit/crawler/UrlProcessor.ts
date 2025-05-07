
/**
 * URL processing utility for handling URL normalization and analysis
 */

export class UrlProcessor {
  private url: string;
  private baseUrl: string;
  private domain: string;
  private urlObj: URL;

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
}
