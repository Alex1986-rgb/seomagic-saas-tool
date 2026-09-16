import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileJson, FileText, X, Shield } from 'lucide-react';
import { useMassiveSiteCrawl } from '../hooks/useMassiveSiteCrawl';
import { MassiveSiteCrawlProgress } from './MassiveSiteCrawlProgress';
import { Badge } from "@/components/ui/badge";
import { ResultsFilter } from './results/ResultsFilter';

interface MassiveSiteCrawlDialogProps {
  open: boolean;
  onClose: () => void;
  url: string;
  onCrawlComplete?: (urls: string[]) => void;
}

export const MassiveSiteCrawlDialog: React.FC<MassiveSiteCrawlDialogProps> = ({
  open,
  onClose,
  url,
  onCrawlComplete
}) => {
  const [activeTab, setActiveTab] = useState('progress');
  
  const {
    isScanning,
    crawlProgress,
    result,
    error,
    startCrawl,
    cancelCrawl,
    downloadSitemap,
    downloadReport
  } = useMassiveSiteCrawl();

  // Обход запускаем один раз на открытие окна. Раньше эффект срабатывал всякий
  // раз, когда обход не шёл и результата не было: «Отменить сканирование» тут
  // же запускал его заново, а любая ошибка старта уводила в бесконечные
  // перезапуски, пока окно открыто.
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasStartedRef.current = false;
      return;
    }
    if (url && !hasStartedRef.current && !result) {
      hasStartedRef.current = true;
      void startCrawl(url);
    }
  }, [open, url, result, startCrawl]);
  
  useEffect(() => {
    if (crawlProgress.processingStage === 'completed' && activeTab === 'progress') {
      setActiveTab('results');
    }
  }, [crawlProgress.processingStage, activeTab]);
  
  const handleCancel = () => {
    cancelCrawl();
    onClose();
  };

  const handleClose = () => {
    if (isScanning) {
      if (window.confirm('Вы уверены, что хотите прервать профессиональный аудит? Это может привести к потере данных.')) {
        cancelCrawl();
        onClose();
      }
    } else {
      if (result && onCrawlComplete) {
        onCrawlComplete(result.urls || []);
      }
      onClose();
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Профессиональный аудит крупного сайта
            <Badge variant={crawlProgress.processingStage === 'completed' ? 'secondary' : 'default'}>
              {crawlProgress.processingStage === 'completed' ? 'Завершено' : 'В процессе'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {url}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Результаты</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
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

          <TabsContent value="results">
            {result && (
              <div className="space-y-6">
                <ResultsFilter 
                  onFilterChange={(filters) => {
                    console.log('Applying filters:', filters);
                    // Здесь будет логика фильтрации результатов
                  }} 
                />
                
                <div className="space-y-6">
                  {/*
                    Здесь была карточка с «оценкой SEO», сроком оптимизации и
                    списком «ключевых рекомендаций» — все три брались из
                    случайных чисел, а не из обхода. Осталось то, что обход
                    действительно посчитал.
                  */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Общая информация</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Просканировано страниц:</span>
                      <span className="font-medium">{result.pageCount.toLocaleString('ru-RU')}</span>
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
                  
                </div>
              </div>
            )}
          </TabsContent>

        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isScanning ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
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
