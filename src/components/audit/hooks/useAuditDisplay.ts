
import { useMemo } from 'react';
import { AuditData, RecommendationData } from '@/types/audit';

interface UseAuditDisplayProps {
  isLoading: boolean;
  isScanning: boolean;
  auditError: string | null;
  auditData: AuditData | null;
  recommendations: RecommendationData | null;
  variant?: 'full' | 'minimal';
}

export const useAuditDisplay = ({
  isLoading,
  isScanning,
  auditError,
  auditData,
  recommendations,
  variant = 'full'
}: UseAuditDisplayProps) => {
  const shouldShowStatus = useMemo(() => {
    return variant === 'full' && (isLoading || isScanning || auditError);
  }, [variant, isLoading, isScanning, auditError]);

  const shouldShowResults = useMemo(() => {
    return !isLoading && !isScanning && !auditError && auditData && recommendations;
  }, [isLoading, isScanning, auditError, auditData, recommendations]);

  const shouldShowMinimalResults = useMemo(() => {
    return variant === 'minimal' && auditData;
  }, [variant, auditData]);

  return {
    shouldShowStatus,
    shouldShowResults,
    shouldShowMinimalResults
  };
};
