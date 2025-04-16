
import axios from 'axios';
import { FirecrawlResponse, CrawlOptions, CrawlResult } from '@/types/firecrawl';

// Configuration for the Firecrawl API
const API_BASE_URL = 'https://api.firecrawl.dev/v1';

/**
 * Service for interacting with the Firecrawl API
 */
export class FirecrawlService {
  private apiKey: string;

  /**
   * Creates a new instance of the FirecrawlService
   * @param apiKey - The API key for authentication
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get the headers for the API request
   * @returns The headers object with authorization
   */
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Crawl a website and get the results
   * @param url - The URL to crawl
   * @param options - Options for the crawl
   * @returns A promise with the crawl results
   */
  async crawlWebsite(url: string, options: Partial<CrawlOptions> = {}): Promise<FirecrawlResponse<CrawlResult>> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/crawl`,
        {
          url,
          ...options
        },
        {
          headers: this.getHeaders()
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error crawling website:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: error.response.data.message || 'Failed to crawl website'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check the status of a crawl
   * @param crawlId - The ID of the crawl
   * @returns A promise with the crawl status
   */
  async checkCrawlStatus(crawlId: string): Promise<FirecrawlResponse<any>> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/crawl/${crawlId}`,
        {
          headers: this.getHeaders()
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error checking crawl status:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: error.response.data.message || 'Failed to check crawl status'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Analyze a website for SEO issues
   * @param url - The URL to analyze
   * @returns A promise with the analysis results
   */
  async analyzeSEO(url: string): Promise<FirecrawlResponse<any>> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/analyze/seo`,
        {
          url
        },
        {
          headers: this.getHeaders()
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error analyzing SEO:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          error: error.response.data.message || 'Failed to analyze SEO'
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
