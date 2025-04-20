import { saveAs } from 'file-saver';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlTask, crawlTasks, generateTaskId } from './types';
import { downloadSitemap } from './sitemapUtils';
import { downloadReport } from './reportUtils';

/**
 * Service for working with the website crawling API
 */
export const firecrawlService = {
  /**
   * Start a new website crawl
   */
  startCrawl: async (url: string): Promise<CrawlTask> => {
    try {
      // Normalize URL
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Extract domain
      let domain;
      try {
        domain = new URL(normalizedUrl).hostname;
      } catch (error) {
        domain = url;
      }
      
      // Create new task
      const task: CrawlTask = {
        id: generateTaskId(),
        url: normalizedUrl,
        domain,
        status: 'pending',
        progress: 0,
        pages_scanned: 0,
        estimated_total_pages: 0,
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        urls: []
      };
      
      // Save task
      crawlTasks.push(task);
      localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
      
      // Start crawling process
      setTimeout(async () => {
        try {
          // Update task status
          task.status = 'in_progress';
          task.urls = [];
          task.progress = 0;
          
          // Queue for URLs to scan
          const urlsToScan = [normalizedUrl];
          const scannedUrls = new Set<string>();
          
          while (urlsToScan.length > 0) {
            const currentUrl = urlsToScan.shift();
            if (!currentUrl || scannedUrls.has(currentUrl)) continue;
            
            try {
              // Fetch and parse page
              const response = await axios.get(currentUrl, {
                timeout: 10000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0; +http://example.com/bot)'
                }
              });
              
              const $ = cheerio.load(response.data);
              
              // Extract all links
              $('a').each((_, element) => {
                const href = $(element).attr('href');
                if (!href) return;
                
                try {
                  const absoluteUrl = new URL(href, currentUrl).href;
                  if (absoluteUrl.startsWith(normalizedUrl) && 
                      !scannedUrls.has(absoluteUrl) && 
                      !urlsToScan.includes(absoluteUrl)) {
                    urlsToScan.push(absoluteUrl);
                  }
                } catch (e) {
                  console.warn('Invalid URL:', href);
                }
              });
              
              // Add to scanned URLs
              scannedUrls.add(currentUrl);
              task.urls.push(currentUrl);
              
              // Update progress
              task.pages_scanned = scannedUrls.size;
              task.estimated_total_pages = Math.max(urlsToScan.length + scannedUrls.size, task.estimated_total_pages);
              task.progress = Math.floor((scannedUrls.size / task.estimated_total_pages) * 100);
              task.updated_at = new Date().toISOString();
              
              // Save updated task
              localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
              
              // Small delay to prevent overwhelming the server
              await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
              console.warn('Error scanning URL:', currentUrl, error);
            }
          }
          
          // Complete task
          task.status = 'completed';
          task.progress = 100;
          task.updated_at = new Date().toISOString();
          localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
          
        } catch (error) {
          console.error('Error during crawl:', error);
          task.status = 'failed';
          localStorage.setItem(`crawl_task_${task.id}`, JSON.stringify(task));
        }
      }, 1000);
      
      return task;
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw error;
    }
  },
  
  /**
   * Get crawl task status
   */
  getStatus: async (taskId: string): Promise<CrawlTask> => {
    try {
      // Find task in memory
      const task = crawlTasks.find(t => t.id === taskId);
      
      if (!task) {
        // Try to get from localStorage
        const storedTaskJson = localStorage.getItem(`crawl_task_${taskId}`);
        if (storedTaskJson) {
          return JSON.parse(storedTaskJson);
        }
        throw new Error('Task not found');
      }
      
      return task;
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  },
  
  /**
   * Download sitemap
   */
  downloadSitemap: async (taskId: string): Promise<void> => {
    try {
      // Get task
      const task = await firecrawlService.getStatus(taskId);
      return downloadSitemap(task);
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      throw error;
    }
  },
  
  /**
   * Download PDF report
   */
  downloadReport: async (taskId: string, reportType: 'full' | 'errors' | 'detailed' = 'full'): Promise<void> => {
    try {
      // Get task
      const task = await firecrawlService.getStatus(taskId);
      return downloadReport(task, reportType);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  },
  
  /**
   * Get task ID for URL from local storage
   */
  getTaskIdForUrl: (url: string): string | null => {
    // Get all keys from localStorage
    const keys = Object.keys(localStorage);
    
    // Find keys starting with "crawl_task_"
    const taskKeys = keys.filter(key => key.startsWith('crawl_task_'));
    
    // Check each task
    for (const key of taskKeys) {
      try {
        const taskJson = localStorage.getItem(key);
        if (taskJson) {
          const task = JSON.parse(taskJson);
          if (task.url === url) {
            return task.id;
          }
        }
      } catch (e) {
        console.error('Error parsing task:', e);
      }
    }
    
    return null;
  }
};
