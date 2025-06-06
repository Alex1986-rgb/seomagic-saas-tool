
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  FileText, 
  Globe, 
  Loader2,
  CheckCircle2,
  Package,
  Code,
  Image
} from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportOptions {
  includeImages: boolean;
  includeButtons: boolean;
  format: 'pdf' | 'html' | 'png';
  quality: 'high' | 'medium' | 'low';
}

const PageExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeImages: true,
    includeButtons: true,
    format: 'pdf',
    quality: 'high'
  });

  const exportPageAsPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      toast.info("Начинаю экспорт страницы...");
      
      // Находим контейнер с деталями проекта
      const element = document.querySelector('.project-details-container') as HTMLElement;
      if (!element) {
        throw new Error('Не найден контейнер для экспорта');
      }

      setExportProgress(20);
      
      // Создаем скриншот с высоким качеством
      const canvas = await html2canvas(element, {
        scale: exportOptions.quality === 'high' ? 2 : 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      setExportProgress(60);

      // Создаем PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Добавляем первую страницу
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Добавляем дополнительные страницы если нужно
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      setExportProgress(90);

      // Сохраняем файл
      pdf.save('seomarket-project-details.pdf');
      
      setExportProgress(100);
      toast.success("Страница успешно экспортирована в PDF!");
      
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      toast.error("Ошибка при экспорте страницы");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const exportPageAsHTML = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      toast.info("Создаю HTML версию страницы...");
      
      const element = document.querySelector('.project-details-container') as HTMLElement;
      if (!element) {
        throw new Error('Не найден контейнер для экспорта');
      }

      setExportProgress(30);

      // Получаем HTML содержимое
      const htmlContent = element.outerHTML;
      
      // Получаем все стили
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            return '';
          }
        })
        .join('\n');

      setExportProgress(60);

      // Создаем полный HTML документ
      const fullHTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoMarket - Детали проекта</title>
    <style>
        ${styles}
        body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
        .project-details-container { max-width: 1200px; margin: 0 auto; }
        button { cursor: pointer; }
        button:hover { opacity: 0.8; }
    </style>
    <script>
        // Добавляем интерактивность для кнопок
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    alert('Кнопка: ' + this.textContent.trim());
                });
            });
        });
    </script>
</head>
<body>
    ${htmlContent}
</body>
</html>`;

      setExportProgress(90);

      // Создаем и скачиваем файл
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'seomarket-project-details.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportProgress(100);
      toast.success("HTML версия страницы готова!");
      
    } catch (error) {
      console.error('Ошибка экспорта HTML:', error);
      toast.error("Ошибка при создании HTML версии");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const exportPageAsPNG = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      toast.info("Создаю PNG изображение страницы...");
      
      const element = document.querySelector('.project-details-container') as HTMLElement;
      if (!element) {
        throw new Error('Не найден контейнер для экспорта');
      }

      setExportProgress(40);

      const canvas = await html2canvas(element, {
        scale: exportOptions.quality === 'high' ? 2 : 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      setExportProgress(80);

      // Конвертируем в blob и скачиваем
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'seomarket-project-details.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          setExportProgress(100);
          toast.success("PNG изображение готово!");
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Ошибка экспорта PNG:', error);
      toast.error("Ошибка при создании PNG изображения");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const handleExport = () => {
    switch (exportOptions.format) {
      case 'pdf':
        exportPageAsPDF();
        break;
      case 'html':
        exportPageAsHTML();
        break;
      case 'png':
        exportPageAsPNG();
        break;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Экспорт страницы
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Формат экспорта</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'pdf', label: 'PDF', icon: FileText },
              { value: 'html', label: 'HTML', icon: Code },
              { value: 'png', label: 'PNG', icon: Image }
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={exportOptions.format === value ? "default" : "outline"}
                size="sm"
                onClick={() => setExportOptions(prev => ({ ...prev, format: value as any }))}
                className="flex flex-col gap-1 h-auto py-2"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Качество</label>
          <select 
            value={exportOptions.quality}
            onChange={(e) => setExportOptions(prev => ({ ...prev, quality: e.target.value as any }))}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="high">Высокое</option>
            <option value="medium">Среднее</option>
            <option value="low">Низкое</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exportOptions.includeImages}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeImages: e.target.checked }))}
            />
            <span className="text-sm">Включить изображения</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exportOptions.includeButtons}
              onChange={(e) => setExportOptions(prev => ({ ...prev, includeButtons: e.target.checked }))}
            />
            <span className="text-sm">Кликабельные кнопки</span>
          </label>
        </div>

        {isExporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Экспорт...</span>
              <span>{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        <Button 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Экспортирую...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Экспортировать страницу
            </>
          )}
        </Button>
        
        {exportProgress === 100 && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Экспорт завершен успешно!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PageExporter;
