
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuditData, AuditHistoryData, RecommendationData } from '@/types/audit';
import { auditDataService } from '@/api/services/auditDataService';

interface AuditDataContextType {
  auditData: AuditData | null;
  recommendations: RecommendationData | null;
  historyData: AuditHistoryData;
  error: string | null;
  isLoading: boolean;
  loadingProgress: number;
  isRefreshing: boolean;
  loadAuditData: (refresh?: boolean) => Promise<void>;
  generatePdfReportFile: () => Promise<void>;
  exportJSONData: () => Promise<void>;
}

const AuditDataContext = createContext<AuditDataContextType>({
  auditData: null,
  recommendations: null,
  historyData: { url: '', items: [] },
  error: null,
  isLoading: false,
  loadingProgress: 0,
  isRefreshing: false,
  loadAuditData: async () => {},
  generatePdfReportFile: async () => {},
  exportJSONData: async () => {}
});

export const AuditDataProvider: React.FC<{ children: ReactNode; url: string }> = ({ 
  children, 
  url 
}) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Use React Query for data fetching
  const { 
    data: auditData, 
    error,
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['auditData', url],
    queryFn: async () => {
      if (!url) return null;
      
      setLoadingProgress(10);
      const data = await auditDataService.fetchAuditData(url);
      setLoadingProgress(100);
      
      return data;
    },
    enabled: !!url
  });
  
  // Use React Query for recommendations
  const { 
    data: recommendations 
  } = useQuery({
    queryKey: ['recommendations', url],
    queryFn: () => auditDataService.fetchRecommendations(url),
    enabled: !!url
  });
  
  // Use React Query for history data
  const { 
    data: historyData = { url, items: [] } 
  } = useQuery({
    queryKey: ['historyData', url],
    queryFn: () => auditDataService.fetchAuditHistory(url),
    enabled: !!url
  });
  
  const loadAuditData = useCallback(async (refresh: boolean = false) => {
    setIsRefreshing(refresh);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);
  
  const generatePdfReportFile = useCallback(async () => {
    if (!auditData) return;
    
    // Implementation would go here
    console.log("Generating PDF report for", url);
  }, [auditData, url]);
  
  const exportJSONData = useCallback(async () => {
    if (!auditData) return;
    
    // Implementation would go here
    console.log("Exporting JSON data for", url);
  }, [auditData, url]);
  
  return (
    <AuditDataContext.Provider value={{
      auditData: auditData || null,
      recommendations: recommendations || null,
      historyData: historyData || { url, items: [] },
      error: error ? String(error) : null,
      isLoading,
      loadingProgress,
      isRefreshing,
      loadAuditData,
      generatePdfReportFile,
      exportJSONData
    }}>
      {children}
    </AuditDataContext.Provider>
  );
};

export const useAuditDataContext = () => {
  const context = useContext(AuditDataContext);
  
  if (context === undefined) {
    throw new Error('useAuditDataContext must be used within an AuditDataProvider');
  }
  
  return context;
};
