import React, { createContext, useContext, ReactNode } from 'react';
import { useAudit, useAuditStatus, useAuditList } from '@/modules/audit';
import { useOptimization } from '@/modules/optimization';
import { useReports } from '@/modules/reports';
import type { AuditStatusResponse } from '@/modules/audit';

interface AuditModuleContextType {
  // Audit module
  isStartingAudit: boolean;
  startAudit: (url: string, options?: { maxPages?: number; type?: 'quick' | 'deep' }) => Promise<string | null>;
  cancelAudit: (taskId: string) => Promise<void>;
  currentTaskId: string | null;
  
  // Audit status
  auditStatus: AuditStatusResponse | null;
  isPollingStatus: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  
  // Audit list
  audits: any[];
  isLoadingAudits: boolean;
  auditsError: string | null;
  refetchAudits: () => Promise<void>;
  
  // Optimization
  isOptimizing: boolean;
  optimizationId: string | null;
  startOptimization: (taskId: string, options?: any) => Promise<string | null>;
  
  // Reports
  reports: any[];
  isLoadingReports: boolean;
  reportsError: string | null;
  refetchReports: () => Promise<void>;
}

const AuditModuleContext = createContext<AuditModuleContextType | undefined>(undefined);

interface AuditModuleProviderProps {
  children: ReactNode;
  taskId?: string | null;
  onComplete?: (data: AuditStatusResponse) => void;
  onError?: (error: string) => void;
}

export const AuditModuleProvider: React.FC<AuditModuleProviderProps> = ({ 
  children, 
  taskId,
  onComplete,
  onError 
}) => {
  // Audit hooks
  const { 
    isLoading: isStartingAudit, 
    taskId: currentTaskId, 
    startAudit, 
    cancelAudit 
  } = useAudit();
  
  // Audit status hooks
  const { 
    status: auditStatus, 
    isPolling: isPollingStatus, 
    startPolling, 
    stopPolling 
  } = useAuditStatus({
    taskId: taskId || currentTaskId,
    onComplete,
    onError
  });
  
  // Audit list hooks
  const { 
    audits, 
    isLoading: isLoadingAudits, 
    error: auditsError, 
    refetch: refetchAudits 
  } = useAuditList();
  
  // Optimization hooks
  const { 
    isLoading: isOptimizing, 
    optimizationId, 
    startOptimization 
  } = useOptimization();
  
  // Reports hooks
  const { 
    reports, 
    isLoading: isLoadingReports, 
    error: reportsError, 
    refetch: refetchReports 
  } = useReports();
  
  return (
    <AuditModuleContext.Provider value={{
      // Audit
      isStartingAudit,
      startAudit,
      cancelAudit,
      currentTaskId,
      
      // Status
      auditStatus,
      isPollingStatus,
      startPolling,
      stopPolling,
      
      // List
      audits,
      isLoadingAudits,
      auditsError,
      refetchAudits,
      
      // Optimization
      isOptimizing,
      optimizationId,
      startOptimization,
      
      // Reports
      reports,
      isLoadingReports,
      reportsError,
      refetchReports
    }}>
      {children}
    </AuditModuleContext.Provider>
  );
};

export const useAuditModuleContext = () => {
  const context = useContext(AuditModuleContext);
  
  if (context === undefined) {
    throw new Error('useAuditModuleContext must be used within an AuditModuleProvider');
  }
  
  return context;
};
