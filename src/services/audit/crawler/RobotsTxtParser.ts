
/**
 * Parser for robots.txt files
 */

export class RobotsTxtParser {
  private userAgent: string = '*';
  private disallowedPaths: string[] = [];
  private allowedPaths: string[] = [];
  private sitemapUrls: string[] = [];

  /**
   * Parse a robots.txt file from a given URL
   */
  async parse(baseUrl: string): Promise<string[]> {
    try {
      // Normalize the URL to ensure it ends with a trailing slash
      const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const robotsUrl = `${normalizedBaseUrl}robots.txt`;
      
      const response = await fetch(robotsUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch robots.txt: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const content = await response.text();
      return this.parseContent(content);
    } catch (error) {
      console.error('Error fetching robots.txt:', error);
      return [];
    }
  }

  /**
   * Parse robots.txt content
   */
  private parseContent(content: string): string[] {
    this.disallowedPaths = [];
    this.allowedPaths = [];
    this.sitemapUrls = [];
    
    let currentUserAgent = '';
    
    // Split the content into lines and process each line
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      // Try to extract directive and value
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) continue;
      
      const directive = trimmedLine.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      
      if (directive === 'user-agent') {
        currentUserAgent = value.toLowerCase();
      } else if (currentUserAgent === this.userAgent.toLowerCase() || currentUserAgent === '*') {
        if (directive === 'disallow' && value) {
          this.disallowedPaths.push(value);
        } else if (directive === 'allow' && value) {
          this.allowedPaths.push(value);
        }
      }
      
      // Sitemap can appear anywhere in the file
      if (directive === 'sitemap' && value) {
        this.sitemapUrls.push(value);
      }
    }
    
    return this.sitemapUrls;
  }

  /**
   * Check if a URL is allowed by robots.txt rules
   */
  isUrlAllowed(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search;
      
      // Check disallow rules
      for (const disallowedPath of this.disallowedPaths) {
        if (path.startsWith(disallowedPath)) {
          // Check if there's a more specific allow rule
          for (const allowedPath of this.allowedPaths) {
            if (path.startsWith(allowedPath) && allowedPath.length > disallowedPath.length) {
              return true;
            }
          }
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all sitemap URLs found in robots.txt
   */
  getSitemapUrls(): string[] {
    return [...this.sitemapUrls];
  }
}
