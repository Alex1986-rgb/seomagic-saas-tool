import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText, List } from 'lucide-react';
import { AuditData } from '@/types/audit';
import AuditResultsDashboard from './AuditResultsDashboard';
import TopIssuesPanel from './TopIssuesPanel';
import { ViewMode, IssueItem } from './types';

interface AuditResultsViewSwitcherProps {
  auditData: AuditData;
  defaultMode?: ViewMode;
  onExportPDF: () => void;
  onExportJSON: () => void;
  onShare: () => void;
  auditResults?: any;
  taskMetrics?: any;
  pageAnalysis?: any[];
  taskId?: string;
}

const AuditResultsViewSwitcher: React.FC<AuditResultsViewSwitcherProps> = ({
  auditData,
  defaultMode = 'dashboard',
  onExportPDF,
  onExportJSON,
  onShare,
  auditResults,
  taskMetrics,
  pageAnalysis,
  taskId
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);

  const allIssues: IssueItem[] = useMemo(() => {
    const issues: IssueItem[] = [];
    if (auditData?.details) {
      Object.entries(auditData.details).forEach(([category, categoryData]) => {
        if (categoryData?.items) {
          categoryData.items.forEach((item) => {
            issues.push({
              id: `${category}-${item.id}`,
              title: item.title,
              description: item.description,
              severity: item.status,
              category,
              affectedPages: item.affectedUrls || [],
              solution: item.solution,
            });
          });
        }
      });
    }
    return issues;
  }, [auditData]);

  return (
    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="dashboard">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Интерактивная панель
        </TabsTrigger>
        <TabsTrigger value="pdf-preview">
          <FileText className="mr-2 h-4 w-4" />
          Предпросмотр PDF
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="mr-2 h-4 w-4" />
          Список проблем
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <AuditResultsDashboard
          auditData={auditData}
          auditResults={auditResults}
          taskMetrics={taskMetrics}
          pageAnalysis={pageAnalysis}
          taskId={taskId}
          onExportPDF={onExportPDF}
          onExportJSON={onExportJSON}
          onShare={onShare}
        />
      </TabsContent>

      <TabsContent value="pdf-preview">
        <div className="text-center py-12 text-muted-foreground">
          PDF предпросмотр будет доступен после генерации отчета
        </div>
      </TabsContent>

      <TabsContent value="list">
        {allIssues.length > 0 ? (
          <TopIssuesPanel issues={allIssues} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Проблемы не обнаружены или данные ещё не готовы
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AuditResultsViewSwitcher;
