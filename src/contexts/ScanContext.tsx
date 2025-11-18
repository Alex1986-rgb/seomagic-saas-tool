
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useScan } from '@/hooks/use-scan';

// Define the ScanDetails interface
export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress: number;
}

// Define the scan context type
interface ScanContextType {
  url: string;
  isScanning: boolean;
  scanDetails: ScanDetails;
  taskId: string | null;
  sitemap: any;
  pageStats: any;
  startScan: (deepScan?: boolean) => Promise<string | null>;
  cancelScan: () => Promise<void>;
  downloadSitemap: () => Promise<void>;
}

// Create the context with default values
const ScanContext = createContext<ScanContextType>({
  url: '',
  isScanning: false,
  scanDetails: {
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle',
    progress: 0
  },
  taskId: null,
  sitemap: null,
  pageStats: null,
  startScan: async () => null,
  cancelScan: async () => {},
  downloadSitemap: async () => {}
});

// Provider component
export const ScanProvider: React.FC<{ children: ReactNode; url: string }> = ({ 
  children, 
  url 
}) => {
  const {
    isScanning,
    scanDetails,
    sitemap,
    taskId,
    pageStats,
    startScan,
    cancelScan,
    downloadSitemap: downloadSitemapFn
  } = useScan(url);
  
  // Ensure scanDetails has all required properties with default values
  const scanDetailsWithDefaults: ScanDetails = {
    current_url: scanDetails?.current_url || '',
    pages_scanned: scanDetails?.pages_scanned || 0,
    estimated_pages: scanDetails?.estimated_pages || 0,
    stage: scanDetails?.stage || 'idle',
    progress: scanDetails?.progress || 0,
    task_id: taskId
  } as any;
  
  // Wrap the downloadSitemap function to ensure it returns a Promise
  const downloadSitemap = useCallback(async (): Promise<void> => {
    if (downloadSitemapFn) {
      await downloadSitemapFn();
    }
  }, [downloadSitemapFn]);
  
  return (
    <ScanContext.Provider value={{
      url,
      isScanning,
      scanDetails: scanDetailsWithDefaults,
      taskId,
      sitemap,
      pageStats,
      startScan,
      cancelScan,
      downloadSitemap
    }}>
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook to use the scan context
export const useScanContext = () => {
  const context = useContext(ScanContext);
  
  if (context === undefined) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  
  return context;
};
