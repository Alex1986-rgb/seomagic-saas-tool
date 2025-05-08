import axios from 'axios';
import { ScanStatusResponse, AuditInfo, OptimizationResult, CrawlOptions } from '@/types/api';

/**
 * Service for SEO API operations
 */
export interface OptimizationResult {
  success: boolean;
  message?: string;
  cost?: number;
  items?: any[];
}

export class SeoApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

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
  async getAuditInfo(taskId: string): Promise<AuditInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/scan/${taskId}/info`);
      if (!response.ok) {
        throw new Error('Failed to fetch audit info');
      }
      
      const data = await response.json();
      return {
        id: data.id || taskId,
        pageCount: data.pages_scanned || 0,
        score: data.score || 0,
        domain: data.url?.split('/')[2] || '',
        scanTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching audit info:', error);
      return null;
    }
  }
  
  /**
   * Download optimized site
   */
  async downloadOptimizedSite(taskId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/${taskId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download optimized site');
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw error;
    }
  }
  
  /**
   * Optimize site content
   */
  async optimizeSiteContent(taskId: string, prompt: string): Promise<OptimizationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/${taskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize site content');
      }
      
      const result = await response.json();
      return {
        success: true,
        message: result.message || 'Optimization successful',
        cost: result.cost,
        items: result.items
      };
    } catch (error) {
      console.error('Error optimizing site content:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to optimize site content'
      };
    }
  }
}

// Create a singleton instance
export const seoApiService = new SeoApiService();
