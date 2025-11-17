
import React, { useState } from 'react';
import { Download, FileText, Files } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { 
  ExportPDF, 
  ExportJSON, 
  ExportHistory, 
  ExportHistoryPDF,
  ExportHTML,
  ExportSitemap,
  ExportErrorReport,
  ExportCrawledPages
} from './export-actions';
import { CrawledPagesViewer } from './viewers/CrawledPagesViewer';
import { AuditFilesViewer } from './viewers/AuditFilesViewer';

interface ExportDropdownProps {
  auditData?: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
  urls?: string[];
  taskId?: string | null;
  auditId?: string;
  optimizationItems?: OptimizationItem[];
  optimizationCost?: number;
  pageStats?: any;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  auditData, 
  url,
  historyItems,
  urls,
  taskId,
  auditId,
  optimizationItems,
  optimizationCost,
  pageStats
}) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [showCrawledPages, setShowCrawledPages] = useState(false);
  const [showGeneratedFiles, setShowGeneratedFiles] = useState(false);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Экспорт</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Форматы экспорта</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ExportPDF
          auditData={auditData}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          taskId={taskId}
          optimizationItems={optimizationItems}
          optimizationCost={optimizationCost}
          pageStats={pageStats}
        />
        
        <ExportErrorReport
          taskId={taskId || ''}
          url={url}
          urls={urls}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />
        
        <ExportJSON
          auditData={auditData}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          taskId={taskId}
        />
        
        <ExportHTML
          auditData={auditData}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          taskId={taskId}
        />
        
        <ExportSitemap
          auditData={auditData}
          url={url}
          urls={urls}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          taskId={taskId}
        />
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>История аудита</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ExportHistory
          historyItems={historyItems}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          taskId={taskId}
        />
        
        <ExportHistoryPDF
          historyItems={historyItems}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
          taskId={taskId}
        />
        
        {auditId && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Собранные данные</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setShowCrawledPages(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Просмотр HTML страниц
            </DropdownMenuItem>
            
            <ExportCrawledPages
              auditId={auditId}
              isExporting={isExporting}
              setIsExporting={setIsExporting}
            />
            
            <DropdownMenuItem onClick={() => setShowGeneratedFiles(true)}>
              <Files className="mr-2 h-4 w-4" />
              Сгенерированные файлы
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
      
      {auditId && (
        <>
          <Dialog open={showCrawledPages} onOpenChange={setShowCrawledPages}>
            <DialogContent className="max-w-5xl">
              <CrawledPagesViewer auditId={auditId} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showGeneratedFiles} onOpenChange={setShowGeneratedFiles}>
            <DialogContent className="max-w-4xl">
              <AuditFilesViewer auditId={auditId} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </DropdownMenu>
  );
};

export default ExportDropdown;
