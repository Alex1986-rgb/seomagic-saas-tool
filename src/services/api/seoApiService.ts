
import axios from 'axios';
import { ScanStatusResponse, AuditInfo, OptimizationResult, CrawlOptions } from '@/types/api';

/**
 * Service for SEO API operations
 */
class SeoApiService {
  private baseUrl: string = 'https://api.seo.example.com';
  
  /**
   * Get stored task ID for a URL
   */
  getTaskIdForUrl(url: string): string | null {
    return localStorage.getItem(`task_id_${url}`);
  }
  
  /**
   * Store task ID for a URL
   */
  storeTaskIdForUrl(url: string, taskId: string): void {
    localStorage.setItem(`task_id_${url}`, taskId);
  }
  
  /**
   * Start crawl process
   */
  async startCrawl(url: string, maxPages: number = 10000): Promise<{ task_id: string }> {
    try {
      // Mock API call
      console.log(`Starting crawl for ${url} with max pages: ${maxPages}`);
      
      // Generate a mock task ID
      const taskId = `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Store it in localStorage
      this.storeTaskIdForUrl(url, taskId);
      
      // Return mock response
      return {
        task_id: taskId
      };
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw new Error('Failed to start crawl');
    }
  }
  
  /**
   * Get status of a crawl task
   */
  async getStatus(taskId: string): Promise<ScanStatusResponse> {
    try {
      // Mock API call
      console.log(`Getting status for task ${taskId}`);
      
      // Generate random progress between 0 and 100
      const progress = Math.min(Math.floor(Math.random() * 101), 100);
      const pagesScanned = Math.floor((progress / 100) * 500);
      
      // Return mock response based on progress
      return {
        task_id: taskId,
        url: "https://example.com",
        status: progress < 100 ? 'in_progress' : 'completed',
        pages_scanned: pagesScanned,
        total_pages: 500,
        progress: progress,
        error: "",
        isLargeSite: false
      };
    } catch (error) {
      console.error('Error getting status:', error);
      throw new Error('Failed to get status');
    }
  }
  
  /**
   * Cancel an ongoing crawl
   */
  async cancelScan(taskId: string): Promise<void> {
    try {
      console.log(`Cancelling task ${taskId}`);
      
      // No actual API call needed for now
      return;
    } catch (error) {
      console.error('Error cancelling scan:', error);
      throw new Error('Failed to cancel scan');
    }
  }
  
  /**
   * Get audit information for a task
   */
  async getAuditInfo(taskId: string): Promise<AuditInfo> {
    try {
      console.log(`Getting audit info for task ${taskId}`);
      
      // Mock audit info
      return {
        id: taskId,
        pageCount: Math.floor(Math.random() * 500) + 50,
        score: Math.floor(Math.random() * 30) + 70,
        domain: "example.com",
        scanTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting audit info:', error);
      throw new Error('Failed to get audit info');
    }
  }
  
  /**
   * Download optimized site
   */
  async downloadOptimizedSite(taskId: string): Promise<Blob> {
    try {
      console.log(`Downloading optimized site for task ${taskId}`);
      
      // Mock response with a simple text blob
      const blob = new Blob(['Optimized site content'], { type: 'application/zip' });
      return blob;
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw new Error('Failed to download optimized site');
    }
  }
  
  /**
   * Optimize site content
   */
  async optimizeSiteContent(taskId: string, prompt: string): Promise<OptimizationResult> {
    try {
      console.log(`Optimizing site content for task ${taskId} with prompt: ${prompt}`);
      
      // Mock successful response
      return {
        success: true,
        message: "Контент успешно оптимизирован"
      };
    } catch (error) {
      console.error('Error optimizing site content:', error);
      throw new Error('Failed to optimize site content');
    }
  }
}

export const seoApiService = new SeoApiService();
