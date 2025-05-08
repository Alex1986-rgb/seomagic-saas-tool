
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useScan } from '@/hooks/use-scan';

export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress: number; // Making this required since the interface that uses it requires it
}

interface ScanContextType {
  isScanning: boolean;
  scanDetails: ScanDetails;
  pageStats: {
    total: number;
    html: number;
    images: number;
    other: number;
  } | null;
  sitemap: string | null;
  taskId: string | null;
  startScan: (useSitemap?: boolean) => Promise<string | null>;
  cancelScan: () => Promise<void>;
  downloadSitemap: () => void;
}

// Create the context with default values
const ScanContext = createContext<ScanContextType>({
  isScanning: false,
  scanDetails: {
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle',
    progress: 0
  },
  pageStats: null,
  sitemap: null,
  taskId: null,
  startScan: async () => null,
  cancelScan: async () => {},
  downloadSitemap: () => {},
});

// Provider component
export const ScanProvider: React.FC<{ children: ReactNode; url: string; onPageCountUpdate?: (count: number) => void }> = ({ 
  children, 
  url,
  onPageCountUpdate
}) => {
  const scan = useScan(url, onPageCountUpdate);
  
  // Ensure scanDetails always has the required progress property
  const scanDetailsWithDefaults: ScanDetails = {
    current_url: scan.scanDetails?.current_url || '',
    pages_scanned: scan.scanDetails?.pages_scanned || 0,
    estimated_pages: scan.scanDetails?.estimated_pages || 0,
    stage: scan.scanDetails?.stage || 'idle',
    progress: scan.scanDetails?.progress || 0,
  };

  return (
    <ScanContext.Provider value={{
      isScanning: scan.isScanning,
      scanDetails: scanDetailsWithDefaults,
      pageStats: scan.pageStats,
      sitemap: scan.sitemap,
      taskId: scan.taskId,
      startScan: scan.startScan,
      cancelScan: scan.cancelScan,
      downloadSitemap: scan.downloadSitemap
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
