
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check, FileSearch } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCrawlProgress } from './hooks/useCrawlProgress';
import { Badge } from "@/components/ui/badge";

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
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(open);
  const [forceAttempt, setForceAttempt] = useState(0);
  
  const {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    scannedUrls,
    crawlStage,
    error,
    startCrawling,
    downloadSitemap,
    downloadAllData,
    downloadReport
  } = useCrawlProgress(url);

  useEffect(() => {
    setDialogOpen(open);
    
    if (open) {
      // Start crawling when dialog is opened
      const startScanning = async () => {
        try {
          console.log("Starting crawling for URL:", url);
          const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
          const result = await startCrawling();
          if (result) {
            console.log("Crawling completed successfully:", result);
            toast({
              title: "Сканирование завершено",
              description: `Обнаружено ${result.urls.length} страниц на сайте ${url}`,
            });
          } else {
            console.error("No result from crawling");
            // Если результат не получен, показываем уведомление об ошибке
            toast({
              title: "Ошибка сканирования",
              description: "Не удалось получить результаты сканирования. Попробуйте другой сайт или уменьшите глубину сканирования.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error during crawling:", error);
          toast({
            title: "Ошибка сканирования",
            description: "Произошла ошибка при сканировании. Попробуйте другой URL.",
            variant: "destructive"
          });
        }
      };
      
      startScanning();
    }
  }, [open, url, startCrawling, toast, forceAttempt]);

  const handleClose = () => {
    setDialogOpen(false);
    onClose(pagesScanned, scannedUrls);
  };

  const handleRetry = () => {
    // Увеличиваем счетчик попыток, что вызовет перезапуск сканирования в useEffect
    setForceAttempt(prev => prev + 1);
  };

  // Get stage label
  const getStageLabel = () => {
    switch (crawlStage) {
      case 'starting':
        return 'Подготовка к сканированию...';
      case 'crawling':
        return 'Сканирование страниц...';
      case 'analyzing':
        return 'Анализ структуры сайта...';
      case 'completed':
        return 'Сканирование завершено';
      case 'failed':
        return 'Ошибка сканирования';
      default:
        return 'Ожидание';
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            Глубокое сканирование сайта
            <Badge variant={crawlStage === 'completed' ? 'secondary' : 'default'}>{getStageLabel()}</Badge>
          </DialogTitle>
          <DialogDescription>
            {url} <span className="text-xs opacity-70">| Максимум 500,000 страниц</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <Progress value={progress} className="h-2" />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Просканировано:</div>
              <div className="font-medium">{pagesScanned.toLocaleString('ru-RU')} страниц</div>
            </div>
            <div>
              <div className="text-muted-foreground">Примерно всего:</div>
              <div className="font-medium">{totalPages > 0 ? totalPages.toLocaleString('ru-RU') : 'Оценка...'} страниц</div>
            </div>
          </div>
          
          {currentUrl && (
            <div className="text-xs text-muted-foreground truncate p-2 border border-border rounded-md bg-muted/50">
              Текущий URL: {currentUrl}
            </div>
          )}

          {(crawlStage === 'failed' || error) && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error || "Произошла ошибка при сканировании. Попробуйте другой URL или уменьшите глубину сканирования."}</span>
            </div>
          )}
          
          {pagesScanned === 0 && progress > 10 && (
            <div className="text-amber-500 text-sm flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>Сайт не отвечает или блокирует доступ. Попробуйте другой URL.</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {crawlStage === 'completed' ? (
            <>
              <Button 
                onClick={downloadSitemap} 
                variant="outline" 
                size="sm" 
                disabled={scannedUrls.length === 0}
              >
                Скачать карту сайта
              </Button>
              <Button 
                onClick={downloadAllData} 
                variant="outline" 
                size="sm"
                disabled={scannedUrls.length === 0}
              >
                Скачать все данные
              </Button>
              <Button onClick={handleClose} variant="default" size="sm">
                <Check className="h-4 w-4 mr-1" /> Готово
              </Button>
            </>
          ) : crawlStage === 'failed' ? (
            <>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Повторить
              </Button>
              <Button onClick={handleClose} variant="default" size="sm">
                Закрыть
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} variant={isComplete ? "default" : "outline"} size="sm">
              {isComplete ? "Закрыть" : "Отмена"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
