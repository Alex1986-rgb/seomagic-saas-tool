
import axios from 'axios';
import { saveAs } from 'file-saver';
import { FormData } from '@/components/position-tracker/form/schema';

// Define response types for the API
export interface PositionResult {
  keyword: string;
  position: number;
  previousPosition?: number;
  url: string;
  date: string;
}

export interface PositionResponse {
  domain: string;
  keywords: string[];
  searchEngine: string;
  region?: string;
  positions: PositionResult[];
  scanDate: string;
}

const API_ENDPOINT = '/api/position-tracker';

export const positionTrackingService = {
  /**
   * Track positions for keywords on a specific domain
   */
  trackPositions: async (data: FormData & { keywords: string[] }): Promise<PositionResponse> => {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        domain: data.domain,
        keywords: data.keywords,
        searchEngine: data.searchEngine,
        region: data.region,
        scanDate: new Date().toISOString(),
        positions: data.keywords.map(keyword => ({
          keyword,
          position: Math.floor(Math.random() * 100) + 1,
          previousPosition: Math.floor(Math.random() * 100) + 1,
          url: `https://${data.domain}/page-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          date: new Date().toISOString()
        }))
      };
    } catch (error) {
      console.error('Error tracking positions:', error);
      throw error;
    }
  },
  
  /**
   * Export position tracking results as CSV
   */
  exportResultsAsCsv: (data: PositionResponse): void => {
    let csv = 'Keyword,Position,Previous Position,URL,Change\n';
    
    data.positions.forEach(item => {
      const change = item.previousPosition ? item.previousPosition - item.position : 0;
      const changeStr = change > 0 ? `+${change}` : change.toString();
      csv += `"${item.keyword}",${item.position},${item.previousPosition || 'N/A'},"${item.url}",${changeStr}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `positions_${data.domain}_${new Date().toISOString().split('T')[0]}.csv`);
  },
  
  /**
   * Get historical position data for a domain
   */
  getPositionHistory: async (domain: string, keyword: string): Promise<PositionResult[]> => {
    try {
      // This would typically be an API call to get historical data
      // For now, we'll generate some sample data
      const today = new Date();
      const history: PositionResult[] = [];
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        history.push({
          keyword,
          position: Math.floor(Math.random() * 100) + 1,
          url: `https://${domain}/page-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          date: date.toISOString()
        });
      }
      
      return history;
    } catch (error) {
      console.error('Error getting position history:', error);
      throw error;
    }
  }
};
