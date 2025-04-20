
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
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
  onClose: (pageCount?: number) => void;
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
  
  const {
    isLoading,
    isComplete,
    progress,
    currentUrl,
    pagesScanned,
    totalPages,
    scannedUrls,
    crawlStage,
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
        const result = await startCrawling();
        if (result) {
          toast({
            title: "Сканирование завершено",
            description: `Обнаружено ${result.pageCount} страниц на сайте ${url}`,
          });
        }
      };
      
      startScanning();
    }
  }, [open, url, startCrawling, toast]);

  const handleClose = () => {
    setDialogOpen(false);
    onClose(pagesScanned);
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
            <div className="text-xs text-muted-foreground truncate">
              Текущий URL: {currentUrl}
            </div>
          )}

          {crawlStage === 'failed' && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded">
              <AlertCircle className="h-4 w-4" />
              <span>Произошла ошибка при сканировании. Пожалуйста, попробуйте еще раз.</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {crawlStage === 'completed' ? (
            <>
              <Button onClick={downloadSitemap} variant="outline" size="sm">
                Скачать карту сайта
              </Button>
              <Button onClick={downloadAllData} variant="outline" size="sm">
                Скачать все данные
              </Button>
              <Button onClick={handleClose} variant="default" size="sm">
                <Check className="h-4 w-4 mr-1" /> Готово
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
