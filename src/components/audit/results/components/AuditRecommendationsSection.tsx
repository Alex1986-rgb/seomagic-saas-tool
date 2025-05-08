
import React from 'react';
import { motion } from 'framer-motion';
import AuditRecommendations from '@/components/audit/AuditRecommendations';
import { AuditIssuesAndEstimate } from './AuditIssuesAndEstimate';

interface AuditRecommendationsSectionProps {
  recommendations: any;
  auditData: any;
  optimizationCost: any;
  optimizationItems: any;
}

const AuditRecommendationsSection: React.FC<AuditRecommendationsSectionProps> = ({
  recommendations,
  auditData,
  optimizationCost,
  optimizationItems
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Блок детализации ошибок и сметы */}
      {auditData && (
        <AuditIssuesAndEstimate 
          auditData={auditData} 
          optimizationCost={optimizationCost} 
          optimizationItems={optimizationItems} 
        />
      )}

      {/* Подробные рекомендации по категориям */}
      {recommendations && (
        <AuditRecommendations recommendations={recommendations} />
      )}
    </motion.div>
  );
};

export default AuditRecommendationsSection;
