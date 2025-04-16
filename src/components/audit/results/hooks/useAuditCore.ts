
import { useAudit } from '@/hooks/use-audit';

export const useAuditCore = (url: string) => {
  // Используем централизованный хук для работы с аудитом
  const {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    setIsRefreshing,
    loadAuditData,
    setAuditData,
  } = useAudit(url);

  return {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    setIsRefreshing,
    loadAuditData,
    setAuditData,
  };
};
