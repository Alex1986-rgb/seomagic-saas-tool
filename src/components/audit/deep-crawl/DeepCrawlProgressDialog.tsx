
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCrawlProgress } from './hooks/useCrawlProgress';

interface DeepCrawlProgressDialogProps {
  open: boolean;
  onClose: (pageCount?: number, urls?: string[]) => void;
  url: string;
  initialStage?: 'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'failed';
}

export const DeepCrawlProgressDialog: React.FC<DeepCrawlProgressDialogProps> = ({
  open,
  onClose,
  url,
  initialStage = 'idle'
}) => {
  const {
    isLoading,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    crawlStage,
    domain,
    scannedUrls,
    startCrawl,
    cancelCrawl
  } = useCrawlProgress(url);

  useEffect(() => {
    if (open && initialStage === 'starting' && !isLoading) {
      console.log(`DeepCrawlProgressDialog: Начинаем сканирование URL: ${url}`);
      startCrawl();
    }
  }, [open, initialStage, isLoading, startCrawl, url]);

  const handleCancel = () => {
    cancelCrawl();
    onClose();
  };

  const handleClose = () => {
    onClose(pagesScanned, scannedUrls);
  };

  const getStageText = () => {
    switch (crawlStage) {
      case 'starting':
        return 'Подготовка к сканированию...';
      case 'crawling':
        return `Сканирование страниц (${pagesScanned} из ${totalPages || '?'})`;
      case 'analyzing':
        return 'Анализ найденных страниц...';
      case 'completed':
        return `Сканирование завершено. Найдено ${pagesScanned} страниц.`;
      case 'failed':
        return 'Ошибка сканирования';
      default:
        return 'Ожидание запуска...';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && (crawlStage === 'completed' || crawlStage === 'failed' ? handleClose() : handleCancel())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Глубокое сканирование сайта</DialogTitle>
          <DialogDescription>
            URL: {url}
            {domain && domain !== url && <div className="mt-1 text-xs">Домен: {domain}</div>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Progress value={progress} className="w-full" />
          
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">{getStageText()}</p>
            {currentUrl && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground truncate max-w-full">
                  Текущий URL: {currentUrl}
                </p>
                {domain && (
                  <p className="text-xs text-primary">
                    Сканируем домен: {domain}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between gap-2">
          {crawlStage !== 'completed' && crawlStage !== 'failed' ? (
            <Button variant="outline" onClick={handleCancel}>Отменить</Button>
          ) : (
            <Button onClick={handleClose}>Закрыть</Button>
          )}
          
          {crawlStage === 'completed' && (
            <div className="text-sm text-muted-foreground">
              Найдено: {pagesScanned} страниц
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeepCrawlProgressDialog;
