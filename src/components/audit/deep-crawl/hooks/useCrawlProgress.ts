
import { useState } from 'react';
import { useCrawlState } from './useCrawlState';
import { useCrawlExecution } from './useCrawlExecution';
import { useSitemapExport } from '../utils/exportUtils';

export function useCrawlProgress(url: string) {
  const [sitemap, setSitemap] = useState<string | null>(null);
  
  // Use the smaller, focused hooks
  const crawlState = useCrawlState(url);
  const crawlExecution = useCrawlExecution();
  const sitemapExport = useSitemapExport();

  const startCrawling = async () => {
    // Reset state
    crawlState.resetState();
    
    try {
      // Initialize crawler
      const { crawler, domain, maxPages } = crawlExecution.initializeCrawler({
        url,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          crawlState.updateProgress(pagesScanned, totalEstimated, currentUrl, maxPages);
        }
      });
      
      crawlState.setDomain(domain);
      crawlState.setCrawler(crawler);
      
      // Set stage to starting
      crawlState.setCrawlStage('starting');
      
      // Execute crawler
      const result = await crawlExecution.executeCrawler(crawler);
      
      if (result) {
        // Generate sitemap from results
        const generatedSitemap = sitemapExport.generateSitemapFile(domain, result.pageCount);
        setSitemap(generatedSitemap);
        
        // Complete the crawl
        crawlState.completeCrawl(true, result);
        
        return result;
      }
      else {
        crawlState.completeCrawl(false);
        return null;
      }
      
    } catch (error) {
      console.error('Error during deep crawl:', error);
      crawlState.completeCrawl(false);
      return null;
    }
  };

  const downloadSitemap = () => {
    sitemapExport.downloadSitemap(sitemap, crawlState.domain);
  };
  
  const downloadAllData = async () => {
    sitemapExport.downloadAllData(crawlState.scannedUrls, crawlState.domain);
  };
  
  const downloadReport = async () => {
    sitemapExport.downloadReport(crawlState.crawler, crawlState.domain);
  };

  return {
    ...crawlState,
    sitemap,
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport
  };
}
