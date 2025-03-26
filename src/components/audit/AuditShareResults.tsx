
import React from 'react';
import { motion } from 'framer-motion';
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { CopyLinkButton, EmailShareButton, ExportDropdown } from './share';

interface AuditShareResultsProps {
  auditId?: string;
  auditData?: AuditData;
  url?: string;
  historyItems?: AuditHistoryItem[];
}

const AuditShareResults: React.FC<AuditShareResultsProps> = ({ 
  auditId, 
  auditData, 
  url = window.location.href, 
  historyItems 
}) => {
  return (
    <motion.div 
      className="flex flex-col items-center gap-2 mt-8 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-muted-foreground text-sm mb-2">Поделиться результатами аудита {auditId ? `#${auditId}` : ''}</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <CopyLinkButton />
        <EmailShareButton />
        <ExportDropdown 
          auditData={auditData} 
          url={url}
          historyItems={historyItems}
        />
      </div>
    </motion.div>
  );
};

export default AuditShareResults;
