
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCrawlProgress } from './hooks/useCrawlProgress';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

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
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();
  
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
    cancelCrawl,
    errorMsg
  } = useCrawlProgress(url);

  // Function to retry scanning
  const retryScanning = () => {
    setAttemptCount(prevCount => prevCount + 1);
    console.log(`Retrying scan, attempt ${attemptCount + 1}`);
    startCrawl();
  };

  useEffect(() => {
    if (open && initialStage === 'starting' && !isLoading) {
      console.log(`DeepCrawlProgressDialog: Начинаем сканирование URL: ${url}`);
      toast({
        title: "Запуск сканирования",
        description: `Начинаем сканирование сайта: ${url}`,
      });
      startCrawl();
    }
  }, [open, initialStage, isLoading, startCrawl, url, toast]);

  // Add a loading timeout checker
  useEffect(() => {
    // If scanning is stuck in starting stage for more than 10 seconds
    if (crawlStage === 'starting' && isLoading) {
      const timeoutId = setTimeout(() => {
        if (crawlStage === 'starting' && attemptCount < 2) {
          console.log("Scan seems to be stuck in starting phase, retrying...");
          toast({
            title: "Перезапуск сканирования",
            description: "Сканирование зависло на начальном этапе, выполняем перезапуск",
            variant: "default"
          });
          retryScanning();
        } else if (crawlStage === 'starting' && attemptCount >= 2) {
          console.error("Failed to start scanning after multiple attempts");
          toast({
            title: "Ошибка сканирования",
            description: "Не удалось запустить сканирование после нескольких попыток",
            variant: "destructive"
          });
        }
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [crawlStage, isLoading, attemptCount, toast]);

  const handleCancel = () => {
    cancelCrawl();
    toast({
      title: "Сканирование отменено",
      description: "Процесс сканирования был прерван",
    });
    onClose();
  };

  const handleClose = () => {
    onClose(pagesScanned, scannedUrls);
    if (pagesScanned > 0) {
      toast({
        title: "Сканирование завершено",
        description: `Обнаружено ${pagesScanned} страниц на сайте`,
      });
    }
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
          
          {(errorMsg || crawlStage === 'failed') && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {errorMsg || "Произошла ошибка при сканировании сайта"}
              </AlertDescription>
              {attemptCount < 3 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={retryScanning}
                >
                  Попробовать снова
                </Button>
              )}
            </Alert>
          )}
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
