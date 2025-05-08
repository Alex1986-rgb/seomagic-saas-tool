
import { AuditData } from '@/types/audit';
import { apiClient } from '../client/apiClient';
import { formatApiError } from '../client/errorHandler';

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
      
      return new Blob([response], { type: 'application/pdf' });
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
}

export const auditDataService = new AuditDataService();
