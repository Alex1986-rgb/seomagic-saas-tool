import { useToast } from "@/hooks/use-toast";
import { AuditData } from '@/types/audit';
import { generatePdfReport } from '@/utils/pdfExport';
import { OptimizationItem } from '../components/optimization';

export const usePdfReport = () => {
  const { toast } = useToast();

  const generatePdfReportFile = async (options: {
    auditData: AuditData | null;
    url: string;
    pageStats?: any;
    optimizationCost?: number;
    optimizationItems?: OptimizationItem[];
    recommendations?: any;
  }) => {
    const { auditData, url, pageStats, optimizationCost, optimizationItems, recommendations } = options;
    
    if (!auditData || !url) {
      toast({
        title: "Недостаточно данных",
        description: "Необходимо завершить аудит сайта",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Создание PDF отчета",
      description: "Пожалуйста, подождите...",
    });
    
    try {
      const pdfBlob = await generatePdfReport({
        auditData,
        url,
        recommendations: recommendations || undefined,
        pageStats,
        optimizationCost,
        optimizationItems,
        date: new Date().toISOString()
      });
      
      if (!pdfBlob) throw new Error("Не удалось создать PDF");
      
      let hostname;
      try {
        hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      } catch (error) {
        hostname = url.replace(/[^a-zA-Z0-9]/g, '_');
      }
      
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `seo_audit_${hostname}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Готово!",
        description: "PDF отчет успешно создан и скачан",
      });
    } catch (error) {
      console.error('Ошибка при создании PDF отчета:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF отчет",
        variant: "destructive",
      });
    }
  };

  return { generatePdfReportFile };
};
