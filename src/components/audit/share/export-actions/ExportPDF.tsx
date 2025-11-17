
import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { generateAuditPdf } from '@/utils/pdf/auditPdf';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { seoApiService } from '@/api/seoApiService';
import { PdfCustomizationDialog, PdfCustomizationOptions } from '../pdf-customization';

interface ExportPDFProps {
  auditData?: AuditData;
  url: string;
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
  taskId?: string | null;
  optimizationItems?: OptimizationItem[];
  optimizationCost?: number;
  pageStats?: any;
}

const ExportPDF: React.FC<ExportPDFProps> = ({ 
  auditData, 
  url, 
  isExporting, 
  setIsExporting,
  taskId,
  optimizationItems,
  optimizationCost,
  pageStats
}) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<string>('');
  const [showCustomization, setShowCustomization] = useState(false);
  
  const handleExportPDF = async (customOptions?: PdfCustomizationOptions) => {
    setIsExporting('pdf');
    setProgress('Инициализация...');
    
    try {
      if (taskId) {
        // Use backend API
        setProgress('Загрузка отчета...');
        await seoApiService.downloadReport(taskId);
        
        toast({
          title: "PDF сохранен",
          description: "PDF-отчет успешно сохранен",
        });
      } else if (auditData) {
        // Use frontend implementation with new PDF generator
        setProgress('Подготовка данных...');
        
        // Get hostname for filename
        let hostname = 'website';
        try {
          hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        } catch (error) {
          hostname = url.replace(/[^a-zA-Z0-9]/g, '_');
        }
        
        setProgress('Генерация обложки и оглавления...');
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI update
        
        setProgress('Создание графиков и диаграмм...');
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setProgress('Формирование разделов отчета...');
        const pdfBlob = await generateAuditPdf({ 
          auditData, 
          url,
          optimizationCost,
          optimizationItems,
          pageStats,
          date: new Date().toISOString(),
          customization: customOptions
        });
        
        setProgress('Сохранение файла...');
        
        // Create download link
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `seo_audit_${hostname}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "PDF отчет готов!",
          description: `Отчет сохранен как seo_audit_${hostname}_${new Date().toISOString().split('T')[0]}.pdf`,
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
      
      // More detailed error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Неизвестная ошибка при создании PDF';
      
      toast({
        title: "Ошибка экспорта",
        description: `${errorMessage}. Пожалуйста, попробуйте еще раз.`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
      setProgress('');
    }
  };
  
  return (
    <>
      <DropdownMenuItem 
        onClick={() => setShowCustomization(true)}
        disabled={isExporting !== null}
      >
        {isExporting === 'pdf' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">{progress || 'Создание PDF...'}</span>
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            <span>Экспорт PDF</span>
          </>
        )}
      </DropdownMenuItem>

      <PdfCustomizationDialog
        open={showCustomization}
        onOpenChange={setShowCustomization}
        onConfirm={handleExportPDF}
      />
    </>
  );
};

export default ExportPDF;
