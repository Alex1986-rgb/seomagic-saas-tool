
import React from 'react';
import { FileDown, FileText, History, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { usePdfReport } from '../results/hooks/usePdfReport';
import { useToast } from "@/hooks/use-toast";

interface ExportDropdownProps {
  auditData?: AuditData;
  url: string;
  historyItems?: AuditHistoryItem[];
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  auditData, 
  url,
  historyItems
}) => {
  const { generatePdfReportFile, generateHistoryReportFile } = usePdfReport();
  const { toast } = useToast();
  
  const handleExportAudit = async () => {
    if (!auditData) {
      toast({
        title: "Ошибка экспорта",
        description: "Нет данных для экспорта",
        variant: "destructive"
      });
      return;
    }
    
    await generatePdfReportFile({ auditData, url });
  };
  
  const handleExportHistory = async () => {
    if (!historyItems || historyItems.length === 0) {
      toast({
        title: "Ошибка экспорта",
        description: "История аудитов отсутствует",
        variant: "destructive"
      });
      return;
    }
    
    await generateHistoryReportFile(historyItems, url);
  };
  
  const handleExportJson = () => {
    try {
      if (auditData) {
        const dataStr = JSON.stringify(auditData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        
        let hostname;
        try {
          hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        } catch (error) {
          hostname = url.replace(/[^a-zA-Z0-9]/g, '_');
        }
        
        const exportName = `seo_audit_${hostname}_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        toast({
          title: "Данные экспортированы",
          description: "JSON-файл с данными аудита успешно сохранён",
        });
      } else {
        toast({
          title: "Ошибка экспорта",
          description: "Нет данных для экспорта",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Ошибка экспорта JSON:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте JSON. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          <span>Экспорт отчета</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Формат отчета</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportAudit} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>PDF-отчет текущего аудита</span>
        </DropdownMenuItem>
        {historyItems && historyItems.length > 1 && (
          <DropdownMenuItem onClick={handleExportHistory} className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>PDF-отчет по истории</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleExportJson} className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span>Экспорт данных в JSON</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
