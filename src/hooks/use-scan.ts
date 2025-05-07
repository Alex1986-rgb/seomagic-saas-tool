
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PageStats } from '@/types/api';

interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
}

/**
 * Централизованный хук для управления процессом сканирования сайтов
 */
export const useScan = (url: string, onPageCountUpdate?: (count: number) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanDetails, setScanDetails] = useState<ScanDetails>({
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle'
  });
  const [pageStats, setPageStats] = useState<PageStats | null>(null);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Запускает процесс сканирования сайта
   */
  const startScan = useCallback(async (deepScan: boolean = false) => {
    setIsScanning(true);
    setScanDetails({
      current_url: `Scanning ${url}...`,
      pages_scanned: 0,
      estimated_pages: 100,
      stage: 'starting'
    });

    // Mock implementation for frontend demo - in a real implementation,
    // this would call the real scanning API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock page count and stats
      const mockPageCount = Math.floor(Math.random() * 50) + 20;
      onPageCountUpdate?.(mockPageCount);
      
      // Mock page stats
      const mockPageStats: PageStats = {
        totalPages: mockPageCount,
        indexablePages: Math.floor(mockPageCount * 0.85),
        nonIndexablePages: Math.floor(mockPageCount * 0.15),
        brokenLinks: Math.floor(Math.random() * 5),
        externalLinks: Math.floor(Math.random() * 15) + 5,
        duplicateContent: Math.floor(Math.random() * 3),
        pageTypes: {
          'blog': Math.floor(mockPageCount * 0.4),
          'product': Math.floor(mockPageCount * 0.3),
          'category': Math.floor(mockPageCount * 0.2),
          'other': Math.floor(mockPageCount * 0.1)
        },
        depthData: [
          { level: 1, count: Math.floor(mockPageCount * 0.2) },
          { level: 2, count: Math.floor(mockPageCount * 0.5) },
          { level: 3, count: Math.floor(mockPageCount * 0.3) }
        ]
      };
      
      setPageStats(mockPageStats);
      
      // Mock sitemap XML string
      const mockSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://${url}/</loc></url>
  <url><loc>https://${url}/about</loc></url>
  <url><loc>https://${url}/blog</loc></url>
  <url><loc>https://${url}/contact</loc></url>
</urlset>`;
      
      setSitemap(mockSitemap);
      
      // Mock optimization cost and items for return value
      const mockOptimizationCost = mockPageCount * 5;
      
      const mockOptimizationItems = [
        {
          name: "Meta descriptions",
          count: Math.floor(mockPageCount * 0.7),
          price: mockPageCount * 2,
          type: "meta",
          pricePerUnit: 2,
          totalPrice: mockPageCount * 2,
          description: "Optimizing meta descriptions for better CTR"
        },
        {
          name: "Image alt tags",
          count: Math.floor(mockPageCount * 1.5),
          price: mockPageCount * 1,
          type: "image",
          pricePerUnit: 1,
          totalPrice: mockPageCount * 1.5,
          description: "Adding missing alt tags to images"
        },
        {
          name: "Header structure",
          count: mockPageCount,
          price: mockPageCount * 2,
          type: "structure",
          pricePerUnit: 2,
          totalPrice: mockPageCount * 2,
          description: "Improving heading structure for better SEO"
        }
      ];
      
      toast({
        title: "Сканирование завершено",
        description: `Обнаружено ${mockPageCount} страниц на сайте ${url}`,
      });
      
      // Mock scan completion
      setScanDetails({
        current_url: '',
        pages_scanned: mockPageCount,
        estimated_pages: mockPageCount,
        stage: 'completed'
      });
      
      setIsScanning(false);
      
      return {
        pageCount: mockPageCount,
        optimizationCost: mockOptimizationCost,
        optimizationItems: mockOptimizationItems,
        pagesContent: [] // Mock empty content
      };
      
    } catch (error) {
      console.error('Error scanning website:', error);
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive"
      });
      
      setIsScanning(false);
      return null;
    }
  }, [url, toast, onPageCountUpdate]);

  /**
   * Загружает файл sitemap.xml
   */
  const downloadSitemap = useCallback(() => {
    if (!sitemap) {
      toast({
        title: "Нет данных Sitemap",
        description: "Сначала необходимо выполнить сканирование сайта",
        variant: "destructive"
      });
      return;
    }
    
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Sitemap скачан",
      description: "Файл sitemap.xml успешно скачан",
    });
  }, [sitemap, toast]);

  return {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    startScan,
    downloadSitemap,
  };
};
