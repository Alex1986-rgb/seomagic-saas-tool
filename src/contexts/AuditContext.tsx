
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuditData, AuditHistoryData, RecommendationData } from '@/types/audit';
import { useAudit } from '@/hooks/use-audit';

// Define the context type
interface AuditContextType {
  url: string;
  auditData: AuditData | null;
  recommendations: RecommendationData | null;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
  historyData: AuditHistoryData;
  isRefreshing: boolean;
  optimizationCost: number;
  optimizationItems: any[];
  isOptimized: boolean;
  contentPrompt: string;
  taskId: string | null;
  isScanning: boolean;
  scanDetails: {
    current_url: string;
    pages_scanned: number;
    estimated_pages: number;
    stage: string;
    progress: number;
  };
  updateUrl: (url: string) => void;
  loadAuditData: (refresh?: boolean, deepScan?: boolean) => Promise<any>;
  generatePdfReportFile: () => Promise<void>;
  exportJSONData: () => Promise<void>;
  downloadOptimizedSite: () => Promise<void>;
  optimizeSiteContent: () => Promise<void>;
  setContentOptimizationPrompt: (prompt: string) => void;
}

// Create the context with default values
const AuditContext = createContext<AuditContextType>({
  url: '',
  auditData: null,
  recommendations: null,
  isLoading: false,
  loadingProgress: 0,
  error: null,
  historyData: { url: '', items: [] },
  isRefreshing: false,
  optimizationCost: 0,
  optimizationItems: [],
  isOptimized: false,
  contentPrompt: '',
  taskId: null,
  isScanning: false,
  scanDetails: {
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle',
    progress: 0
  },
  updateUrl: () => {},
  loadAuditData: async () => null,
  generatePdfReportFile: async () => {},
  exportJSONData: async () => {},
  downloadOptimizedSite: async () => {},
  optimizeSiteContent: async () => {},
  setContentOptimizationPrompt: () => {},
});

// Provider component
export const AuditProvider: React.FC<{ children: ReactNode; initialUrl?: string }> = ({ 
  children, 
  initialUrl = '' 
}) => {
  const audit = useAudit(initialUrl);
  
  return (
    <AuditContext.Provider value={{
      url: audit.url,
      auditData: audit.auditData,
      recommendations: audit.recommendations,
      isLoading: audit.isLoading,
      loadingProgress: audit.loadingProgress,
      error: audit.error,
      historyData: { 
        url: audit.url, 
        items: Array.isArray(audit.historyData) ? audit.historyData : [] 
      },
      isRefreshing: audit.isRefreshing,
      optimizationCost: audit.optimizationCost,
      optimizationItems: audit.optimizationItems,
      isOptimized: audit.isOptimized,
      contentPrompt: audit.contentPrompt,
      taskId: audit.taskId,
      isScanning: audit.isScanning,
      scanDetails: audit.scanDetails || {
        current_url: '',
        pages_scanned: 0,
        estimated_pages: 0,
        stage: 'idle',
        progress: 0
      },
      updateUrl: audit.updateUrl,
      loadAuditData: audit.loadAuditData,
      generatePdfReportFile: audit.generatePdfReportFile,
      exportJSONData: audit.exportJSONData,
      downloadOptimizedSite: audit.downloadOptimizedSite,
      optimizeSiteContent: audit.optimizeSiteContent,
      setContentOptimizationPrompt: audit.setContentOptimizationPrompt,
    }}>
      {children}
    </AuditContext.Provider>
  );
};

// Custom hook to use the audit context
export const useAuditContext = () => {
  const context = useContext(AuditContext);
  
  if (context === undefined) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  
  return context;
};
