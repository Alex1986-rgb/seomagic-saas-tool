
import React from 'react';
import { FileText, Share, ExternalLink, Download, FileJson } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateAuditPDF } from '@/utils/pdfExport';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  auditData?: any;
  url: string;
  onDownloadSitemap?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ auditData, url, onDownloadSitemap }) => {
  const { toast } = useToast();
  
  const handleDownloadPDF = async () => {
    try {
      if (auditData) {
        await generateAuditPDF(auditData, url);
        toast({
          title: "Отчёт сохранён",
          description: "PDF-отчёт успешно сохранён на ваше устройство",
        });
      } else {
        toast({
          title: "Недостаточно данных",
          description: "Для экспорта в PDF необходимы полные данные аудита",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Ошибка генерации PDF:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании PDF",
        variant: "destructive"
      });
    }
  };

  const handleExportJSON = () => {
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
      console.error('Ошибка экспорта JSON:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте JSON",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 justify-center md:justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover-lift flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Экспортировать
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg">
          <DropdownMenuLabel>Варианты экспорта</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDownloadPDF} 
            className="cursor-pointer flex items-center"
          >
            <FileText className="h-4 w-4 mr-2 text-primary" />
            Скачать отчет аудита (PDF)
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleExportJSON} 
            className="cursor-pointer flex items-center"
          >
            <FileJson className="h-4 w-4 mr-2 text-primary" />
            Экспортировать как JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {onDownloadSitemap && (
        <Button 
          variant="outline" 
          size="sm" 
          className="hover-lift flex items-center gap-2"
          onClick={onDownloadSitemap}
        >
          <Download className="h-4 w-4" />
          Скачать Sitemap
        </Button>
      )}
      
      <Button variant="outline" size="sm" className="hover-lift flex items-center gap-2">
        <Share className="h-4 w-4" />
        Поделиться
      </Button>
      
      <Button size="sm" className="hover-lift flex items-center gap-2">
        <ExternalLink className="h-4 w-4" />
        Оптимизировать сайт
      </Button>
    </div>
  );
};

export default ActionButtons;
