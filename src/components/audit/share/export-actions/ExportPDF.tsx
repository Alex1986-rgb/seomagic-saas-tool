import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { generateAuditPdf } from '@/utils/pdf/auditPdf';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { seoApiService } from '@/api/seoApiService';
import { PdfPreviewDialog } from '../pdf-preview';
import { usePdfLocalStorage } from '@/hooks/usePdfLocalStorage';
import { supabase } from '@/integrations/supabase/client';
import { getHistoricalTrends, compareWithPrevious } from '@/services/audit/historyService';

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
  const [showPreview, setShowPreview] = useState(false);
  const { savePdfMetadata } = usePdfLocalStorage();
  
  const handleGeneratePDF = async (selectedSections: string[]) => {
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
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setProgress('Создание графиков и диаграмм...');
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setProgress('Формирование разделов отчета...');
        
        // Fetch historical and comparison data
        let historicalData, comparisonData;
        try {
          historicalData = await getHistoricalTrends(url, 10);
          if (auditData.id) {
            comparisonData = await compareWithPrevious(auditData.id);
          }
        } catch (error) {
          console.log('Could not fetch historical data:', error);
        }
        
        const pdfBlob = await generateAuditPdf({ 
          auditData, 
          url,
          optimizationCost,
          optimizationItems,
          pageStats,
          date: new Date().toISOString(),
          historicalData,
          comparisonData
        });
        
        setProgress('Сохранение файла...');
        
        // Save to database if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          try {
            // Upload PDF to storage
            const fileName = `${user.id}/${hostname}_${new Date().toISOString().split('T')[0]}.pdf`;
            const { error: uploadError } = await supabase.storage
              .from('pdf-reports')
              .upload(fileName, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true
              });
            
            if (!uploadError) {
              // Save metadata to database
              await supabase.from('pdf_reports').insert({
                user_id: user.id,
                url,
                task_id: taskId || null,
                report_title: 'SEO Аудит сайта',
                company_name: hostname,
                file_path: fileName,
                file_size: pdfBlob.size,
                sections_included: selectedSections
              });
              
              savePdfMetadata({
                url,
                taskId: taskId || '',
                reportTitle: 'SEO Аудит сайта',
                companyName: hostname,
                sectionsIncluded: selectedSections,
                fileSize: pdfBlob.size
              });
            }
          } catch (error) {
            console.error('Error saving PDF to database:', error);
          }
        }
        
        // Trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `${hostname}_audit_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
        
        setProgress('Готово!');
        
        toast({
          title: "PDF сохранен",
          description: `PDF-отчет успешно сохранен (${selectedSections.length} секций)`,
        });
      }
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast({
        title: "Ошибка экспорта",
        description: error instanceof Error ? error.message : "Не удалось экспортировать в PDF",
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
        onClick={() => setShowPreview(true)}
        disabled={isExporting === 'pdf' || !auditData}
      >
        {isExporting === 'pdf' ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>{progress}</span>
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            <span>Экспорт PDF</span>
          </>
        )}
      </DropdownMenuItem>

      <PdfPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        auditData={auditData || null}
        onGenerate={handleGeneratePDF}
      />
    </>
  );
};

export default ExportPDF;
