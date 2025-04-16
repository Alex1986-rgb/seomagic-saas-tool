
import React from 'react';
import { motion } from 'framer-motion';
import AuditSummary from '@/components/AuditSummary';
import AuditContent from '../AuditContent';

interface AuditMainProps {
  url: string;
  auditData: any;
  recommendations: any;
  historyData: any;
  taskId: string;
  onSelectAudit: (auditId: string) => void;
}

const AuditMain: React.FC<AuditMainProps> = ({
  url,
  auditData,
  recommendations,
  historyData,
  taskId,
  onSelectAudit
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
        onSelectAudit={onSelectAudit}
        taskId={taskId}
      />
    </motion.div>
  );
};

export default AuditMain;
