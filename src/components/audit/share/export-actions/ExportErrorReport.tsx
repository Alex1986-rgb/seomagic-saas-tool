
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { generateErrorReportPdf } from '@/utils/pdf/errorReport';
import { downloadReport } from '@/services/api/firecrawl/reportUtils';

interface ExportErrorReportProps {
  taskId: string;
  url: string;
  urls?: string[];
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
}

const ExportErrorReport: React.FC<ExportErrorReportProps> = ({ 
  taskId, 
  url,
  urls,
  isExporting,
  setIsExporting,
}) => {
  const { toast } = useToast();

  const handleExportErrorReport = async () => {
    setIsExporting('error-report');
    
    try {
      if (taskId) {
        // Use API endpoint for tasks with IDs
        await downloadReport({
          id: taskId,
          status: 'completed',
          url,
          domain: url.replace(/^https?:\/\//, '').split('/')[0],
          pages_scanned: 0,
          progress: 100
        }, 'errors');
        
        toast({
          title: "Отчет об ошибках скачан",
          description: "Отчет об ошибках успешно скачан",
        });
      } else {
        // Use local generation for frontend-generated reports
        // Создаем демо-данные для отчета
        const mockErrors = [
          { url: url, type: 'Ошибка 404', description: 'Страница не найдена', severity: 'high' as const },
          { url: `${url}/contact`, type: 'Meta Description', description: 'Отсутствует мета-описание', severity: 'medium' as const },
          { url: `${url}/about`, type: 'Размер изображения', description: 'Изображения не оптимизированы', severity: 'low' as const },
        ];
        
        // Если есть сканированные URL, используем их
        if (urls && urls.length > 0) {
          urls.slice(0, 5).forEach(pageUrl => {
            mockErrors.push({
              url: pageUrl,
              type: 'Проблема контента',
              description: 'Слишком мало контента на странице',
              severity: 'medium' as const
            });
          });
        }
        
        // Генерируем PDF
        const pdfBlob = await generateErrorReportPdf({
          domain: url.replace(/^https?:\/\//, '').split('/')[0],
          errors: mockErrors,
          scanDate: new Date().toISOString(),
          recommendations: [
            'Проверьте все страницы с ошибками 404 и создайте соответствующие редиректы',
            'Добавьте мета-описания ко всем страницам сайта для улучшения SEO',
            'Оптимизируйте размеры изображений для ускорения загрузки страниц'
          ],
          url: url,
          detailed: true
        });
        
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `error_report_${url.replace(/^https?:\/\//, '').replace(/[^\w]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
        
        toast({
          title: "Отчет об ошибках создан",
          description: "Отчет об ошибках успешно сохранен на ваше устройство",
        });
      }
    } catch (error) {
      console.error('Error generating error report:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании отчета об ошибках",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleExportErrorReport}
      disabled={isExporting !== null}
    >
      <AlertCircle className="mr-2 h-4 w-4" />
      <span>{isExporting === 'error-report' ? 'Создание отчета...' : 'Отчет об ошибках'}</span>
    </DropdownMenuItem>
  );
};

export default ExportErrorReport;
