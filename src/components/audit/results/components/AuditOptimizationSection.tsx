
import React from 'react';
import { motion } from 'framer-motion';
import AuditOptimization from './AuditOptimization';

interface AuditOptimizationSectionProps {
  optimizationCost: any;
  optimizationItems: any;
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

const AuditOptimizationSection: React.FC<AuditOptimizationSectionProps> = ({
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <AuditOptimization 
        optimizationCost={optimizationCost}
        optimizationItems={optimizationItems}
        isOptimized={isOptimized}
        contentPrompt={contentPrompt}
        url={url}
        pageCount={pageCount}
        showPrompt={showPrompt}
        onTogglePrompt={onTogglePrompt}
        onOptimize={onOptimize}
        onDownloadOptimizedSite={onDownloadOptimizedSite}
        onGeneratePdfReport={onGeneratePdfReport}
        setContentOptimizationPrompt={setContentOptimizationPrompt}
      />
    </motion.div>
  );
};

export default AuditOptimizationSection;
