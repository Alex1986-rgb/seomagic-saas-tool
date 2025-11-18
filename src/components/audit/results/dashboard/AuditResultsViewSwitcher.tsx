import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, FileText, List } from 'lucide-react';
import { AuditData } from '@/types/audit';
import AuditResultsDashboard from './AuditResultsDashboard';
import { ViewMode } from './types';

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
        <div className="text-center py-12 text-muted-foreground">
          Список проблем - в разработке
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AuditResultsViewSwitcher;
