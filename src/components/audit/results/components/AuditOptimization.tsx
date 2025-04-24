
import React from 'react';
import { OptimizationCost } from './optimization';
import ContentOptimizationPrompt from './ContentOptimizationPrompt';
import { OptimizationItem } from './optimization/CostDetailsTable';

interface AuditOptimizationProps {
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  url: string;
  pageCount: number;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onOptimize: () => void;
  onDownloadOptimizedSite: () => void;
  onGeneratePdfReport: () => void;
  setContentOptimizationPrompt: (prompt: string) => void;
}

const AuditOptimization: React.FC<AuditOptimizationProps> = ({
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  url,
  pageCount,
  showPrompt,
  onTogglePrompt,
  onOptimize,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
  setContentOptimizationPrompt
}) => {
  if (!optimizationCost && !showPrompt) return null;
  
  return (
    <>
      {showPrompt && (
        <ContentOptimizationPrompt 
          prompt={contentPrompt} 
          setPrompt={setContentOptimizationPrompt}
          onOptimize={onOptimize}
          className="mb-4"
        />
      )}
      
      {optimizationCost && (
        <OptimizationCost 
          optimizationCost={optimizationCost}
          pageCount={pageCount}
          url={url}
          onDownloadOptimized={onDownloadOptimizedSite}
          isOptimized={isOptimized}
          optimizationItems={optimizationItems}
          onGeneratePdfReport={onGeneratePdfReport}
          className="mb-4"
        />
      )}
    </>
  );
};

export default AuditOptimization;
