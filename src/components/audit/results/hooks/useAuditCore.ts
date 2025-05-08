
import { useState } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { AuditData } from '@/types/audit';

/**
 * Хук для работы с данными аудита и их состоянием
 * Является связующим звеном между ScanContext и базовым AuditContext
 */
export const useAuditCore = (url: string) => {
  // State for refreshing flag and audit data state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [auditDataState, setAuditDataState] = useState<AuditData | null>(null);
  
  // Use the audit context
  const {
    isLoading,
    loadingProgress,
    auditData: contextAuditData,
    recommendations,
    historyData,
    error,
    isScanning,
    scanDetails,
    loadAuditData,
  } = useAuditContext();

  return {
    isLoading,
    loadingProgress,
    auditData: auditDataState || contextAuditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    setIsRefreshing,
    loadAuditData,
    setAuditData: setAuditDataState,
  };
};
