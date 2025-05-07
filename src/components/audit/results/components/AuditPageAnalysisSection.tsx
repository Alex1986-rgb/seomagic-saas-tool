
import React from 'react';
import { motion } from 'framer-motion';
import { usePageAnalysis } from '@/hooks/use-page-analysis';
import PageAnalysisTable from './PageAnalysisTable';

interface AuditPageAnalysisSectionProps {
  auditId: string | undefined;
}

const AuditPageAnalysisSection: React.FC<AuditPageAnalysisSectionProps> = ({ auditId }) => {
  // Получение данных анализа страниц
  const { data: pageAnalysisData, isLoading: isLoadingAnalysis } = usePageAnalysis(auditId);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="neo-card p-6"
    >
      <h2 className="text-xl font-semibold mb-4">Анализ страниц</h2>
      <PageAnalysisTable 
        data={pageAnalysisData}
        isLoading={isLoadingAnalysis}
      />
    </motion.div>
  );
};

export default AuditPageAnalysisSection;
