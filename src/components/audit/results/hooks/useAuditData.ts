
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AuditData, RecommendationData, AuditHistoryData, ScanOptions } from '@/types/audit';
import { fetchAuditData, fetchRecommendations, fetchAuditHistory, scanWebsite, createOptimizedSite } from '@/services/auditService';

interface PageStatistics {
  totalPages: number;
  subpages: Record<string, number>;
  levels: Record<number, number>;
}

interface PageContent {
  url: string;
  title: string;
  content: string;
  meta: {
    description?: string;
    keywords?: string;
  };
  images: {
    src: string;
    alt?: string;
  }[];
}

export const useAuditData = (url: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [historyData, setHistoryData] = useState<AuditHistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanDetails, setScanDetails] = useState<{
    pagesScanned: number;
    totalPages: number;
    currentUrl: string;
  }>({
    pagesScanned: 0,
    totalPages: 250000, // Увеличено до 250000 страниц
    currentUrl: ''
  });
  const [pageStats, setPageStats] = useState<PageStatistics | undefined>(undefined);
  const [sitemap, setSitemap] = useState<string | undefined>(undefined);
  const [pagesContent, setPagesContent] = useState<PageContent[] | undefined>(undefined);
  const [optimizationCost, setOptimizationCost] = useState<number | undefined>(undefined);
  const [isOptimized, setIsOptimized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  const loadAuditData = async (refresh = false, deepScan = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      if (!refresh) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Если запрошено глубокое сканирование, сначала выполняем обход сайта
      if (deepScan) {
        setIsScanning(true);
        
        const scanOptions: ScanOptions = {
          maxPages: 250000, // Увеличено до 250000 страниц
          maxDepth: 50,     // Увеличено до 50 уровней глубины
          followExternalLinks: false,
          checkMobile: true,
          analyzeSEO: true,
          analyzePerformance: true,
          onProgress: (pagesScanned, totalPages, currentUrl) => {
            setScanDetails({
              pagesScanned,
              totalPages,
              currentUrl
            });
          }
        };
        
        const scanResult = await scanWebsite(url, scanOptions);
        if (scanResult.success && scanResult.pageStats) {
          setPageStats(scanResult.pageStats);
          if (scanResult.sitemap) {
            setSitemap(scanResult.sitemap);
            
            // Уведомляем пользователя о создании карты сайта
            toast({
              title: "Карта сайта создана",
              description: "XML sitemap сгенерирован на основе структуры сайта",
            });
          }
          
          // Сохраняем содержимое страниц для дальнейшего использования
          if (scanResult.pagesContent) {
            setPagesContent(scanResult.pagesContent);
          }
          
          // Сохраняем стоимость оптимизации
          if (scanResult.optimizationCost) {
            setOptimizationCost(scanResult.optimizationCost);
            toast({
              title: "Расчет стоимости оптимизации",
              description: `Стоимость оптимизации сайта: ${new Intl.NumberFormat('ru-RU').format(scanResult.optimizationCost)} ₽`,
            });
          }
        }
        setIsScanning(false);
      }
      
      const [auditResult, recommendationsResult, historyResult] = await Promise.all([
        fetchAuditData(url),
        fetchRecommendations(url),
        fetchAuditHistory(url)
      ]);
      
      // Обновляем количество страниц в результате аудита, если мы сканировали сайт
      if (pageStats && pageStats.totalPages > 0) {
        auditResult.pageCount = pageStats.totalPages;
      }
      
      setAuditData(auditResult);
      setRecommendations(recommendationsResult);
      setHistoryData(historyResult);
      
      toast({
        title: refresh ? "Аудит обновлен" : "Аудит завершен",
        description: refresh 
          ? "SEO аудит сайта успешно обновлен" 
          : `SEO аудит завершен. Проанализировано ${auditResult.pageCount} страниц.`,
      });
    } catch (error) {
      console.error('Ошибка загрузки данных аудита:', error);
      setError("Не удалось загрузить данные аудита. Пожалуйста, проверьте URL и попробуйте снова.");
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить результаты аудита",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      }, 500);
    }
  };

  // Функция для скачивания sitemap
  const downloadSitemap = () => {
    if (sitemap) {
      const blob = new Blob([sitemap], { type: 'text/xml' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Формируем имя файла из домена
      let hostname;
      try {
        // Проверяем, что URL валидный, добавляем протокол, если нужно
        hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      } catch (error) {
        // Если URL невалидный, используем безопасное имя файла
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
    } else {
      toast({
        title: "Карта сайта не найдена",
        description: "Сначала необходимо выполнить сканирование сайта",
        variant: "destructive",
      });
    }
  };
  
  // Функция для скачивания оптимизированного сайта
  const downloadOptimizedSite = async () => {
    if (!url || !pagesContent) {
      toast({
        title: "Недостаточно данных",
        description: "Необходимо выполнить глубокое сканирование сайта",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Создание оптимизированной версии",
      description: "Пожалуйста, подождите...",
    });
    
    try {
      let hostname;
      try {
        hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      } catch (error) {
        hostname = url.replace(/[^a-zA-Z0-9]/g, '_');
      }
      
      // В реальном приложении здесь будет вызов createOptimizedSite с реальными данными
      // и обработка ZIP-архива
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsOptimized(true);
      
      // Создаем тестовый архив для демонстрации
      const testZip = new Blob(['Optimized site content would be here'], { type: 'application/zip' });
      const downloadUrl = window.URL.createObjectURL(testZip);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `optimized_${hostname}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Готово!",
        description: "Оптимизированная версия сайта успешно скачана",
      });
    } catch (error) {
      console.error('Ошибка при создании оптимизированной версии:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать оптимизированную версию сайта",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadAuditData();
  }, [url]);

  return {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    optimizationCost,
    isOptimized,
    loadAuditData,
    setIsRefreshing,
    downloadSitemap,
    downloadOptimizedSite
  };
};
