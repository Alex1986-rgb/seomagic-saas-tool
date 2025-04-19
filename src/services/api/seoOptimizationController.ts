
import { crawlerService, CrawlOptions, PageData } from './crawlerService';
import { openaiService, OptimizationOptions } from './openaiService';
import { siteGeneratorService } from './siteGeneratorService';
import { hostingService, HostingCredentials } from './hostingService';

export interface OptimizationTask {
  id: string;
  domain: string;
  crawlId: string;
  status: 'pending' | 'crawling' | 'optimizing' | 'generating' | 'deploying' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime: Date | null;
  pagesProcessed: number;
  totalPages: number;
  optimizedPages: Map<string, any>;
  error: string | null;
}

class SEOOptimizationController {
  private activeTasks: Map<string, OptimizationTask> = new Map();
  
  /**
   * Start a new SEO optimization task
   */
  async startOptimization(
    url: string,
    crawlOptions: CrawlOptions,
    optimizationOptions: OptimizationOptions
  ): Promise<string> {
    try {
      // Validate OpenAI API key
      if (!openaiService.getApiKey()) {
        throw new Error('OpenAI API key not set');
      }
      
      // Start the crawl
      const domain = this.extractDomain(url);
      const crawlId = await crawlerService.startCrawl(url, crawlOptions);
      
      // Create a new task
      const taskId = `task_${Date.now()}`;
      const task: OptimizationTask = {
        id: taskId,
        domain,
        crawlId,
        status: 'crawling',
        progress: 0,
        startTime: new Date(),
        endTime: null,
        pagesProcessed: 0,
        totalPages: 0,
        optimizedPages: new Map(),
        error: null
      };
      
      this.activeTasks.set(taskId, task);
      
      // Start the optimization process
      this.processOptimizationTask(taskId, optimizationOptions);
      
      return taskId;
    } catch (error) {
      console.error('Error starting optimization:', error);
      throw error;
    }
  }
  
  /**
   * Get the status of an optimization task
   */
  getTaskStatus(taskId: string): OptimizationTask | null {
    return this.activeTasks.get(taskId) || null;
  }
  
  /**
   * Download the optimized site for a task
   */
  async downloadOptimizedSite(taskId: string): Promise<void> {
    const task = this.activeTasks.get(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    if (task.status !== 'completed') {
      throw new Error('Task not completed yet');
    }
    
    const crawlResult = crawlerService.getCrawlResult(task.crawlId);
    
    if (!crawlResult) {
      throw new Error('Crawl result not found');
    }
    
    await siteGeneratorService.downloadOptimizedSite(
      task.domain,
      crawlResult.pages,
      task.optimizedPages
    );
  }
  
  /**
   * Deploy the optimized site for a task
   */
  async deploySite(taskId: string, credentials: HostingCredentials): Promise<any> {
    const task = this.activeTasks.get(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    if (task.status !== 'completed') {
      throw new Error('Task not completed yet');
    }
    
    const crawlResult = crawlerService.getCrawlResult(task.crawlId);
    
    if (!crawlResult) {
      throw new Error('Crawl result not found');
    }
    
    // Update task status
    task.status = 'deploying';
    this.activeTasks.set(taskId, task);
    
    // Set hosting credentials
    hostingService.setCredentials(credentials);
    
    try {
      // Generate the optimized site
      const siteZip = await siteGeneratorService.generateOptimizedSite(
        task.domain,
        crawlResult.pages,
        task.optimizedPages
      );
      
      // Deploy the site
      const result = await hostingService.deploySite(task.domain, siteZip);
      
      // Update task status
      if (result.success) {
        task.status = 'completed';
      } else {
        task.error = result.error || 'Error deploying site';
        task.status = 'failed';
      }
      
      this.activeTasks.set(taskId, task);
      
      return result;
    } catch (error) {
      // Update task status
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.status = 'failed';
      this.activeTasks.set(taskId, task);
      
      throw error;
    } finally {
      // Clear hosting credentials
      hostingService.clearCredentials();
    }
  }
  
  /**
   * Process an optimization task
   */
  private async processOptimizationTask(
    taskId: string,
    optimizationOptions: OptimizationOptions
  ): Promise<void> {
    const task = this.activeTasks.get(taskId);
    
    if (!task) {
      return;
    }
    
    try {
      // Wait for the crawl to complete
      await this.waitForCrawlCompletion(task.crawlId, (progress) => {
        task.progress = progress * 0.4; // Crawling is 40% of the process
        this.activeTasks.set(taskId, task);
      });
      
      // Get the crawl result
      const crawlResult = crawlerService.getCrawlResult(task.crawlId);
      
      if (!crawlResult) {
        throw new Error('Crawl result not found');
      }
      
      // Update task with total pages
      task.totalPages = crawlResult.pages.size;
      task.status = 'optimizing';
      this.activeTasks.set(taskId, task);
      
      // Optimize each page
      let pagesProcessed = 0;
      
      for (const [url, pageData] of crawlResult.pages.entries()) {
        try {
          // Optimize the page
          const optimizedPage = await openaiService.optimizePage(
            pageData,
            optimizationOptions
          );
          
          // Store the optimized page
          task.optimizedPages.set(url, optimizedPage);
          
          // Update progress
          pagesProcessed++;
          task.pagesProcessed = pagesProcessed;
          task.progress = 40 + (pagesProcessed / task.totalPages) * 50; // Optimizing is 50% of the process
          this.activeTasks.set(taskId, task);
        } catch (error) {
          console.error(`Error optimizing page ${url}:`, error);
        }
      }
      
      // Generate the optimized site
      task.status = 'generating';
      task.progress = 90; // Generating is 10% of the process
      this.activeTasks.set(taskId, task);
      
      // Mark task as completed
      task.status = 'completed';
      task.progress = 100;
      task.endTime = new Date();
      this.activeTasks.set(taskId, task);
    } catch (error) {
      console.error('Error processing optimization task:', error);
      
      // Update task status
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.status = 'failed';
      task.endTime = new Date();
      this.activeTasks.set(taskId, task);
    }
  }
  
  /**
   * Wait for a crawl to complete
   */
  private async waitForCrawlCompletion(
    crawlId: string,
    progressCallback: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const status = crawlerService.getCrawlStatus(crawlId);
        
        if (status.completed) {
          clearInterval(checkInterval);
          resolve();
        } else {
          const progress = status.pageCount / (status.totalPages || 1);
          progressCallback(Math.min(progress, 0.99));
        }
      }, 1000);
    });
  }
  
  /**
   * Extract the domain from a URL
   */
  private extractDomain(url: string): string {
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(normalizedUrl);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  }
}

export const seoOptimizationController = new SEOOptimizationController();
