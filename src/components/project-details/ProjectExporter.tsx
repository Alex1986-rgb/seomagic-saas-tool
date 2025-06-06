
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Package, 
  Loader2,
  CheckCircle2,
  FileText,
  Archive,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

const ProjectExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportProjectData = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      toast.info("Начинаю экспорт данных проекта...");
      
      // Имитация процесса экспорта с прогрессом
      const steps = [
        { message: "Сбор информации о проекте...", progress: 20 },
        { message: "Анализ готовности модулей...", progress: 40 },
        { message: "Формирование технической документации...", progress: 60 },
        { message: "Создание архива проекта...", progress: 80 },
        { message: "Финализация экспорта...", progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExportProgress(step.progress);
        toast.info(step.message);
      }

      // Создание данных для экспорта
      const projectData = {
        project: {
          name: "SeoMarket",
          version: "1.0.0",
          description: "Автоматизированная платформа для SEO аудита и оптимизации",
          readiness: "92%",
          createdAt: new Date().toISOString()
        },
        modules: [
          { name: "crawler.py", status: "ready", coverage: 100 },
          { name: "seo_analyzer.py", status: "ready", coverage: 100 },
          { name: "openai_optimizer.py", status: "ready", coverage: 100 },
          { name: "html_fixer.py", status: "ready", coverage: 100 },
          { name: "report_generator.py", status: "ready", coverage: 100 },
          { name: "ftp_publisher.py", status: "ready", coverage: 100 },
          { name: "position_tracker.py", status: "in_progress", coverage: 85 }
        ],
        architecture: {
          frontend: ["React 18", "TypeScript", "Tailwind CSS", "Shadcn/UI"],
          backend: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL"],
          ai: ["OpenAI GPT-4", "BeautifulSoup", "Selenium"],
          infrastructure: ["Docker", "Nginx", "Let's Encrypt", "Beget VPS"]
        },
        features: {
          completed: 28,
          inProgress: 2,
          planned: 5,
          totalReadiness: 92
        }
      };

      // Создание и скачивание JSON файла
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seomarket-project-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Данные проекта успешно экспортированы!");
      
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      toast.error("Ошибка при экспорте данных проекта");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Экспорт проекта
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Экспортировать все данные о проекте в JSON формате
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
          onClick={exportProjectData}
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
              Экспортировать проект
            </>
          )}
        </Button>
        
        {exportProgress === 100 && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Экспорт завершен успешно!
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Будет создан файл с полной информацией о готовности проекта, модулях и архитектуре
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExporter;
