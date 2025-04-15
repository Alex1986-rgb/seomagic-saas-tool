
import axios from 'axios';
import { saveAs } from 'file-saver';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Define response types
export interface TaskResponse {
  task_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  pages_scanned?: number;
  total_pages?: number;
  estimated_completion?: string;
  error?: string;
}

export interface OptimizationItem {
  name: string;
  count: number;
  price: number;
}

export interface OptimizationResponse {
  items: OptimizationItem[];
  discount?: number;
  total: number;
}

export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
}

// API Service
export const seoApiService = {
  // Start crawling a website
  startCrawl: async (siteUrl: string, maxPages: number = 500000): Promise<TaskResponse> => {
    try {
      const response = await apiClient.post('/start-crawl', {
        site_url: siteUrl,
        max_pages: maxPages
      });
      
      // Save task_id to localStorage for persistence
      if (response.data.task_id) {
        localStorage.setItem(`task_id_${siteUrl}`, response.data.task_id);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error starting crawl:', error);
      throw error;
    }
  },
  
  // Get status of a crawling task
  getStatus: async (taskId: string): Promise<TaskResponse> => {
    try {
      const response = await apiClient.get(`/status/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  },
  
  // Download sitemap
  downloadSitemap: async (taskId: string): Promise<void> => {
    try {
      const response = await apiClient.get(`/results/${taskId}/sitemap`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/xml' });
      saveAs(blob, 'sitemap.xml');
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      throw error;
    }
  },
  
  // Download PDF report
  downloadReport: async (taskId: string, reportType: 'full' | 'errors' | 'detailed' = 'full'): Promise<void> => {
    try {
      const endpoint = reportType === 'full' 
        ? `/results/${taskId}/report.pdf`
        : reportType === 'errors'
          ? `/results/${taskId}/errors-report.pdf`
          : `/results/${taskId}/detailed-report.pdf`;
          
      const response = await apiClient.get(endpoint, {
        responseType: 'blob'
      });
      
      const filename = reportType === 'full' 
        ? 'seo-report.pdf'
        : reportType === 'errors'
          ? 'errors-report.pdf'
          : 'detailed-report.pdf';
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error downloading PDF report:', error);
      throw error;
    }
  },
  
  // Download optimized ZIP
  downloadOptimizedSite: async (taskId: string): Promise<void> => {
    try {
      const response = await apiClient.get(`/results/${taskId}/optimized-zip`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/zip' });
      saveAs(blob, 'optimized-site.zip');
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw error;
    }
  },
  
  // Export JSON
  exportJSON: async (taskId: string): Promise<void> => {
    try {
      const response = await apiClient.get(`/results/${taskId}/json`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/json' });
      saveAs(blob, 'seo-data.json');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw error;
    }
  },
  
  // AI optimization request
  optimizeSite: async (taskId: string, prompt?: string): Promise<void> => {
    try {
      const requestBody = prompt ? { prompt } : {};
      await apiClient.post(`/optimize/${taskId}`, requestBody);
    } catch (error) {
      console.error('Error optimizing site:', error);
      throw error;
    }
  },
  
  // Get optimization cost breakdown
  getOptimizationCost: async (taskId: string): Promise<OptimizationResponse> => {
    try {
      const response = await apiClient.get(`/optimization-cost/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting optimization cost:', error);
      throw error;
    }
  },
  
  // Generate public share link
  generateShareLink: async (taskId: string): Promise<string> => {
    try {
      const response = await apiClient.post(`/share/${taskId}`);
      return response.data.share_url;
    } catch (error) {
      console.error('Error generating share link:', error);
      throw error;
    }
  },
  
  // Send report via email
  sendEmailReport: async (taskId: string, email: string): Promise<void> => {
    try {
      await apiClient.post(`/send-report/${taskId}`, { email });
    } catch (error) {
      console.error('Error sending email report:', error);
      throw error;
    }
  },
  
  // Get task ID from localStorage
  getTaskIdForUrl: (url: string): string | null => {
    return localStorage.getItem(`task_id_${url}`);
  }
};
