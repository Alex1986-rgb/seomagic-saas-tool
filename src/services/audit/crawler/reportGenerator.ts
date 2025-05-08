import { CrawlResult, CrawlSummary, PageData } from './types';

/**
 * Generate reports and summaries from crawl data
 */
export class ReportGenerator {
  /**
   * Generate summary of crawl results
   */
  generateCrawlSummary(result: CrawlResult, pages: Map<string, PageData>): CrawlSummary {
    // Calculate key metrics
    let totalLinks = 0;
    let internalLinks = 0;
    let externalLinks = 0;
    let brokenLinks = 0;
    let totalLoadTime = 0;
    let pageCount = 0;

    // Track page types and depths
    const pageTypes: Record<string, number> = {};
    const depthDistribution: Record<number, number> = {};

    // Process each page
    pages.forEach((pageData, url) => {
      // Count pages
      pageCount++;

      // Calculate links
      totalLinks += pageData.links.length;
      if (pageData.internalLinks) internalLinks += pageData.internalLinks.length;
      if (pageData.externalLinks) externalLinks += pageData.externalLinks.length;

      // Track load time
      totalLoadTime += pageData.loadTime;

      // Track content types
      const contentType = pageData.contentType.split(';')[0].trim();
      if (pageTypes[contentType]) {
        pageTypes[contentType]++;
      } else {
        pageTypes[contentType] = 1;
      }

      // Track issues
      if (pageData.statusCode >= 400) {
        brokenLinks++;
      }

      // We would track depth distribution here if depth information was available
      // This is a placeholder
      const estimatedDepth = url.split('/').length - 3;
      if (estimatedDepth >= 0) {
        if (depthDistribution[estimatedDepth]) {
          depthDistribution[estimatedDepth]++;
        } else {
          depthDistribution[estimatedDepth] = 1;
        }
      }
    });

    // Calculate average load time
    const averageLoadTime = pageCount > 0 ? totalLoadTime / pageCount : 0;

    // Return summary
    return {
      totalPages: pageCount,
      internalLinks,
      externalLinks,
      brokenLinks,
      averageLoadTime,
      pageTypes,
      depthDistribution
    };
  }

  /**
   * Generate JSON report
   */
  generateJsonReport(result: CrawlResult, pages: Map<string, PageData>, summary: CrawlSummary): string {
    const report = {
      timestamp: new Date().toISOString(),
      domain: result.metadata.domain || '',
      totalPages: pages.size,
      crawlTime: result.metadata.totalTime,
      summary: {
        internalLinks: summary.internalLinks,
        externalLinks: summary.externalLinks,
        brokenLinks: summary.brokenLinks,
        averageLoadTime: summary.averageLoadTime,
        pageTypes: summary.pageTypes,
        depthDistribution: summary.depthDistribution
      },
      pages: Array.from(pages.values())
    };

    return JSON.stringify(report, null, 2);
  }
}
