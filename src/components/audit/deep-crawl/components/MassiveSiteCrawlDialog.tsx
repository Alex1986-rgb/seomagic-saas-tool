
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileJson, FileText, Globe, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useMassiveSiteCrawl } from '../hooks/useMassiveSiteCrawl';
import { MassiveSiteCrawlProgress } from './MassiveSiteCrawlProgress';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface MassiveSiteCrawlDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
}

export const MassiveSiteCrawlDialog: React.FC<MassiveSiteCrawlDialogProps> = ({
  open,
  onClose,
  url
}) => {
  const [activeTab, setActiveTab] = useState('progress');
  const [optimizationPrompt, setOptimizationPrompt] = useState('');
  
  const {
    isScanning,
    crawlProgress,
    result,
    error,
    startCrawl,
    cancelCrawl,
    downloadSitemap,
    downloadReport,
    createOptimizedSite
  } = useMassiveSiteCrawl();
  
  // Начать сканирование при открытии диалога
  useEffect(() => {
    if (open && url && !isScanning && !result) {
      startCrawl(url, 1500000); // максимальное количество страниц - 1.5 миллиона
    }
  }, [open, url, isScanning, result, startCrawl]);
  
  // Переключаемся на вкладку с результатами, когда сканирование завершено
  useEffect(() => {
    if (crawlProgress.processingStage === 'completed' && activeTab === 'progress') {
      setActiveTab('results');
    }
  }, [crawlProgress.processingStage, activeTab]);
  
  const handleClose = () => {
    if (isScanning) {
      if (window.confirm('Вы уверены, что хотите прервать сканирование?')) {
        cancelCrawl();
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  const handleOptimize = () => {
    createOptimizedSite(optimizationPrompt);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Профессиональный аудит крупного сайта
            <Badge variant={crawlProgress.processingStage === 'completed' ? 'secondary' : 'default'}>
              {crawlProgress.processingStage === 'completed' ? 'Завершено' : 'В процессе'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {url} <span className="text-xs opacity-70">| Поддержка до 15,000,000 страниц</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger 
              value="progress" 
              disabled={crawlProgress.processingStage === 'completed' && result !== null}
            >
              Прогресс сканирования
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={crawlProgress.processingStage !== 'completed' || result === null}
            >
              Результаты аудита
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="py-4">
            <MassiveSiteCrawlProgress 
              pagesScanned={crawlProgress.pagesScanned}
              totalEstimated={crawlProgress.totalEstimated}
              currentUrl={crawlProgress.currentUrl}
              processingStage={crawlProgress.processingStage}
              percentage={crawlProgress.percentage}
              batchNumber={crawlProgress.batchNumber}
              totalBatches={crawlProgress.totalBatches}
              error={error}
            />
          </TabsContent>

          <TabsContent value="results" className="py-4">
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Общая информация</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Просканировано страниц:</span>
                        <span className="font-medium">{result.pageCount.toLocaleString('ru-RU')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Оценка SEO:</span>
                        <span className="font-medium">{result.analysisResults?.optimizationScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Время оптимизации:</span>
                        <span className="font-medium">{result.analysisResults?.estimatedOptimizationTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Ключевые рекомендации</h3>
                    <ul className="space-y-1 text-sm">
                      {result.analysisResults?.improvementAreas.map((area: string, index: number) => (
                        <li key={index} className="flex items-start gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={downloadSitemap}>
                    <FileText className="h-4 w-4 mr-2" />
                    Скачать Sitemap
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <FileJson className="h-4 w-4 mr-2" />
                    Скачать отчет аудита
                  </Button>
                </div>
                
                <div className="mt-6 p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Оптимизация сайта с помощью ИИ</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="optimization-prompt">Направление оптимизации</Label>
                      <Textarea 
                        id="optimization-prompt" 
                        placeholder="Опишите ваши цели по оптимизации сайта, например: улучшить конверсию, ускорить загрузку, повысить видимость в поиске..."
                        value={optimizationPrompt}
                        onChange={(e) => setOptimizationPrompt(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Опишите целевые ключевые слова, аудиторию и цели оптимизации сайта.
                      </p>
                    </div>
                    <Button 
                      onClick={handleOptimize} 
                      disabled={!optimizationPrompt.trim()}
                      className="w-full"
                    >
                      Оптимизировать сайт
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Сканирование еще не завершено. Пожалуйста, дождитесь окончания процесса.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isScanning ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelCrawl}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Отменить сканирование
            </Button>
          ) : (
            <Button onClick={handleClose} variant="default" size="sm">
              Закрыть
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MassiveSiteCrawlDialog;
