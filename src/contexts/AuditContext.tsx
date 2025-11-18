
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { AuditDataProvider, useAuditDataContext } from './AuditDataContext';
import { ScanProvider, useScanContext } from './ScanContext';
import { OptimizationProvider, useOptimizationContext } from './OptimizationContext';
import { AuditModuleProvider, useAuditModuleContext } from './AuditModuleContext';

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

// Bridge component to pass taskId from ScanContext to OptimizationProvider
const OptimizationBridge = React.memo<{ children: ReactNode }>(({ children }) => {
  const { taskId } = useScanContext();
  console.log('🔧 OptimizationBridge initialized with taskId:', taskId);
  return (
    <OptimizationProvider taskId={taskId}>
      {children}
    </OptimizationProvider>
  );
});
OptimizationBridge.displayName = 'OptimizationBridge';

// Bridge component to pass taskId from ScanContext to AuditDataProvider
const AuditDataBridge = React.memo<{ url: string; children: ReactNode }>(({ url, children }) => {
  const { taskId } = useScanContext();
  console.log('🔧 AuditDataBridge initialized with url:', url, 'taskId:', taskId);
  return (
    <AuditDataProvider url={url} taskId={taskId}>
      {children}
    </AuditDataProvider>
  );
});
AuditDataBridge.displayName = 'AuditDataBridge';

// Provider component
export const AuditProvider: React.FC<{ children: ReactNode; initialUrl?: string }> = ({ 
  children, 
  initialUrl = '' 
}) => {
  const [url, setUrl] = useState(initialUrl);
  
  // React to initialUrl changes (fixes race condition when URL is set after mount)
  useEffect(() => {
    if (initialUrl !== url) {
      console.log('🔄 AuditProvider: initialUrl changed from', url, 'to', initialUrl);
      setUrl(initialUrl);
    }
  }, [initialUrl, url]);
  
  // Update URL
  const updateUrl = useCallback((newUrl: string) => {
    setUrl(newUrl);
  }, []);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ url, updateUrl }), [url, updateUrl]);
  
  console.log('🔧 AuditProvider initialized with initialUrl:', initialUrl, 'current url:', url);
  
  return (
    <AuditContext.Provider value={contextValue}>
      <ScanProvider url={url}>
        <AuditDataBridge url={url}>
          <OptimizationBridge>
            <AuditModuleProvider>
              {children}
            </AuditModuleProvider>
          </OptimizationBridge>
        </AuditDataBridge>
      </ScanProvider>
    </AuditContext.Provider>
  );
};

// Custom hook to use the audit context
export const useAuditContext = () => {
  const auditContext = useContext(AuditContext);
  const auditDataContext = useAuditDataContext();
  const scanContext = useScanContext();
  const optimizationContext = useOptimizationContext();
  const moduleContext = useAuditModuleContext();
  
  if (auditContext === undefined) {
    throw new Error('useAuditContext must be used within an AuditProvider');
  }
  
  // Combine all contexts into one for backward compatibility
  // Memoize to prevent creating new object on every render
  return useMemo(() => ({
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
    loadOptimizationCost: optimizationContext.loadOptimizationCost,
    optimizeSiteContent: optimizationContext.optimizeSiteContent,
    downloadOptimizedSite: optimizationContext.downloadOptimizedSite,
    
    // From AuditModuleContext
    isStartingAudit: moduleContext.isStartingAudit,
    startAudit: moduleContext.startAudit,
    cancelAudit: moduleContext.cancelAudit,
    currentTaskId: moduleContext.currentTaskId,
    auditStatus: moduleContext.auditStatus,
    isPollingStatus: moduleContext.isPollingStatus,
    startPolling: moduleContext.startPolling,
    stopPolling: moduleContext.stopPolling,
    audits: moduleContext.audits,
    isLoadingAudits: moduleContext.isLoadingAudits,
    auditsError: moduleContext.auditsError,
    refetchAudits: moduleContext.refetchAudits,
    isOptimizing: moduleContext.isOptimizing,
    optimizationId: moduleContext.optimizationId,
    startOptimization: moduleContext.startOptimization,
    reports: moduleContext.reports,
    isLoadingReports: moduleContext.isLoadingReports,
    reportsError: moduleContext.reportsError,
    refetchReports: moduleContext.refetchReports,
  }), [auditContext, auditDataContext, scanContext, optimizationContext, moduleContext]);
};
