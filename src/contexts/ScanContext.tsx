
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useScan } from '@/hooks/use-scan';

interface ScanContextType {
  isScanning: boolean;
  scanDetails: {
    current_url: string;
    pages_scanned: number;
    estimated_pages: number;
    stage: string;
    progress: number;
  };
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
  
  return (
    <ScanContext.Provider value={{
      isScanning: scan.isScanning,
      scanDetails: scan.scanDetails,
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
