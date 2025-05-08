import { AuditData } from '@/types/audit';
import { apiClient } from '../client/apiClient';
import { formatApiError } from '../client/errorHandler';
import type { BrokenLink, Redirect, DuplicatePage, DuplicateMetaTag, SiteStructure, ContentAnalysisResult } from '@/services/audit/siteAnalysis';
import { 
  detectBrokenLinks, 
  detectDuplicates, 
  analyzeSiteStructure, 
  analyzeContentUniqueness 
} from '@/services/audit/siteAnalysis';

/**
 * Audit data service for handling audit-specific operations
 */
class AuditDataService {
  /**
   * Fetch audit data for a URL
   */
  async fetchAuditData(url: string): Promise<AuditData> {
    try {
      return await apiClient.get(`/api/audit/${encodeURIComponent(url)}`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error fetching audit data:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Fetch recommendations for a URL
   */
  async fetchRecommendations(url: string): Promise<any> {
    try {
      return await apiClient.get(`/api/audit/${encodeURIComponent(url)}/recommendations`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error fetching recommendations:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Fetch audit history for a URL
   */
  async fetchAuditHistory(url: string): Promise<any> {
    try {
      return await apiClient.get(`/api/audit/${encodeURIComponent(url)}/history`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error fetching audit history:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Generate PDF report for an audit
   */
  async generatePdfReport(auditData: any): Promise<Blob> {
    try {
      const response = await apiClient.post('/api/reports/generate-pdf', {
        auditData
      }, {
        responseType: 'blob'
      });
      
      // Ensure the response is treated as Blob
      if (!(response instanceof Blob)) {
        return new Blob([JSON.stringify(response)], { type: 'application/json' });
      }
      
      return response;
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error generating PDF report:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Share audit results via email
   */
  async shareAuditResults(email: string, auditData: any): Promise<{success: boolean}> {
    try {
      return await apiClient.post('/api/audit/share', {
        email,
        auditData
      });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error sharing audit results:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Finds broken links on a website
   */
  async findBrokenLinks(
    domain: string,
    urls: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<{ brokenLinks: BrokenLink[]; redirects: Redirect[] }> {
    return await detectBrokenLinks(domain, urls, onProgress);
  }

  /**
   * Finds duplicates on a website
   */
  async findDuplicates(
    urls: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<{ duplicatePages: DuplicatePage[]; duplicateMeta: DuplicateMetaTag[] }> {
    return await detectDuplicates(urls, onProgress);
  }

  /**
   * Analyzes site structure
   */
  async analyzeSiteStructure(
    domain: string,
    urls: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<SiteStructure> {
    return await analyzeSiteStructure(domain, urls, onProgress);
  }

  /**
   * Analyzes content uniqueness
   */
  async analyzeContentUniqueness(
    urls: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<ContentAnalysisResult> {
    return await analyzeContentUniqueness(urls, onProgress);
  }
}

export const auditDataService = new AuditDataService();
