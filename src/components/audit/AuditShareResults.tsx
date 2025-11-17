
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { CopyLinkButton, EmailShareButton, ExportDropdown, SocialShareButtons } from './share';
import { AuditData, AuditHistoryItem } from '@/types/audit';

interface AuditShareResultsProps {
  auditId: string;
  auditData?: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
}

const AuditShareResults: React.FC<AuditShareResultsProps> = ({ 
  auditId, 
  auditData, 
  url,
  historyItems
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Создание полного URL для шеринга
  const shareUrl = `${window.location.origin}/audit?url=${encodeURIComponent(url)}`;
  
  // Заголовок для шеринга
  const shareTitle = `Результаты SEO аудита для ${url}`;
  
  // Описание для шеринга
  const shareSummary = auditData 
    ? `Общий балл: ${auditData.score}/100. Проверено: ${new Date(auditData.date).toLocaleDateString()}.`
    : `Полный SEO аудит сайта`;

  return (
    <div className="neo-card p-6 mb-8">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Поделиться результатами
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          }
        </h2>
      </div>

      <motion.div
        className="overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: expanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Поделиться ссылкой</h3>
              
              <div className="flex flex-wrap gap-3">
                <SocialShareButtons 
                  url={shareUrl} 
                  title={shareTitle}
                  summary={shareSummary}
                />
                <CopyLinkButton url={shareUrl} />
                <EmailShareButton 
                  url={shareUrl} 
                  subject={shareTitle}
                  body={shareSummary}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Поделитесь результатами аудита с коллегами или клиентами
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Экспорт результатов</h3>
              
              <div>
                <ExportDropdown 
                  auditData={auditData}
                  url={url}
                  historyItems={historyItems}
                  auditId={auditId}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-2">
                Загрузите отчёт о результатах аудита в удобном формате
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t text-center text-sm text-muted-foreground">
            <p>Отчет ID: {auditId} • Дата создания: {auditData && new Date(auditData.date).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditShareResults;
