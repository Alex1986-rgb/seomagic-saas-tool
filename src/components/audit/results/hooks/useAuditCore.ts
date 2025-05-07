
import { useAudit } from '@/hooks/use-audit';

/**
 * Хук для работы с данными аудита и их состоянием
 * Является связующим звеном между useScan и базовым useAudit
 */
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
