
import { useState } from 'react';
import { useAudit } from '@/hooks/use-audit';
import { AuditData } from '@/types/audit';

/**
 * Хук для работы с данными аудита и их состоянием
 * Является связующим звеном между useScan и базовым useAudit
 */
export const useAuditCore = (url: string) => {
  // State for refreshing flag
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [auditDataState, setAuditDataState] = useState<AuditData | null>(null);
  
  // Используем централизованный хук для работы с аудитом
  const {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isScanning,
    scanDetails,
    loadAuditData,
  } = useAudit(url);

  // Set the audit data from the hook if needed
  const setAuditData = (newData: AuditData) => {
    setAuditDataState(newData);
  };

  return {
    isLoading,
    loadingProgress,
    auditData: auditDataState || auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    setIsRefreshing,
    loadAuditData,
    setAuditData,
  };
};
