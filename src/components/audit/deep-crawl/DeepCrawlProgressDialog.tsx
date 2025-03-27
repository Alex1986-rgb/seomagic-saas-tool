
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileSearch, Map, Database, CheckCircle, DownloadCloud, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DeepCrawler } from '@/services/audit/deepCrawler';
import { generateSitemap } from '@/services/audit/sitemap';
import { useToast } from "@/hooks/use-toast";

interface DeepCrawlProgressDialogProps {
  open: boolean;
  onClose: (pageCount?: number) => void;
  url: string;
}

export const DeepCrawlProgressDialog: React.FC<DeepCrawlProgressDialogProps> = ({ 
  open, 
  onClose, 
  url 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [pagesScanned, setPagesScanned] = useState(0);
  const [estimatedPages, setEstimatedPages] = useState(0);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [crawlStage, setCrawlStage] = useState('initializing');
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      startCrawling();
    }
  }, [open]);

  const startCrawling = async () => {
    // Reset state
    setProgress(0);
    setPagesScanned(0);
    setEstimatedPages(100000);
    setCurrentUrl('');
    setSitemap(null);
    setIsCompleted(false);
    setCrawlStage('initializing');
    
    try {
      // Identify if it's myarredo or similar site for specialized scanning
      const isFurnitureSite = url.includes('myarredo') || url.includes('arredo');
      const maxPages = isFurnitureSite ? 70000 : 250000;
      
      setCrawlStage('starting');
      
      // Create and start the deep crawler
      const crawler = new DeepCrawler(url, {
        maxPages,
        maxDepth: 50,
        followExternalLinks: false,
        onProgress: (pagesScanned, totalEstimated, currentUrl) => {
          setPagesScanned(pagesScanned);
          setEstimatedPages(totalEstimated);
          setCurrentUrl(currentUrl);
          
          const progressPercent = Math.min(
            Math.floor((pagesScanned / Math.min(totalEstimated, maxPages)) * 100),
            99
          );
          setProgress(progressPercent);
          
          // Update crawl stage based on progress
          if (progressPercent < 20) {
            setCrawlStage('exploring');
          } else if (progressPercent < 50) {
            setCrawlStage('discovery');
          } else if (progressPercent < 80) {
            setCrawlStage('indexing');
          } else {
            setCrawlStage('finalizing');
          }
        }
      });
      
      const result = await crawler.startCrawling();
      
      // Generate sitemap from results
      let domain;
      try {
        domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      } catch (error) {
        domain = url;
      }
      
      const generatedSitemap = generateSitemap(domain, result.pageCount);
      setSitemap(generatedSitemap);
      
      // Complete the crawl
      setCrawlStage('completed');
      setProgress(100);
      setIsCompleted(true);
      
      toast({
        title: "Сканирование завершено",
        description: `Найдено ${result.pageCount.toLocaleString('ru-RU')} страниц на сайте`,
      });
      
    } catch (error) {
      console.error('Error during deep crawl:', error);
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
      
      setCrawlStage('error');
      setIsCompleted(true);
    }
  };

  const downloadSitemap = () => {
    if (sitemap) {
      const blob = new Blob([sitemap], { type: 'text/xml' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      let hostname;
      try {
        hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      } catch (error) {
        hostname = url.replace(/[^a-zA-Z0-9]/g, '_');
      }
      
      a.download = `sitemap_${hostname}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Карта сайта скачана",
        description: "XML-файл карты сайта успешно сохранен",
      });
    }
  };

  const handleClose = () => {
    if (isCompleted) {
      onClose(pagesScanned);
    } else {
      // Ask for confirmation
      if (window.confirm("Вы уверены, что хотите прервать сканирование?")) {
        onClose();
      }
    }
  };

  // Helper for stage titles
  const getStageTitleAndInfo = () => {
    switch (crawlStage) {
      case 'initializing':
        return {
          title: 'Инициализация сканирования',
          info: 'Подготовка к глубокому сканированию сайта...'
        };
      case 'starting':
        return {
          title: 'Запуск сканирования',
          info: 'Анализ главной страницы и карты сайта...'
        };
      case 'exploring':
        return {
          title: 'Исследование структуры',
          info: 'Анализ основных разделов и каталогов...'
        };
      case 'discovery':
        return {
          title: 'Обнаружение страниц',
          info: 'Поиск всех доступных страниц по ссылкам...'
        };
      case 'indexing':
        return {
          title: 'Индексация контента',
          info: 'Обработка найденных страниц и контента...'
        };
      case 'finalizing':
        return {
          title: 'Завершение сканирования',
          info: 'Сбор итоговой информации и создание карты сайта...'
        };
      case 'completed':
        return {
          title: 'Сканирование завершено',
          info: `Найдено ${pagesScanned.toLocaleString('ru-RU')} страниц на сайте`
        };
      case 'error':
        return {
          title: 'Ошибка сканирования',
          info: 'Произошла ошибка при сканировании сайта'
        };
      default:
        return {
          title: 'Сканирование',
          info: 'Обработка сайта...'
        };
    }
  };

  const { title, info } = getStageTitleAndInfo();

  return (
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 px-2">
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm mb-2">
              <span>{info}</span>
              <span className="font-medium">{progress}%</span>
            </div>
            
            <Progress value={progress} className="h-2"/>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Обработано: {pagesScanned.toLocaleString('ru-RU')}</span>
              <span>Оценка: ~{estimatedPages.toLocaleString('ru-RU')}</span>
            </div>
          </div>
          
          {currentUrl && (
            <div className="mt-3 overflow-hidden">
              <p className="text-xs text-muted-foreground mb-1">Текущая страница:</p>
              <div className="bg-muted/30 rounded p-1 text-xs truncate overflow-hidden">
                {currentUrl}
              </div>
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { icon: <Database className="h-4 w-4" />, text: "Анализ данных", done: progress >= 25 },
              { icon: <Map className="h-4 w-4" />, text: "Сбор ссылок", done: progress >= 50 },
              { icon: <FileSearch className="h-4 w-4" />, text: "Индексация", done: progress >= 75 },
              { icon: <CheckCircle className="h-4 w-4" />, text: "Завершение", done: progress >= 100 }
            ].map((stage, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${stage.done ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {stage.done ? <CheckCircle className="h-4 w-4" /> : stage.icon}
                </div>
                <span className="text-xs mt-1 text-center">{stage.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          {isCompleted ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                Закрыть
              </Button>
              
              {sitemap && (
                <Button
                  onClick={downloadSitemap}
                  size="sm"
                  className="gap-2"
                >
                  <DownloadCloud className="h-4 w-4" />
                  Скачать Sitemap
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Прервать
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Сканирование...</span>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
