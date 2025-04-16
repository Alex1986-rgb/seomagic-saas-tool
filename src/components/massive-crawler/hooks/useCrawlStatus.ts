
import { useState, useEffect } from 'react';
import { firecrawlService, CrawlStatus } from '@/services/api/firecrawlService';

export const useCrawlStatus = (taskId: string) => {
  const [status, setStatus] = useState<CrawlStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const crawlStatus = await firecrawlService.checkCrawlStatus(taskId);
      setStatus(crawlStatus);
      
      if (crawlStatus.status === 'completed' && status?.status !== 'completed') {
        // Only trigger on transition to completed
        return { completed: true, pagesScanned: crawlStatus.pagesScanned };
      }
    } catch (error) {
      console.error('Error fetching crawl status:', error);
      setError('Failed to get status');
    } finally {
      setLoading(false);
    }
    return { completed: false, pagesScanned: 0 };
  };

  useEffect(() => {
    fetchStatus();
    
    // Periodic status updates
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  return { status, loading, error, fetchStatus };
};
