
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuditDataProvider, useAuditDataContext } from './AuditDataContext';
import { ScanProvider, useScanContext } from './ScanContext';
import { OptimizationProvider, useOptimizationContext } from './OptimizationContext';

// Define the context type (now much smaller, mostly just combining the other contexts)
interface AuditContextType {
  url: string;
  updateUrl: (url: string) => void;
}

// Create the context with default values
const AuditContext = createContext<AuditContextType>({
  url: '',
  updateUrl: () => {},
});

// Provider component
export const AuditProvider: React.FC<{ children: ReactNode; initialUrl?: string }> = ({ 
  children, 
  initialUrl = '' 
}) => {
  const [url, setUrl] = useState(initialUrl);
  
  // Update URL
  const updateUrl = useCallback((newUrl: string) => {
    setUrl(newUrl);
  }, []);
  
  return (
    <AuditContext.Provider value={{ url, updateUrl }}>
      <AuditDataProvider url={url}>
        <ScanProvider url={url}>
          <OptimizationProvider taskId={useScanContext().taskId}>
            {children}
          </OptimizationProvider>
        </ScanProvider>
      </AuditDataProvider>
    </AuditContext.Provider>
  );
};

// Custom hook to use the audit context
export const useAuditContext = () => {
  const auditContext = useContext(AuditContext);
  const auditDataContext = useAuditDataContext();
  const scanContext = useScanContext();
  const optimizationContext = useOptimizationContext();
  
  if (auditContext === undefined) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  
  // Combine all contexts into one for backward compatibility
  return {
    // From main AuditContext
    url: auditContext.url,
    updateUrl: auditContext.updateUrl,
    
    // From AuditDataContext
    auditData: auditDataContext.auditData,
    recommendations: auditDataContext.recommendations,
    historyData: auditDataContext.historyData,
    error: auditDataContext.error,
    isLoading: auditDataContext.isLoading,
    loadingProgress: auditDataContext.loadingProgress,
    isRefreshing: auditDataContext.isRefreshing,
    loadAuditData: auditDataContext.loadAuditData,
    generatePdfReportFile: auditDataContext.generatePdfReportFile,
    exportJSONData: auditDataContext.exportJSONData,
    
    // From ScanContext
    isScanning: scanContext.isScanning,
    scanDetails: scanContext.scanDetails,
    taskId: scanContext.taskId,
    sitemap: scanContext.sitemap,
    pageStats: scanContext.pageStats,
    startScan: scanContext.startScan,
    cancelScan: scanContext.cancelScan,
    downloadSitemap: scanContext.downloadSitemap,
    
    // From OptimizationContext
    optimizationCost: optimizationContext.optimizationCost,
    optimizationItems: optimizationContext.optimizationItems,
    isOptimized: optimizationContext.isOptimized,
    contentPrompt: optimizationContext.contentPrompt,
    setContentOptimizationPrompt: optimizationContext.setContentOptimizationPrompt,
    optimizeSiteContent: (prompt: string) => optimizationContext.optimizeSiteContent(scanContext.taskId || '', prompt),
    downloadOptimizedSite: () => optimizationContext.downloadOptimizedSite(scanContext.taskId || '')
  };
};
