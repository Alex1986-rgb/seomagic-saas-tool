
import { useState, useEffect } from 'react';
import { FirecrawlService } from '@/services/api/firecrawlService';
import { CrawlResult } from '@/types/firecrawl';

interface UseCrawlStatusProps {
  crawlId: string | null;
  apiKey: string;
  pollingInterval?: number;
}

interface UseCrawlStatusResult {
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'idle';
  data: CrawlResult | null;
  error: string | null;
  isLoading: boolean;
  progress: number;
}

/**
 * Hook to check the status of a crawl operation
 */
export const useCrawlStatus = ({ 
  crawlId, 
  apiKey, 
  pollingInterval = 5000 
}: UseCrawlStatusProps): UseCrawlStatusResult => {
  const [status, setStatus] = useState<UseCrawlStatusResult['status']>(crawlId ? 'pending' : 'idle');
  const [data, setData] = useState<CrawlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!crawlId || !apiKey) return;

    const firecrawlService = new FirecrawlService(apiKey);
    let intervalId: number;

    const checkStatus = async () => {
      setIsLoading(true);
      try {
        const response = await firecrawlService.checkCrawlStatus(crawlId);
        
        if (response.success && response.data) {
          const crawlData = response.data as CrawlResult;
          setData(crawlData);
          setStatus(crawlData.status);
          
          if (crawlData.progress) {
            setProgress(crawlData.progress.percentage);
          }
          
          // Stop polling if the crawl is completed or failed
          if (crawlData.status === 'completed' || crawlData.status === 'failed') {
            clearInterval(intervalId);
          }
        } else {
          setError(response.error || 'Failed to fetch crawl status');
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        clearInterval(intervalId);
      } finally {
        setIsLoading(false);
      }
    };

    // Check immediately
    checkStatus();
    
    // Then poll at regular intervals
    intervalId = window.setInterval(checkStatus, pollingInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [crawlId, apiKey, pollingInterval]);

  return { status, data, error, isLoading, progress };
};
