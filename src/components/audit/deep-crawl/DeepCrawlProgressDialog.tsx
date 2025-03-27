
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, FileSearch, Map, Database, CheckCircle, 
  DownloadCloud, X, AlertCircle, Clipboard, BarChart4 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DeepCrawler } from '@/services/audit/deepCrawler';
import { AdvancedCrawler } from '@/services/audit/crawler/advancedCrawler';
import { SitemapGenerator } from '@/services/audit/crawler/sitemapGenerator';
import { generateSitemap } from '@/services/audit/sitemap';
import { useToast } from "@/hooks/use-toast";
import CrawlResults from './CrawlResults';

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
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [crawler, setCrawler] = useState<AdvancedCrawler | null>(null);
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
    setError(null);
    setScannedUrls([]);
    setShowResults(false);
    
    try {
      // Parse domain from the URL
      let domainName;
      try {
        domainName = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        setDomain(domainName);
      } catch (error) {
        domainName = url;
        setDomain(url);
      }
      
      // Identify if it's myarredo or similar site for specialized scanning
      const isFurnitureSite = url.includes('myarredo') || url.includes('arredo');
      const maxPages = isFurnitureSite ? 100000 : 250000;
      
      setCrawlStage('starting');
      
      // Create and start the advanced crawler
      const newCrawler = new AdvancedCrawler(url, {
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
      
      setCrawler(newCrawler);
      
      // Start the crawler
      const result = await newCrawler.startCrawling();
      setScannedUrls(result.urls);
      
      // Generate sitemap from results
      const generatedSitemap = generateSitemap(domainName, result.pageCount);
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
      setError('Произошла ошибка при сканировании сайта');
      
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
      
      let hostname = domain || 'site';
      
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
  
  // Download enhanced sitemap package
  const downloadAllData = async () => {
    if (!crawler || !domain) return;
    
    try {
      // Create entries for SitemapGenerator
      const entries = scannedUrls.map(url => ({
        url,
        priority: url === (url.startsWith('http') ? url : `https://${url}`) ? 1.0 : 0.7
      }));
      
      await SitemapGenerator.downloadSitemapPackage(entries, domain);
      
      toast({
        title: "Данные скачаны",
        description: "Архив с данными сканирования успешно сохранен",
      });
    } catch (error) {
      console.error('Error downloading data package:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать архив с данными",
        variant: "destructive",
      });
    }
  };

  // Download report with crawl summary
  const downloadReport = async () => {
    if (!crawler) return;
    
    try {
      const blob = await crawler.exportCrawlData();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `crawl-report-${domain}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      
      toast({
        title: "Отчет скачан",
        description: "Отчет о сканировании успешно сохранен",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать отчет о сканировании",
        variant: "destructive",
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
  
  const toggleResults = () => {
    setShowResults(!showResults);
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
          info: error || 'Произошла ошибка при сканировании сайта'
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
      <DialogContent className={`${showResults ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        {!showResults && (
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
                <div className="bg-muted/30 rounded p-1.5 text-xs truncate overflow-hidden">
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
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Ошибка сканирования</p>
                    <p className="text-xs mt-1 text-destructive/80">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {showResults && isCompleted && !error && (
          <CrawlResults 
            pageCount={pagesScanned}
            domain={domain}
            urls={scannedUrls}
            onDownloadSitemap={downloadSitemap}
            onDownloadReport={downloadReport}
            onDownloadAllData={downloadAllData}
          />
        )}
        
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
              
              <div className="flex items-center gap-2">
                {!error && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleResults}
                  >
                    {showResults ? (
                      <>
                        <BarChart4 className="h-4 w-4 mr-1.5" />
                        Скрыть детали
                      </>
                    ) : (
                      <>
                        <BarChart4 className="h-4 w-4 mr-1.5" />
                        Показать детали
                      </>
                    )}
                  </Button>
                )}
                
                {sitemap && !showResults && (
                  <Button
                    onClick={downloadSitemap}
                    size="sm"
                    className="gap-2"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Скачать Sitemap
                  </Button>
                )}
              </div>
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
