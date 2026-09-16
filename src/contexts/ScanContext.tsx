
import React, { createContext, useContext, useCallback, useMemo, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScan } from '@/hooks/use-scan';
import { ScanLogEntry } from '@/types/scan-logs';

// Define the ScanDetails interface
export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress: number;
  status?: string;
  audit_data?: any;
}

// Define the scan context type
interface ScanContextType {
  url: string;
  isScanning: boolean;
  scanDetails: ScanDetails;
  taskId: string | null;
  sitemap: any;
  pageStats: any;
  scanLogs: ScanLogEntry[];
  /** `maxPages` — сколько страниц обойти; без него берётся значение по умолчанию. */
  startScan: (deepScan?: boolean, maxPages?: number) => Promise<string | null>;
  /** Открыть существующую задачу: показать результаты или продолжить следить за ходом. */
  openTask: (taskId: string) => Promise<void>;
  cancelScan: () => Promise<void>;
  downloadSitemap: () => Promise<void>;
  clearLogs: () => void;
}

// Create the context with default values
const ScanContext = createContext<ScanContextType>({
  url: '',
  isScanning: false,
  scanDetails: {
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle',
    progress: 0
  },
  taskId: null,
  sitemap: null,
  pageStats: null,
  scanLogs: [],
  startScan: async () => null,
  openTask: async () => {},
  cancelScan: async () => {},
  downloadSitemap: async () => {},
  clearLogs: () => {}
});

// Provider component
export const ScanProvider: React.FC<{ children: ReactNode; url: string }> = ({ 
  children, 
  url 
}) => {
  console.log('🔧 ScanProvider initialized with url:', url);
  
  // Track URL changes
  React.useEffect(() => {
    console.log('🔧 ScanProvider: url changed to:', url);
  }, [url]);
  
  /**
   * Какую проверку показать, говорит адрес страницы (`?task_id=`). Раньше
   * параметр только складывался в localStorage, сюда не доходил, и по ссылке
   * «Просмотр» из истории открывалась не выбранная проверка, а последняя по
   * домену. Провайдер живёт внутри страниц под роутером, поэтому читаем адрес
   * здесь, не заставляя каждую страницу пробрасывать параметр.
   */
  const [searchParams] = useSearchParams();
  const requestedTaskId = searchParams.get('task_id');

  const {
    isScanning,
    scanDetails,
    sitemap,
    taskId,
    pageStats,
    scanLogs,
    startScan,
    openTask,
    cancelScan,
    downloadSitemap: downloadSitemapFn,
    clearLogs
  } = useScan(url, undefined, { taskId: requestedTaskId, restoreLatest: true });
  
  // Ensure scanDetails has all required properties with default values
  // Memoize to prevent creating new object on every render
  const scanDetailsWithDefaults: ScanDetails = useMemo(() => ({
    current_url: scanDetails?.current_url || '',
    pages_scanned: scanDetails?.pages_scanned || 0,
    estimated_pages: scanDetails?.estimated_pages || 0,
    stage: scanDetails?.stage || 'idle',
    progress: scanDetails?.progress || 0,
    status: scanDetails?.status,
    audit_data: scanDetails?.audit_data,
    task_id: taskId
  } as any), [scanDetails, taskId]);
  
  // Wrap the downloadSitemap function to ensure it returns a Promise
  const downloadSitemap = useCallback(async (): Promise<void> => {
    if (downloadSitemapFn) {
      await downloadSitemapFn();
    }
  }, [downloadSitemapFn]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    url,
    isScanning,
    scanDetails: scanDetailsWithDefaults,
    taskId,
    sitemap,
    pageStats,
    scanLogs,
    startScan,
    openTask,
    cancelScan,
    downloadSitemap,
    clearLogs
  }), [url, isScanning, scanDetailsWithDefaults, taskId, sitemap, pageStats, scanLogs, startScan, openTask, cancelScan, downloadSitemap, clearLogs]);
  
  return (
    <ScanContext.Provider value={contextValue}>
      {children}
    </ScanContext.Provider>
  );
};

// Custom hook to use the scan context
export const useScanContext = () => {
  const context = useContext(ScanContext);
  
  if (context === undefined) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  
  return context;
};
