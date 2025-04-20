
import React, { useState } from 'react';
import { useContentExtractor } from '../hooks/useContentExtractor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Download, FileJson, FileText, Globe, Loader2 } from 'lucide-react';
import ContentAnalysisResults from './ContentAnalysisResults';

interface ContentExtractorDialogProps {
  open: boolean;
  onClose: () => void;
  urls: string[];
  domain: string;
}

export const ContentExtractorDialog: React.FC<ContentExtractorDialogProps> = ({
  open,
  onClose,
  urls,
  domain
}) => {
  const [activeTab, setActiveTab] = useState('progress');
  const { isExtracting, extractedSite, progress, extractContent, exportContent } = useContentExtractor();

  // Начать извлечение контента при открытии диалога
  React.useEffect(() => {
    if (open && urls.length > 0 && !extractedSite && !isExtracting) {
      startExtraction();
    }
  }, [open, urls, extractedSite, isExtracting]);

  // Обработчик для запуска извлечения контента
  const startExtraction = async () => {
    try {
      await extractContent(urls, domain);
      setActiveTab('results');
    } catch (error) {
      console.error('Ошибка извлечения контента:', error);
    }
  };

  // Обработчик для экспорта контента
  const handleExport = (format: 'json' | 'html' | 'markdown' | 'sitemap' | 'all') => {
    exportContent(format);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Анализ контента сайта</DialogTitle>
          <DialogDescription>
            Профессиональный анализ и извлечение контента с {urls.length} страниц
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="progress" disabled={!isExtracting && extractedSite}>
              Прогресс
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!extractedSite}>
              Результаты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="py-4">
            {isExtracting ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Обработано {progress.completed} из {progress.total} страниц</span>
                  <span>{Math.round((progress.completed / progress.total) * 100)}%</span>
                </div>
                <Progress value={(progress.completed / progress.total) * 100} />
                
                {progress.currentUrl && (
                  <div className="text-sm text-muted-foreground break-all">
                    Обрабатывается: {progress.currentUrl}
                  </div>
                )}
                
                <div className="bg-muted/20 p-4 rounded-md text-sm">
                  <p className="font-medium mb-2">Что происходит:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Извлечение HTML-кода каждой страницы</li>
                    <li>Анализ метатегов, заголовков и ссылок</li>
                    <li>Оценка качества и уникальности контента</li>
                    <li>Создание структурированного отчета</li>
                  </ul>
                </div>
              </div>
            ) : progress.isComplete ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Извлечение завершено!</h3>
                <p className="text-muted-foreground mb-4">
                  Обработано {progress.completed} страниц. Перейдите во вкладку Результаты для просмотра анализа.
                </p>
                <Button onClick={() => setActiveTab('results')}>
                  Посмотреть результаты
                </Button>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Подготовка</h3>
                <p className="text-muted-foreground mb-4">
                  Инициализация анализа для {urls.length} URL. Пожалуйста, подождите...
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="py-4">
            {extractedSite ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                    <FileJson className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('html')}>
                    <FileText className="h-4 w-4 mr-2" />
                    HTML
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('markdown')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Markdown
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport('sitemap')}>
                    <Globe className="h-4 w-4 mr-2" />
                    Sitemap XML
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handleExport('all')}>
                    <Download className="h-4 w-4 mr-2" />
                    Скачать всё
                  </Button>
                </div>
                
                <ContentAnalysisResults site={extractedSite} />
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Нет данных для отображения. Сначала извлеките контент.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
