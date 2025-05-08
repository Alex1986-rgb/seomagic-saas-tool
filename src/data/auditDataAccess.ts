
import { auditDataService } from '@/api/services/auditDataService';
import { seoApiService } from '@/api/services/seoApiService';
import { AuditData } from '@/types/audit';

/**
 * Data access layer for audit data
 */
export class AuditDataAccess {
  /**
   * Load complete audit data for a URL
   */
  static async loadAuditData(url: string): Promise<{
    auditData: AuditData | null;
    recommendations: any | null;
    historyData: any | null;
    error: string | null;
  }> {
    try {
      // Load audit data in parallel
      const [auditDataResponse, recommendationsResponse, historyResponse] = await Promise.all([
        auditDataService.fetchAuditData(url),
        auditDataService.fetchRecommendations(url),
        auditDataService.fetchAuditHistory(url)
      ]);
      
      return {
        auditData: auditDataResponse,
        recommendations: recommendationsResponse, 
        historyData: historyResponse,
        error: null
      };
    } catch (error) {
      console.error('Error loading audit data:', error);
      return {
        auditData: null,
        recommendations: null,
        historyData: null,
        error: error instanceof Error ? error.message : 'Unknown error loading audit data'
      };
    }
  }

  /**
   * Load scan results for a task
   */
  static async loadScanResults(taskId: string): Promise<{
    pageStats: any;
    sitemap: any;
    error: string | null;
  }> {
    try {
      // In a real implementation, this would call an API to get scan results
      const scanStatus = await seoApiService.getStatus(taskId);
      
      return {
        pageStats: {
          total: scanStatus.pages_scanned || 0,
          html: Math.floor((scanStatus.pages_scanned || 0) * 0.85),
          images: Math.floor((scanStatus.pages_scanned || 0) * 0.12),
          other: Math.floor((scanStatus.pages_scanned || 0) * 0.03)
        },
        sitemap: scanStatus.status === 'completed' ? 'available' : null,
        error: null
      };
    } catch (error) {
      console.error('Error loading scan results:', error);
      return {
        pageStats: null,
        sitemap: null,
        error: error instanceof Error ? error.message : 'Unknown error loading scan results'
      };
    }
  }

  /**
   * Save audit data to local storage for caching
   */
  static saveAuditDataToCache(url: string, data: {
    auditData: AuditData | null;
    recommendations: any | null;
    historyData: any | null;
  }): void {
    try {
      localStorage.setItem(`auditData_${url}`, JSON.stringify({
        timestamp: new Date().toISOString(),
        data
      }));
    } catch (error) {
      console.warn('Failed to cache audit data:', error);
    }
  }

  /**
   * Get cached audit data if available and not expired
   */
  static getCachedAuditData(url: string, maxAgeMinutes = 30): {
    auditData: AuditData | null;
    recommendations: any | null;
    historyData: any | null;
  } | null {
    try {
      const cachedDataStr = localStorage.getItem(`auditData_${url}`);
      if (!cachedDataStr) return null;
      
      const cached = JSON.parse(cachedDataStr);
      const timestamp = new Date(cached.timestamp);
      const now = new Date();
      
      // Check if cache is expired
      const diffMs = now.getTime() - timestamp.getTime();
      const diffMinutes = diffMs / (1000 * 60);
      
      if (diffMinutes > maxAgeMinutes) {
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.warn('Error reading cached audit data:', error);
      return null;
    }
  }
}
