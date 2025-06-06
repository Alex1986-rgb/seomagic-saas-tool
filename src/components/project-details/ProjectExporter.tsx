
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Code, 
  FileJson,
  Loader2,
  Globe,
  Archive,
  Search,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Server
} from 'lucide-react';
import { toast } from 'sonner';

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  module: string;
}

const ProjectExporter: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([
    {
      id: 'crawl',
      name: 'Сканирование сайта',
      description: 'Рекурсивный обход всех страниц и ресурсов',
      status: 'pending',
      progress: 0,
      module: 'crawler.py'
    },
    {
      id: 'analyze',
      name: 'SEO анализ',
      description: 'Анализ тегов, alt атрибутов, адаптивности',
      status: 'pending',
      progress: 0,
      module: 'seo_analyzer.py'
    },
    {
      id: 'optimize',
      name: 'Оптимизация с ИИ',
      description: 'Генерация улучшенного контента через OpenAI',
      status: 'pending',
      progress: 0,
      module: 'openai_optimizer.py'
    },
    {
      id: 'fix',
      name: 'Исправление HTML',
      description: 'Применение всех SEO оптимизаций к HTML',
      status: 'pending',
      progress: 0,
      module: 'html_processor.py'
    },
    {
      id: 'package',
      name: 'Упаковка сайта',
      description: 'Создание архива оптимизированной версии',
      status: 'pending',
      progress: 0,
      module: 'site_packager.py'
    }
  ]);

  const [exportResults, setExportResults] = useState<{
    sitemap: boolean;
    report: boolean;
    optimized_site: boolean;
    published_url?: string;
  }>({
    sitemap: false,
    report: false,
    optimized_site: false
  });

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    setOverallProgress(0);
    
    try {
      for (let i = 0; i < processingStages.length; i++) {
        // Update current stage to processing
        setCurrentStage(i);
        setProcessingStages(prev => prev.map((stage, index) => 
          index === i ? { ...stage, status: 'processing' } : stage
        ));

        // Simulate processing with progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setProcessingStages(prev => prev.map((stage, index) => 
            index === i ? { ...stage, progress } : stage
          ));
          setOverallProgress((i * 100 + progress) / processingStages.length);
        }

        // Mark stage as completed
        setProcessingStages(prev => prev.map((stage, index) => 
          index === i ? { ...stage, status: 'completed', progress: 100 } : stage
        ));
      }

      // Set export results
      setExportResults({
        sitemap: true,
        report: true,
        optimized_site: true,
        published_url: 'https://optimized.seomarket.beget.tech'
      });

      toast.success('Продакшн версия сайта готова! Все модули выполнены успешно.');
    } catch (error) {
      toast.error('Ошибка при создании продакшн версии');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadOptions = [
    {
      key: 'sitemap',
      title: 'Sitemap',
      description: 'sitemap.xml + site-map.html',
      icon: Globe,
      color: 'text-blue-600',
      module: 'sitemap.py'
    },
    {
      key: 'report',
      title: 'SEO отчет',
      description: 'Полный PDF анализ и estimate.pdf',
      icon: FileText,
      color: 'text-red-600',
      module: 'report_generator.py'
    },
    {
      key: 'optimized_site',
      title: 'Оптимизированный сайт',
      description: 'ZIP архив с исправленными HTML',
      icon: Archive,
      color: 'text-green-600',
      module: 'site_packager.py'
    },
    {
      key: 'positions',
      title: 'Данные позиций',
      description: 'JSON с позициями в поисковиках',
      icon: FileJson,
      color: 'text-purple-600',
      module: 'positions_checker.py'
    }
  ];

  const handleDownload = (format: string) => {
    // Simulate download
    toast.success(`${format} загружен`);
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Создание продакшн версии сайта
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isProcessing && overallProgress === 0 ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <h4 className="font-semibold mb-2">🚀 Что произойдет:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Полное сканирование и анализ сайта</li>
                  <li>• Оптимизация контента через OpenAI</li>
                  <li>• Исправление всех HTML параметров</li>
                  <li>• Создание готовой к продакшн версии</li>
                  <li>• Генерация отчетов и карты сайта</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleStartProcessing}
                className="w-full"
                size="lg"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Запустить создание продакшн версии
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Общий прогресс</span>
                  <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="space-y-3">
                {processingStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getStageIcon(stage.status)}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{stage.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {stage.module}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                      {stage.status === 'processing' && (
                        <Progress value={stage.progress} className="h-1 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {overallProgress === 100 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-800 dark:text-green-400">
                      Продакшн версия готова!
                    </h4>
                  </div>
                  
                  {exportResults.published_url && (
                    <div className="mb-4">
                      <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                        Сайт опубликован на:
                      </p>
                      <a 
                        href={exportResults.published_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                      >
                        {exportResults.published_url}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {downloadOptions.map((option) => {
                      const IconComponent = option.icon;
                      const isAvailable = exportResults[option.key as keyof typeof exportResults];
                      
                      return (
                        <Button
                          key={option.key}
                          variant="outline"
                          className="h-auto flex-col gap-2 p-4"
                          onClick={() => handleDownload(option.title)}
                          disabled={!isAvailable}
                        >
                          <IconComponent className={`h-6 w-6 ${option.color}`} />
                          <div className="text-center">
                            <div className="font-medium text-xs">{option.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                            </div>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {option.module}
                            </Badge>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {overallProgress === 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Дополнительные действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Пинг поисковых систем (pinger.py)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Globe className="mr-2 h-4 w-4" />
              Проверить позиции в поиске (positions_checker.py)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Сгенерировать новый отчет
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectExporter;
