
import React from 'react';
import { motion } from 'framer-motion';
import AuditTabs from '../AuditTabs';
import AuditRecommendations from '../AuditRecommendations';
import AuditShareResults from '../AuditShareResults';
import AuditComments from '../comments/AuditComments';
import AuditHistory from '../AuditHistory';
import AuditDataVisualizer from '../data-visualization/AuditDataVisualizer';
import AuditComparison from '../comparison/AuditComparison';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditContentProps {
  auditData: AuditData;
  recommendations: RecommendationData;
  historyData: AuditHistoryData | null;
  url: string;
  onSelectAudit: (auditId: string) => void;
}

const AuditContent: React.FC<AuditContentProps> = ({ 
  auditData, 
  recommendations, 
  historyData, 
  url,
  onSelectAudit 
}) => {
  const renderWithAnimation = (component: React.ReactNode, delay: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {component}
    </motion.div>
  );

  return (
    <>
      {historyData && historyData.items.length > 1 && 
        renderWithAnimation(
          <AuditHistory 
            historyItems={historyData.items} 
            onSelectAudit={onSelectAudit}
          />, 
          0.1
        )
      }
      
      {renderWithAnimation(
        <AuditDataVisualizer auditData={auditData.details} />, 
        0.15
      )}
      
      {historyData && historyData.items.length > 1 && 
        renderWithAnimation(
          <AuditComparison 
            currentAudit={auditData} 
            historyItems={historyData.items} 
          />, 
          0.2
        )
      }
      
      {renderWithAnimation(
        <AuditTabs details={auditData.details} />, 
        0.25
      )}
      
      {renderWithAnimation(
        <AuditRecommendations recommendations={recommendations} />, 
        0.3
      )}
      
      {renderWithAnimation(
        <AuditComments auditId={auditData.id} />, 
        0.35
      )}
      
      {renderWithAnimation(
        <AuditShareResults 
          auditId={auditData.id} 
          auditData={auditData}
          url={url}
          historyItems={historyData?.items}
        />, 
        0.4
      )}
    </>
  );
};

export default AuditContent;
