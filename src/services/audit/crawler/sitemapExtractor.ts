
import * as cheerio from 'cheerio';

export class SitemapExtractor {
  async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    try {
      const $ = cheerio.load(sitemapXml, { xmlMode: true });
      const urls: string[] = [];
      
      // Process regular sitemap
      $('url > loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url && urls.indexOf(url) === -1) {
          urls.push(url);
        }
      });
      
      // Process sitemap index if present
      $('sitemap > loc').each((_, element) => {
        const sitemapUrl = $(element).text().trim();
        if (sitemapUrl) {
          console.log(`Found sitemap reference: ${sitemapUrl}`);
          // Ideally we would fetch this sitemap and process it recursively,
          // but for simplicity we'll just log it for now
        }
      });
      
      return urls;
    } catch (error) {
      console.error('Error extracting URLs from sitemap:', error);
      return [];
    }
  }
}
