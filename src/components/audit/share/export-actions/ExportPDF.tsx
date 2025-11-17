
import React from 'react';
import { FileText } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { generateAuditPdf } from '@/utils/pdf/auditPdf';
import { AuditData } from '@/types/audit';
import { seoApiService } from '@/api/seoApiService';

interface ExportPDFProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
  taskId?: string | null;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ 
  auditData, 
  url, 
  isExporting, 
  setIsExporting,
  taskId
}) => {
  const { toast } = useToast();
  
  const handleExportPDF = async () => {
    setIsExporting('pdf');
    
    try {
      if (taskId) {
        // Use backend API
        await seoApiService.downloadReport(taskId);
        
        toast({
          title: "PDF сохранен",
          description: "PDF-отчет успешно сохранен",
        });
      } else if (auditData) {
        // Use frontend implementation with new PDF generator
        const pdfBlob = await generateAuditPdf({ 
          auditData, 
          url,
          date: new Date().toISOString()
        });
        
        // Create download link
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `seo-audit-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "PDF сохранен",
          description: "PDF-отчет успешно сохранен на ваше устройство",
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
        description: "Произошла ошибка при создании PDF. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleExportPDF}
      disabled={isExporting !== null}
    >
      <FileText className="mr-2 h-4 w-4" />
      <span>{isExporting === 'pdf' ? 'Экспортируется...' : 'Экспорт PDF'}</span>
    </DropdownMenuItem>
  );
};

export default ExportPDF;
