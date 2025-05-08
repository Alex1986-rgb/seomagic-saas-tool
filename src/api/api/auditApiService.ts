
import { apiClient } from '../client/apiClient';
import { formatApiError } from '../client/errorHandler';

/**
 * Service for audit API operations
 */
class AuditApiService {
  /**
   * Get audit data for a URL
   */
  async getAuditData(url: string): Promise<any> {
    try {
      return await apiClient.get(`/api/audit/${encodeURIComponent(url)}`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error getting audit data:', formattedError);
      throw formattedError;
    }
  }

  /**
   * Get audit status
   */
  async getStatus(taskId: string): Promise<any> {
    try {
      return await apiClient.get(`/api/audit/status/${taskId}`);
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error getting status:', formattedError);
      throw formattedError;
    }
  }
  
  /**
   * Start an audit scan
   */
  async startScan(url: string, options: any = {}): Promise<any> {
    try {
      return await apiClient.post('/api/audit/start', { url, ...options });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error starting scan:', formattedError);
      throw formattedError;
    }
  }
  
  /**
   * Cancel an audit scan
   */
  async cancelScan(taskId: string): Promise<any> {
    try {
      return await apiClient.post('/api/audit/cancel', { taskId });
    } catch (error) {
      const formattedError = formatApiError(error);
      console.error('Error cancelling scan:', formattedError);
      throw formattedError;
    }
  }
}

export const auditApiService = new AuditApiService();
