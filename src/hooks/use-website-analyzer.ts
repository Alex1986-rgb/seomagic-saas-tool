
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';
import { validationService } from '@/services/validation/validationService';
import { firecrawlService } from '@/services/api/firecrawl/firecrawlService';

export interface WebsiteAnalyzerState {
  url: string;
  isScanning: boolean;
  scanProgress: number;
  scanStage: string;
  isError: boolean;
  errorMessage: string;
  scanResults: {
    totalPages: number;
    brokenLinks: number;
    duplicateContent: number;
    missingMetadata: number;
  } | null;
}

export const useWebsiteAnalyzer = () => {
  const [state, setState] = useState<WebsiteAnalyzerState>({
    url: '',
    isScanning: false,
    scanProgress: 0,
    scanStage: '',
    isError: false,
    errorMessage: '',
    scanResults: null,
  });

  const [taskId, setTaskId] = useState<string | null>(null);
  const { toast } = useToast();

  // Poll for status updates if a scan is in progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isScanning && taskId) {
      interval = setInterval(async () => {
        try {
          const taskStatus = await firecrawlService.getStatus(taskId);
          setState(prev => ({
            ...prev,
            scanProgress: taskStatus.progress,
            scanStage: taskStatus.status === 'completed' 
              ? 'Scan completed' 
              : `Scanning ${taskStatus.current_url || ''}`,
          }));

          if (taskStatus.status === 'completed') {
            clearInterval(interval!);
            setState(prev => ({
              ...prev,
              isScanning: false,
              scanResults: {
                totalPages: taskStatus.pages_scanned,
                brokenLinks: 0,
                duplicateContent: 0,
                missingMetadata: 0
              }
            }));
            
            toast({
              title: "Scan completed",
              description: `Successfully scanned ${taskStatus.pages_scanned} pages.`,
            });
          } else if (taskStatus.status === 'failed') {
            clearInterval(interval!);
            setState(prev => ({
              ...prev,
              isScanning: false,
              isError: true,
              errorMessage: taskStatus.error || 'Scan failed with unknown error'
            }));
            
            toast({
              title: "Scan failed",
              description: taskStatus.error || "An error occurred during the scan",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error polling scan status:', error);
        }
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isScanning, taskId, toast]);

  const handleUrlChange = useCallback((url: string) => {
    setState(prev => ({ ...prev, url }));
  }, []);

  const startFullScan = useCallback(async () => {
    if (!state.url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    if (!validationService.validateUrl(state.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isScanning: true,
        scanProgress: 0,
        scanStage: 'Initializing scan...',
        isError: false,
        errorMessage: ''
      }));

      const formattedUrl = validationService.formatUrl(state.url);
      const task = await firecrawlService.startCrawl(formattedUrl);
      
      setTaskId(task.id);
      
      toast({
        title: "Scan started",
        description: "The website scan has been initiated"
      });
    } catch (error) {
      console.error('Error starting scan:', error);
      setState(prev => ({
        ...prev,
        isScanning: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
      
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : "Failed to start the scan",
        variant: "destructive"
      });
    }
  }, [state.url, toast]);

  return {
    url: state.url,
    isScanning: state.isScanning,
    scanProgress: state.scanProgress,
    scanStage: state.scanStage,
    isError: state.isError,
    errorMessage: state.errorMessage,
    scanResults: state.scanResults,
    handleUrlChange,
    startFullScan,
    taskId
  };
};
