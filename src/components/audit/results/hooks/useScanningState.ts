
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ScanOptions } from '@/types/audit';
import { scanWebsite } from '@/services/audit/scanner';

interface PageStatistics {
  totalPages: number;
  subpages: Record<string, number>;
  levels: Record<number, number>;
}

export const useScanningState = (url: string, onUpdateAuditData: (pageCount: number) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanDetails, setScanDetails] = useState<{
    pagesScanned: number;
    totalPages: number;
    currentUrl: string;
  }>({
    pagesScanned: 0,
    totalPages: 250000,
    currentUrl: ''
  });
  const [pageStats, setPageStats] = useState<PageStatistics | undefined>(undefined);
  const [sitemap, setSitemap] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleScanWebsite = async () => {
    setIsScanning(true);
    
    // Special case for myarredo.ru
    const isFurnitureSite = url.includes('myarredo') || url.includes('arredo');
    
    const scanOptions: ScanOptions = {
      maxPages: isFurnitureSite ? 70000 : 250000, // Lower default for furniture sites based on user knowledge
      maxDepth: 50,
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
    
    try {
      const scanResult = await scanWebsite(url, scanOptions);
      if (scanResult.success && scanResult.pageStats) {
        setPageStats(scanResult.pageStats);
        if (scanResult.sitemap) {
          setSitemap(scanResult.sitemap);
          toast({
            title: "Карта сайта создана",
            description: "XML sitemap сгенерирован на основе структуры сайта",
          });
        }
        
        if (scanResult.pageStats.totalPages > 0) {
          onUpdateAuditData(scanResult.pageStats.totalPages);
        }
        
        return {
          pageStats: scanResult.pageStats,
          sitemap: scanResult.sitemap,
          pagesContent: scanResult.pagesContent,
          optimizationCost: scanResult.optimizationCost,
          optimizationItems: scanResult.optimizationItems
        };
      }
    } catch (error) {
      console.error('Ошибка сканирования сайта:', error);
      toast({
        title: "Ошибка сканирования",
        description: "Не удалось выполнить сканирование сайта",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
    
    return null;
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
    } else {
      toast({
        title: "Карта сайта не найдена",
        description: "Сначала необходимо выполнить сканирование сайта",
        variant: "destructive",
      });
    }
  };

  return {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    handleScanWebsite,
    downloadSitemap
  };
};
