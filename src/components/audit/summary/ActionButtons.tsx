
import React from 'react';
import { FileText, Share, ExternalLink, Download, FileJson } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateAuditPdf } from '@/utils/pdf/auditPdf';
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
        await generateAuditPdf({ auditData, url });
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
        description: "Произошла ошибка при создании PDF. Пожалуйста, попробуйте еще раз.",
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
          description: "Не удалось создать JSON - недостаточно данных",
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
    <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 justify-center md:justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        className="hover-lift flex items-center gap-2"
        onClick={handleDownloadPDF}
      >
        <FileText className="h-4 w-4" />
        Скачать отчет
      </Button>
      
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
      
      <Button 
        variant="outline" 
        size="sm" 
        className="hover-lift flex items-center gap-2"
        onClick={handleExportJSON}
      >
        <FileJson className="h-4 w-4" />
        Экспорт JSON
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="hover-lift flex items-center gap-2"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Ссылка скопирована",
            description: "Ссылка на аудит скопирована в буфер обмена",
          });
        }}
      >
        <Share className="h-4 w-4" />
        Поделиться
      </Button>
      
      <Button 
        size="sm" 
        className="hover-lift flex items-center gap-2"
        onClick={() => window.open(`https://www.google.com/search?q=site:${url}`, '_blank')}
      >
        <ExternalLink className="h-4 w-4" />
        Анализировать в Google
      </Button>
    </div>
  );
};

export default ActionButtons;
