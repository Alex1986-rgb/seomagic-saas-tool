
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuditSummary from '@/components/AuditSummary';
import AuditLoading from '../AuditLoading';
import AuditError from './AuditError';
import AuditContent from './AuditContent';
import PageCountDisplay from '../PageCountDisplay';
import { useAuditData } from './hooks/useAuditData';
import AuditHeader from './components/AuditHeader';
import AuditScanning from './components/AuditScanning';
import AuditRefreshing from './components/AuditRefreshing';

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  const {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    loadAuditData
  } = useAuditData(url);

  const handleRefreshAudit = () => {
    loadAuditData(true);
  };

  const handleDeepScan = () => {
    loadAuditData(false, true);
  };

  const handleSelectHistoricalAudit = (auditId: string) => {
    // This could be moved to a separate function or context in a future refactoring
    // For now, keeping the original implementation
    // toast({
    //   title: "Исторический аудит",
    //   description: `Запрос данных аудита ID: ${auditId}`,
    // });
  };

  if (isLoading) {
    return <AuditLoading progress={loadingProgress} />;
  }

  if (isScanning) {
    return <AuditScanning url={url} scanDetails={scanDetails} />;
  }

  if (error) {
    return <AuditError error={error} onRetry={() => loadAuditData()} />;
  }

  if (!auditData || !recommendations) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500">Не удалось загрузить данные аудита</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {isRefreshing && <AuditRefreshing />}
        
        <AuditHeader 
          onRefresh={handleRefreshAudit}
          onDeepScan={handleDeepScan}
          isRefreshing={isRefreshing}
        />
        
        {auditData.pageCount && (
          <PageCountDisplay 
            pageCount={auditData.pageCount} 
            isScanning={false}
            pageStats={pageStats}
          />
        )}
        
        <AuditSummary 
          url={url} 
          score={auditData.score}
          date={auditData.date}
          issues={auditData.issues}
          previousScore={auditData.previousScore}
          auditData={auditData}
        />
        
        <AuditContent 
          auditData={auditData}
          recommendations={recommendations}
          historyData={historyData}
          url={url}
          onSelectAudit={handleSelectHistoricalAudit}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditResultsContainer;
