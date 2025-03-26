
import React, { useState, useRef } from 'react';
import { Share2, Copy, Mail, Download, FileJson, Loader2, FilePdf } from 'lucide-react';
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
import { motion } from 'framer-motion';
import { generateAuditPDF, generateHistoryPDF } from '@/utils/pdfExport';
import { AuditData, AuditHistoryItem } from '@/types/audit';

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
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на результаты аудита скопирована в буфер обмена",
    });
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent("Результаты SEO аудита");
    const body = encodeURIComponent(`Посмотрите результаты SEO аудита: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  
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
        const exportName = `audit_${auditId || new Date().getTime()}.json`;
        
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
    <motion.div 
      className="flex flex-col items-center gap-2 mt-8 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-muted-foreground text-sm mb-2">Поделиться результатами аудита {auditId ? `#${auditId}` : ''}</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleCopyLink}
        >
          <Copy className="h-4 w-4" />
          <span>Копировать ссылку</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleEmailShare}
        >
          <Mail className="h-4 w-4" />
          <span>Отправить на почту</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FilePdf className="h-4 w-4" />
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
              <FilePdf className="h-4 w-4 mr-2 text-primary" />
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
      </div>
    </motion.div>
  );
};

export default AuditShareResults;
