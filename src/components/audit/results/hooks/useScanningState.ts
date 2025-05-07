
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PageStats } from '@/types/api';
import { useScan } from '@/hooks/use-scan';

export const useScanningState = (url: string, onPageCountUpdate: (count: number) => void) => {
  // Используем централизованный хук для сканирования
  const {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    startScan,
    downloadSitemap
  } = useScan(url, onPageCountUpdate);
  
  // Обёртка для запуска сканирования сайта
  const handleScanWebsite = useCallback(async () => {
    return await startScan(true);
  }, [startScan]);

  return {
    isScanning,
    setIsScanning: () => {}, // Placeholder since we're using the centralized hook
    scanDetails,
    setScanDetails: () => {}, // Placeholder
    pageStats,
    sitemap,
    handleScanWebsite,
    downloadSitemap
  };
};
