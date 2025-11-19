
import React from 'react';
import { motion } from 'framer-motion';
import AuditLoading from '../../AuditLoading';
import AuditTimeoutMessage from '../../AuditTimeoutMessage';
import { ManualAuditStarter } from '../../ManualAuditStarter';
import { InteractiveAuditMonitor } from '../../monitoring/InteractiveAuditMonitor';
import { PartialResultsView } from '../PartialResultsView';
import { Card } from "@/components/ui/card";
import { OptimizationItem } from '@/types/audit/optimization-types';

interface AuditStateHandlerProps {
  isLoading: boolean;
  hadError: boolean;
  timeout: boolean;
  onRetry: () => void;
  children: React.ReactNode;
  url?: string;
  taskId?: string | null;
  scanDetails?: {
    status: string;
    progress: number;
    pages_scanned: number;
    estimated_pages: number;
  };
  partialData?: any;
  completionPercentage?: number;
  optimizationItems?: OptimizationItem[];
  onDownloadPartialReport?: () => void;
}

// Animation variants for content transitions
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AuditStateHandler: React.FC<AuditStateHandlerProps> = ({
  isLoading,
  hadError,
  timeout,
  onRetry,
  children,
  url = '',
  taskId,
  scanDetails,
  partialData,
  completionPercentage,
  optimizationItems = [],
  onDownloadPartialReport,
}) => {
  // Show interactive monitor if task is in progress or failed with partial data
  const showMonitor = taskId && scanDetails && (
    (isLoading && scanDetails.status === 'processing') ||
    (hadError && scanDetails.pages_scanned > 0)
  );

  if (showMonitor) {
    return (
      <div className="space-y-6">
        <InteractiveAuditMonitor
          taskId={taskId}
          progress={scanDetails.progress}
          pagesScanned={scanDetails.pages_scanned}
          totalPages={scanDetails.estimated_pages}
          status={scanDetails.status}
          optimizationItems={optimizationItems}
          onDownloadPartialReport={onDownloadPartialReport || (() => {})}
          onRetry={onRetry}
        />
        {partialData && (
          <PartialResultsView
            results={partialData}
            completionPercentage={completionPercentage || 0}
          />
        )}
      </div>
    );
  }

  if (isLoading) {
    return <AuditLoading />;
  }

  if (timeout) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-border">
        <div className="space-y-6">
          <AuditTimeoutMessage url={url} onRetry={onRetry} />
          <div className="pt-4 border-t border-border">
            <ManualAuditStarter url={url} onStarted={onRetry} />
          </div>
        </div>
      </Card>
    );
  }

  if (hadError) {
    return (
      <Card className="p-6 bg-card/90 backdrop-blur-sm border-border">
        <div className="text-center space-y-4">
          <div className="text-xl font-semibold text-destructive">
            Произошла ошибка во время анализа
          </div>
          <p className="text-muted-foreground">
            Мы не смогли получить данные аудита. Пожалуйста, попробуйте еще раз.
          </p>
          <button 
            onClick={onRetry} 
            className="bg-primary/10 hover:bg-primary/20 transition-colors text-primary px-4 py-2 rounded-md"
          >
            Попробовать снова
          </button>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={contentVariants}
    >
      {children}
    </motion.div>
  );
};

export default AuditStateHandler;
