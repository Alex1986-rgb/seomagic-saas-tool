
import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { HistoryData } from '@/types/audit';

interface AuditResultHeaderProps {
  url: string;
  auditData: any;
  recommendations: any;
  historyData: HistoryData[] | null;
  taskId: string;
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
  onDownloadSitemap: (() => void) | undefined;
  onTogglePrompt: () => void;
  onExportJSON: () => void;
  onSelectAudit: (auditId: string) => void;
  showPrompt: boolean;
}

const AuditResultHeader: React.FC<AuditResultHeaderProps> = ({
  url,
  auditData,
  recommendations,
  historyData,
  taskId,
  onRefresh,
  onDeepScan,
  isRefreshing,
  onDownloadSitemap,
  onTogglePrompt,
  onExportJSON,
  onSelectAudit,
  showPrompt
}) => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <AuditHeader 
        onRefresh={onRefresh}
        onDeepScan={onDeepScan}
        isRefreshing={isRefreshing}
        onDownloadSitemap={onDownloadSitemap}
        onTogglePrompt={onTogglePrompt}
        onExportJSON={onExportJSON}
        showPrompt={showPrompt}
      />
      
      <div className="space-y-6 mt-4">
        <AuditMain 
          url={url}
          auditData={auditData}
          recommendations={recommendations}
          historyData={historyData}
          taskId={taskId}
          onSelectAudit={onSelectAudit}
        />
        
        {auditData.issues && (
          <div className="neo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Сводка проблем</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IssuesSummary 
                issues={{
                  critical: auditData.issues.critical.length,
                  important: auditData.issues.important.length,
                  opportunities: auditData.issues.opportunities.length
                }} 
              />
              
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Оценка сайта</h3>
                <p className="text-sm mb-2">Общий SEO-скор вашего сайта: <strong>{auditData.score}/100</strong></p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className={`h-4 rounded-full ${auditData.score >= 70 ? 'bg-green-500' : auditData.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${auditData.score}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {auditData.score >= 70 
                    ? 'Хороший результат! Ваш сайт соответствует большинству рекомендаций SEO.' 
                    : auditData.score >= 50 
                      ? 'Средний результат. Есть пространство для улучшений.' 
                      : 'Требуется значительная оптимизация для улучшения SEO показателей.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuditResultHeader;

// Импортируем необходимые компоненты
import AuditHeader from './AuditHeader';
import AuditMain from './AuditMain';
import IssuesSummary from '@/components/audit/summary/IssuesSummary';
