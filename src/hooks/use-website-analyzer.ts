
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { useScan } from './use-scan';
import { validationService } from '@/services/validation/validationService';

export interface WebsiteAnalyzerResults {
  totalPages: number;
  brokenLinks: number;
  duplicateContent: number;
  missingMetadata: number;
}

/**
 * Hook for website analyzer functionality
 */
export const useWebsiteAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<WebsiteAnalyzerResults>({
    totalPages: 0,
    brokenLinks: 0,
    duplicateContent: 0,
    missingMetadata: 0
  });
  
  const { toast } = useToast();
  
  // Initialize scan functionality
  const {
    isScanning,
    scanDetails,
    taskId,
    startScan,
    cancelScan
  } = useScan(url, (pagesCount) => {
    // Update results based on scanned pages
    setScanResults(prev => ({
      ...prev,
      totalPages: pagesCount
    }));
  });
  
  // Handle URL change
  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    setIsError(false);
    setErrorMessage('');
    
    // Validate URL
    if (newUrl && !validationService.validateUrl(newUrl)) {
      setIsError(true);
      setErrorMessage('Введен некорректный URL');
    }
  }, []);

  // Start full site scan
  const startFullScan = useCallback(async () => {
    try {
      if (!url || isError) {
        toast({
          title: "Ошибка",
          description: "Введите корректный URL сайта",
          variant: "destructive",
        });
        return;
      }

      // Generate mock URLs for testing
      const mockUrls = Array(10).fill(0).map((_, i) => 
        `${url.startsWith('http') ? url : 'https://' + url}/${i === 0 ? '' : 'page' + i}`
      );
      setScannedUrls(mockUrls);
      
      await startScan();
      
      // Update scan results with mock data
      setScanResults({
        totalPages: mockUrls.length,
        brokenLinks: Math.floor(Math.random() * 5),
        duplicateContent: Math.floor(Math.random() * 3),
        missingMetadata: Math.floor(Math.random() * 8)
      });
    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Ошибка сканирования",
        description: error instanceof Error ? error.message : "Произошла ошибка при сканировании",
        variant: "destructive",
      });
    }
  }, [url, isError, toast, startScan]);
  
  return {
    url,
    isScanning,
    scanProgress: scanDetails.progress || 0,
    scanStage: scanDetails.stage || 'idle',
    isError,
    errorMessage,
    scanResults,
    scannedUrls,
    handleUrlChange,
    startFullScan,
    taskId
  };
};
