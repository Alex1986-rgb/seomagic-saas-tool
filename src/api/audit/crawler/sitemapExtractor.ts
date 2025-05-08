
/**
 * Utility class for extracting URLs from sitemap files
 */
export class SitemapExtractor {
  /**
   * Extract URLs from a sitemap XML string
   */
  async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    try {
      // Simple regex-based extraction for basic sitemaps
      const urlRegex = /<loc>(.*?)<\/loc>/g;
      const urls: string[] = [];
      let match;
      
      while ((match = urlRegex.exec(sitemapXml)) !== null) {
        if (match[1]) {
          urls.push(match[1]);
        }
      }
      
      return urls;
    } catch (error) {
      console.error('Error extracting URLs from sitemap:', error);
      return [];
    }
  }
}
