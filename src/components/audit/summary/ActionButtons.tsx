
import React from 'react';
import { FileText, Share, ExternalLink, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateAuditPDF } from '@/utils/pdfExport';

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
      console.error('Error generating PDF:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании PDF",
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
        Скачать PDF
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
