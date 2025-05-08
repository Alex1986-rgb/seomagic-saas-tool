
import { useState, useEffect } from 'react';
import { AuditDataAccess } from '@/data/auditDataAccess';
import { useAuditAPI } from '@/hooks/use-audit-api';
import { OptimizationItem } from '@/services/audit/optimization/types';
import { AuditData } from '@/types/audit';
import { ScanDetails } from '@/types/api';

/**
 * Provider hook for audit data management and operation
 */
export const useAuditDataProvider = (url: string) => {
  // State for audit data
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [historyData, setHistoryData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanDetails, setScanDetails] = useState<ScanDetails>({
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle'
  });
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [contentPrompt, setContentPrompt] = useState<string>('');
  const [optimizationCost, setOptimizationCost] = useState<number>(0);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [pagesContent, setPagesContent] = useState<any[]>([]);

  // Get API methods from our hooks
  const {
    taskId,
    isPolling,
    startScan,
    setupPolling,
    cancelScan,
    downloadSitemap: downloadSitemapApi,
    downloadOptimizedSite: downloadOptimizedSiteApi,
    exportJSONData: exportJSONDataApi,
    generatePdfReport: generatePdfReportApi,
    isLoadingCost,
    loadOptimizationCost,
    optimizeSiteContent: optimizeSiteContentApi
  } = useAuditAPI(url);

  /**
   * Load audit data from API or cache
   */
  const loadAuditData = async (useCache = true) => {
    if (!url) return;
    
    setIsLoading(true);
    setLoadingProgress(10);
    
    // Try to get cached data first if allowed
    if (useCache) {
      const cachedData = AuditDataAccess.getCachedAuditData(url);
      if (cachedData) {
        setAuditData(cachedData.auditData);
        setRecommendations(cachedData.recommendations);
        setHistoryData(cachedData.historyData);
        setIsLoading(false);
        setLoadingProgress(100);
        return;
      }
    }
    
    setLoadingProgress(20);
    
    try {
      // Fetch data from API
      const result = await AuditDataAccess.loadAuditData(url);
      
      setLoadingProgress(80);
      
      if (result.error) {
        setError(result.error);
      } else {
        setAuditData(result.auditData);
        setRecommendations(result.recommendations);
        setHistoryData(result.historyData);
        setError(null);
        
        // Cache the results
        AuditDataAccess.saveAuditDataToCache(url, {
          auditData: result.auditData,
          recommendations: result.recommendations,
          historyData: result.historyData
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading audit data:', err);
    } finally {
      setIsLoading(false);
      setLoadingProgress(100);
    }
  };

  /**
   * Handle scan status update
   */
  const handleScanStatusUpdate = (status: ScanDetails) => {
    setScanDetails(status);
  };

  /**
   * Handle scan completion
   */
  const handleScanComplete = async (status: any) => {
    setIsScanning(false);
    
    // Load scan results
    if (taskId) {
      const results = await AuditDataAccess.loadScanResults(taskId);
      setScanResult(results);
      
      // After scan completes, load optimization cost calculation
      loadOptimizationCost(taskId, setOptimizationCost, setOptimizationItems);
    }
    
    // Also refresh the audit data
    await loadAuditData(false);
  };

  /**
   * Handle scan error
   */
  const handleScanError = (errorMessage: string) => {
    setIsScanning(false);
    setError(errorMessage);
  };

  /**
   * Start website scan
   */
  const startWebsiteScan = async (deepScan = false) => {
    setIsScanning(true);
    setError(null);
    
    const newTaskId = await startScan(deepScan);
    
    if (newTaskId) {
      setupPolling(newTaskId, handleScanStatusUpdate, handleScanComplete, handleScanError);
      return newTaskId;
    } else {
      setIsScanning(false);
      return null;
    }
  };

  /**
   * Download sitemap wrapper
   */
  const downloadSitemap = () => {
    return downloadSitemapApi();
  };

  /**
   * Download optimized site wrapper
   */
  const downloadOptimizedSite = () => {
    return downloadOptimizedSiteApi();
  };

  /**
   * Generate PDF report wrapper
   */
  const generatePdfReportFile = () => {
    if (!auditData) return Promise.resolve(false);
    return generatePdfReportApi(auditData);
  };

  /**
   * Export JSON data wrapper
   */
  const exportJSONData = () => {
    return exportJSONDataApi(auditData);
  };

  /**
   * Optimize site content wrapper
   */
  const optimizeSiteContent = async () => {
    const result = await optimizeSiteContentApi(contentPrompt);
    if (result) {
      setIsOptimized(true);
    }
    return result;
  };

  /**
   * Set content optimization prompt
   */
  const setContentOptimizationPrompt = (prompt: string) => {
    setContentPrompt(prompt);
  };

  // Extract page stats and sitemap from scan result
  const pageStats = scanResult?.pageStats || null;
  const sitemap = scanResult?.sitemap || null;

  return {
    // State
    auditData,
    recommendations,
    historyData,
    error,
    isLoading,
    loadingProgress,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    contentPrompt,
    optimizationCost,
    optimizationItems,
    isOptimized,
    taskId,
    
    // Actions
    loadAuditData,
    setIsRefreshing,
    startWebsiteScan,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt,
    cancelScan
  };
};

export default useAuditDataProvider;
