
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validationService } from '@/services/validation/validationService';

/**
 * Hook for optimization functionality
 * This is a placeholder that will be implemented later
 */
export const useOptimization = (url: string) => {
  const { toast } = useToast();
  const [optimizationCost, setOptimizationCost] = useState<number>(0);
  const [optimizationItems, setOptimizationItems] = useState<any[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [pagesContent, setPagesContent] = useState<any[]>([]);

  const downloadOptimizedSite = async (): Promise<void> => {
    console.log(`Downloading optimized site from optimization hook for ${url}`);
    return Promise.resolve();
  };

  const generatePdfReportFile = async (taskId?: string) => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Нет ID задачи для скачивания отчета",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // Проверяем готовность PDF в таблице pdf_reports
      const { data: pdfReport, error: checkError } = await supabase
        .from('pdf_reports')
        .select('file_path, created_at')
        .eq('task_id', taskId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking PDF report:', checkError);
        throw new Error('Не удалось проверить статус отчета');
      }
      
      if (!pdfReport?.file_path) {
        toast({
          title: "Отчет генерируется",
          description: "PDF отчет еще не готов. Попробуйте через несколько секунд.",
        });
        return false;
      }
      
      // Скачиваем PDF из Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pdf-reports')
        .download(pdfReport.file_path);
      
      if (downloadError || !fileData) {
        console.error('Error downloading PDF:', downloadError);
        throw new Error('Не удалось скачать PDF отчет');
      }
      
      // Создаем blob и скачиваем файл
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `seo-audit-${validationService.extractDomain(url)}-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      // Инкрементируем счетчик скачиваний
      await supabase.rpc('increment_pdf_download_count', { 
        report_task_id: taskId 
      });
      
      toast({
        title: "Готово",
        description: "PDF отчет успешно скачан",
      });
      
      return true;
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось скачать отчет",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    optimizationCost,
    optimizationItems,
    isOptimized,
    downloadOptimizedSite,
    generatePdfReportFile,
    setOptimizationCost,
    setOptimizationItems,
    setPagesContent
  };
};
