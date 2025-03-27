
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { 
  ExportPDF, 
  ExportJSON, 
  ExportHistory, 
  ExportHistoryPDF,
  ExportHTML,
  ExportSitemap,
  ExportErrorReport
} from './export-actions';

interface ExportDropdownProps {
  auditData?: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
  urls?: string[];
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  auditData, 
  url,
  historyItems,
  urls
}) => {
  const [isExporting, setIsExporting] = React.useState<string | null>(null);
  
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
        />
        
        <ExportErrorReport
          auditData={auditData}
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
        />
        
        <ExportHTML
          auditData={auditData}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />
        
        <ExportSitemap
          auditData={auditData}
          url={url}
          urls={urls}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>История аудита</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ExportHistory
          historyItems={historyItems}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />
        
        <ExportHistoryPDF
          historyItems={historyItems}
          url={url}
          isExporting={isExporting}
          setIsExporting={setIsExporting}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
