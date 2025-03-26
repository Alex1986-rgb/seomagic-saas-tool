import React, { useState } from 'react';
import { FileText, Download, FileJson, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuditData, AuditHistoryItem } from '@/types/audit';
import { generateAuditPDF } from '@/utils/pdf/auditPdf';
import { generateHistoryPDF } from '@/utils/pdf/historyPdf';

interface ExportDropdownProps {
  auditData?: AuditData;
  url?: string;
  historyItems?: AuditHistoryItem[];
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ 
  auditData, 
  url = window.location.href,
  historyItems 
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    
    try {
      if (auditData && url) {
        await generateAuditPDF(auditData, url);
        toast({
          title: "Отчёт сохранён",
          description: "PDF-отчёт успешно сохранён на ваше устройство",
        });
      } else {
        toast({
          title: "Ошибка экспорта",
          description: "Не удалось создать PDF - недостаточно данных",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportHistoryPDF = async () => {
    setIsExporting(true);
    
    try {
      if (historyItems && historyItems.length > 0 && url) {
        // Find chart container if it exists
        const chartContainer = document.querySelector('.history-chart-container');
        await generateHistoryPDF(
          historyItems, 
          url, 
          chartContainer as HTMLElement || undefined
        );
        toast({
          title: "Отчёт сохранён",
          description: "PDF с историей аудитов успешно сохранён",
        });
      } else {
        toast({
          title: "Ошибка экспорта",
          description: "Не удалось создать PDF - недостаточно данных истории",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating history PDF:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании PDF истории",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportJSON = () => {
    setIsExporting(true);
    
    try {
      if (auditData) {
        const dataStr = JSON.stringify(auditData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportName = `audit_${auditData.id || new Date().getTime()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
        
        toast({
          title: "Данные экспортированы",
          description: "JSON-файл с данными аудита успешно сохранён",
        });
      } else {
        toast({
          title: "Ошибка экспорта",
          description: "Не удалось создать JSON - недостаточно данных",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте JSON",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="flex items-center gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span>Экспортировать</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg">
        <DropdownMenuLabel>Варианты экспорта</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleDownloadPDF} 
          className="cursor-pointer flex items-center"
          disabled={isExporting || !auditData}
        >
          <FileText className="h-4 w-4 mr-2 text-primary" />
          Скачать отчет аудита (PDF)
        </DropdownMenuItem>
        {historyItems && historyItems.length > 1 && (
          <DropdownMenuItem 
            onClick={handleExportHistoryPDF} 
            className="cursor-pointer flex items-center"
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2 text-primary" />
            Скачать историю аудитов (PDF)
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleExportJSON} 
          className="cursor-pointer flex items-center"
          disabled={isExporting || !auditData}
        >
          <FileJson className="h-4 w-4 mr-2 text-primary" />
          Экспортировать как JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdown;
