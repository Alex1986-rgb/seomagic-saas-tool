
import { useQuery } from '@tanstack/react-query';
import { auditDataService } from '@/api/services/auditDataService';
import { seoApiService } from '@/api/services/seoApiService';

/**
 * Custom hook for audit data querying with React Query
 */
export const useAuditQuery = (url: string, taskId: string | null) => {
  // Fetch audit data
  const auditDataQuery = useQuery({
    queryKey: ['auditData', url],
    queryFn: () => auditDataService.fetchAuditData(url),
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch audit recommendations
  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', url],
    queryFn: () => auditDataService.fetchRecommendations(url),
    enabled: !!url,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch audit history
  const historyQuery = useQuery({
    queryKey: ['auditHistory', url],
    queryFn: () => auditDataService.fetchAuditHistory(url),
    enabled: !!url,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Fetch optimization cost when taskId is available
  const optimizationCostQuery = useQuery({
    queryKey: ['optimizationCost', taskId],
    queryFn: () => {
      if (!taskId) throw new Error('Task ID is required');
      return seoApiService.exportJSON(taskId).then(() => ({ cost: 0, items: [] }));
    },
    enabled: !!taskId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  
  // Fetch scan status when taskId is available
  const scanStatusQuery = useQuery({
    queryKey: ['scanStatus', taskId],
    queryFn: () => seoApiService.getStatus(taskId || ''),
    enabled: !!taskId,
    // Polling for active scans - fixed to access status from data properly
    refetchInterval: (query) => {
      if (query.data && query.data.status && ['running', 'pending', 'starting'].includes(query.data.status)) {
        return 2000; // Poll every 2 seconds while actively scanning
      }
      return false; // Stop polling when complete
    }
  });
  
  return {
    auditData: auditDataQuery.data,
    isLoadingAuditData: auditDataQuery.isLoading,
    auditError: auditDataQuery.error,
    
    recommendations: recommendationsQuery.data,
    isLoadingRecommendations: recommendationsQuery.isLoading,
    
    historyData: historyQuery.data,
    isLoadingHistory: historyQuery.isLoading,
    
    optimizationCost: optimizationCostQuery.data?.cost || 0,
    optimizationItems: optimizationCostQuery.data?.items || [],
    isLoadingOptimizationCost: optimizationCostQuery.isLoading,
    
    scanStatus: scanStatusQuery.data,
    isLoadingScanStatus: scanStatusQuery.isLoading,
    isScanStatusFetching: scanStatusQuery.isFetching,
    
    // Refetch functions
    refetchAuditData: auditDataQuery.refetch,
    refetchRecommendations: recommendationsQuery.refetch,
    refetchHistory: historyQuery.refetch,
    refetchOptimizationCost: optimizationCostQuery.refetch,
    refetchScanStatus: scanStatusQuery.refetch,
  };
};
