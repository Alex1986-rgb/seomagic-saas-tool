
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useRef } from 'react';
import { useOptimizationAPI } from '@/hooks/use-optimization-api';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationContextType {
  optimizationCost: number;
  optimizationItems: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  isLoadingCost: boolean;
  loadingStatus: string;
  retryAttempt: number;
  setContentOptimizationPrompt: (prompt: string) => void;
  loadOptimizationCost: (taskId: string) => Promise<void>;
  optimizeSiteContent: (taskId: string, prompt: string) => Promise<any>;
}

const OptimizationContext = createContext<OptimizationContextType>({
  optimizationCost: 0,
  optimizationItems: [],
  isOptimized: false,
  contentPrompt: '',
  isLoadingCost: false,
  loadingStatus: '',
  retryAttempt: 0,
  setContentOptimizationPrompt: () => {},
  loadOptimizationCost: async () => {},
  optimizeSiteContent: async () => null,
});

export const OptimizationProvider: React.FC<{ 
  children: ReactNode; 
  taskId: string | null;
}> = ({ children, taskId }) => {
  const [optimizationCost, setOptimizationCost] = useState<number>(0);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [contentPrompt, setContentPrompt] = useState<string>('');
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const loadedTaskIdsRef = useRef<Set<string>>(new Set());
  const isLoadingRef = useRef<boolean>(false);
  
  const {
    isLoadingCost,
    loadOptimizationCost: apiLoadOptimizationCost,
    optimizeSiteContent: apiOptimizeSiteContent,
    startOptimization
  } = useOptimizationAPI(taskId || '');
  
  // Здесь был downloadOptimizedSite — имитация: ждал секунду по таймеру и
  // ничего не скачивал. Сборки исправленной копии сайта на сервере нет, поэтому
  // и скачивать нечего; вызывающий код получил бы ложное «готово».

  const loadOptimizationCost = useCallback(async (taskId: string): Promise<void> => {
    if (!taskId) return;
    
    // Prevent duplicate requests for the same task
    if (loadedTaskIdsRef.current.has(taskId)) {
      console.log('[OptimizationContext] Already loaded cost for task:', taskId);
      return;
    }
    
    // Prevent concurrent requests
    if (isLoadingRef.current) {
      console.log('[OptimizationContext] Already loading, skipping...');
      return;
    }
    
    isLoadingRef.current = true;
    // Метку «уже загружено» ставим сразу, чтобы параллельный вызов (расчёт
    // запускает и useAuditBase при завершении аудита) не ушёл вторым запросом.
    loadedTaskIdsRef.current.add(taskId);
    setLoadingStatus('Подготовка к расчету стоимости...');
    setRetryAttempt(0);
    
    let loaded = false;
    try {
      loaded = await apiLoadOptimizationCost(
        taskId,
        (cost: number) => setOptimizationCost(cost),
        (items: OptimizationItem[]) => setOptimizationItems(items),
        (status: string, attempt?: number) => {
          setLoadingStatus(status);
          if (attempt) setRetryAttempt(attempt);
        }
      );
    } finally {
      // Расчёт не удался — снимаем метку. Иначе повторное нажатие «Рассчитать
      // смету» молча ничего не делало: задача числилась загруженной.
      if (!loaded) {
        loadedTaskIdsRef.current.delete(taskId);
      }
      isLoadingRef.current = false;
      setLoadingStatus('');
      setRetryAttempt(0);
    }
  }, [apiLoadOptimizationCost]);
  
  const optimizeSiteContent = useCallback(async (taskId: string, prompt: string) => {
    if (!taskId) return null;
    
    const result = await apiOptimizeSiteContent(prompt);
    if (result) {
      setIsOptimized(true);
    }
    return result;
  }, [apiOptimizeSiteContent]);
  
  const setContentOptimizationPrompt = useCallback((prompt: string) => {
    setContentPrompt(prompt);
  }, []);
  
  // Note: Auto-loading is handled by useAuditBase polling when audit completes
  // We don't auto-load here based on taskId because the audit may not be complete yet
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    isLoadingCost,
    loadingStatus,
    retryAttempt,
    setContentOptimizationPrompt,
    loadOptimizationCost,
    optimizeSiteContent,
  }), [
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    isLoadingCost,
    loadingStatus,
    retryAttempt,
    setContentOptimizationPrompt,
    loadOptimizationCost,
    optimizeSiteContent,
  ]);
  
  return (
    <OptimizationContext.Provider value={contextValue}>
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimizationContext = () => {
  const context = useContext(OptimizationContext);
  
  if (context === undefined) {
    throw new Error('useOptimizationContext must be used within an OptimizationProvider');
  }
  
  return context;
};
