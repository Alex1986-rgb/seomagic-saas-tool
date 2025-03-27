
/**
 * URL processing functionality for the crawler
 */

export class UrlProcessor {
  private specialPatterns: Record<string, RegExp[]> = {
    'myarredo.ru': [
      /\/catalog\//, /\/factory\//, /\/product\//, /\/collection\//,
      /\/interior\//, /\/sale\//, /\/brands\//
    ],
    'arredo': [
      /\/catalog\//, /\/factory\//, /\/product\//, /\/collection\//,
      /\/interior\//, /\/sale\//, /\/brands\//
    ]
  };

  constructor(
    private domain: string,
    private baseUrl: string
  ) {}

  getDefaultProductPatterns(): RegExp[] {
    return [
      /\/product\//i, /\/products\//i, /\/item\//i, /\/items\//i,
      /\/catalog\//i, /\/collection\//i, /\/goods\//i,
      /\/tovary?\//i, /\/mebel\//i, /\/furniture\//i
    ];
  }

  getDomainSpecificPatterns(domain: string): RegExp[] {
    for (const key in this.specialPatterns) {
      if (domain.includes(key)) {
        console.log(`Using specialized patterns for ${key}`);
        return this.specialPatterns[key];
      }
    }
    return [];
  }

  normalizeUrl(href: string, currentUrl: string, baseUrl: string): string | null {
    try {
      // Normalize URL
      let fullUrl = href;
      if (href.startsWith('/')) {
        fullUrl = baseUrl + href;
      } else if (!href.startsWith('http')) {
        fullUrl = `${baseUrl}/${href}`;
      }
      
      const urlObj = new URL(fullUrl);
      const isExternalLink = urlObj.hostname !== this.domain;
      
      return fullUrl;
    } catch (e) {
      // Skip invalid URLs
      return null;
    }
  }

  isInternalLink(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === this.domain;
    } catch (e) {
      return false;
    }
  }
}
