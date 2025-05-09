
import React from 'react';
import { motion } from 'framer-motion';
import AuditOptimization from './AuditOptimization';
import { OptimizationItem } from '@/types/audit.d';

interface AuditOptimizationSectionProps {
  optimizationCost: any;
  optimizationItems: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  url: string;
  pageCount: number;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onOptimize: () => Promise<void>;
  onDownloadOptimizedSite: () => Promise<void>;
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
  // Transform optimization items to ensure all required fields are present
  // This addresses the type mismatch between different OptimizationItem definitions
  const validOptimizationItems = optimizationItems.map(item => ({
    ...item,
    id: item.id || `item-${Math.random().toString(36).substr(2, 9)}`, // Ensure id exists
    page: item.page || url, // Ensure page exists with fallback to current URL
    tasks: item.tasks || [], // Ensure tasks exists as empty array if not provided
    cost: item.cost || item.totalPrice || 0, // Ensure cost exists
    priority: item.priority || 'medium', // Set default priority
    category: item.category || 'general' // Set default category
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <AuditOptimization 
        optimizationCost={optimizationCost}
        optimizationItems={validOptimizationItems}
        isOptimized={isOptimized}
        contentPrompt={contentPrompt}
        url={url}
        pageCount={pageCount}
        showPrompt={showPrompt}
        onTogglePrompt={onTogglePrompt}
        onOptimizeSiteContent={onOptimize}
        onDownloadOptimizedSite={onDownloadOptimizedSite}
        setContentPrompt={setContentOptimizationPrompt}
      />
    </motion.div>
  );
};

export default AuditOptimizationSection;
