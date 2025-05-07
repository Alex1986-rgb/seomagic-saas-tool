
import React from 'react';
import { motion } from 'framer-motion';
import { Share, RefreshCw, Download } from 'lucide-react';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditResultHeaderProps {
  url: string;
  auditData: AuditData;
  recommendations: RecommendationData;
  historyData: AuditHistoryData | null;
  taskId: string;
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
  onDownloadSitemap?: () => void;
  onTogglePrompt: () => void;
  onExportJSON: () => void;
  onSelectAudit: (id: string) => void;
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
  return (
    <div className="neo-card p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{url}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Аудит от {auditData.date}</span>
            <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
            <span>{auditData.pageCount || 0} страниц</span>
            {taskId && (
              <>
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                <span>ID: {taskId.substring(0, 8)}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button 
            className="btn-secondary btn-sm"
            onClick={onExportJSON}
          >
            <Share className="h-4 w-4 mr-1" />
            <span>Экспорт</span>
          </button>
          
          {onDownloadSitemap && (
            <button 
              className="btn-secondary btn-sm"
              onClick={onDownloadSitemap}
            >
              <Download className="h-4 w-4 mr-1" />
              <span>Sitemap</span>
            </button>
          )}
          
          <button 
            className="btn-primary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Обновление...' : 'Обновить'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="bg-secondary/20 px-3 py-1 rounded-lg text-sm">
          Общий рейтинг: <span className="font-semibold">{auditData.score}/100</span>
        </div>
        <div className="bg-secondary/20 px-3 py-1 rounded-lg text-sm">
          Кол-во критических ошибок: <span className="font-semibold text-destructive">{auditData.issues.critical.length}</span>
        </div>
        <div className="bg-secondary/20 px-3 py-1 rounded-lg text-sm">
          Кол-во важных ошибок: <span className="font-semibold text-amber-500">{auditData.issues.important.length}</span>
        </div>
        <div className="bg-secondary/20 px-3 py-1 rounded-lg text-sm">
          Возможности улучшения: <span className="font-semibold text-primary">{auditData.issues.opportunities.length}</span>
        </div>
      </div>
      
      {historyData && historyData.items && historyData.items.length > 1 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">История аудита:</h3>
          <div className="flex flex-wrap gap-2">
            {historyData.items.slice(0, 5).map((item) => (
              <button
                key={item.id}
                className="px-2 py-1 text-xs bg-muted rounded-md hover:bg-muted/80"
                onClick={() => onSelectAudit(item.id)}
              >
                {new Date(item.date).toLocaleDateString()} ({item.score})
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <button
          onClick={onDeepScan}
          className="btn-outline btn-sm"
        >
          Запустить глубокое сканирование
        </button>
        <button
          onClick={onTogglePrompt}
          className="btn-ghost btn-sm ml-2"
        >
          {showPrompt ? 'Скрыть настройки' : 'Настройки оптимизации'}
        </button>
      </div>
    </div>
  );
};

export default AuditResultHeader;
