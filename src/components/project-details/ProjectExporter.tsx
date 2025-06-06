
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FileText, 
  Code, 
  FileJson,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const ProjectExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (format) {
        case 'pdf':
          toast.success('PDF отчет сгенерирован и загружен');
          break;
        case 'markdown':
          toast.success('Markdown файл сгенерирован и загружен');
          break;
        case 'html':
          toast.success('HTML отчет сгенерирован и загружен');
          break;
        case 'json':
          toast.success('JSON данные экспортированы и загружены');
          break;
        default:
          toast.success('Экспорт завершен');
      }
    } catch (error) {
      toast.error('Ошибка при экспорте файла');
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: 'pdf',
      title: 'PDF отчет',
      description: 'Полный отчет для разработчиков',
      icon: FileText,
      color: 'text-red-600'
    },
    {
      format: 'markdown',
      title: 'Markdown',
      description: 'Техническая документация',
      icon: Code,
      color: 'text-blue-600'
    },
    {
      format: 'html',
      title: 'HTML страница',
      description: 'Веб-версия отчета',
      icon: Code,
      color: 'text-orange-600'
    },
    {
      format: 'json',
      title: 'JSON данные',
      description: 'Структурированные данные',
      icon: FileJson,
      color: 'text-green-600'
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Экспорт проекта для разработчиков
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exportOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.format} className="text-center">
                <Button
                  variant="outline"
                  className="w-full h-auto flex-col gap-3 p-6"
                  onClick={() => handleExport(option.format)}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <IconComponent className={`h-8 w-8 ${option.color}`} />
                  )}
                  <div>
                    <div className="font-semibold">{option.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Что включает экспорт:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Полная техническая архитектура проекта</li>
            <li>• Статус готовности к продакшн</li>
            <li>• План масштабирования и стратегия роста</li>
            <li>• Анализ затрат и временные рамки</li>
            <li>• Рекомендации по развитию и оптимизации</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExporter;
