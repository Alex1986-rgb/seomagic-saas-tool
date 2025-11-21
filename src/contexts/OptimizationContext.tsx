
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useRef } from 'react';
import { useOptimizationAPI } from '@/hooks/use-optimization-api';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationContextType {
  optimizationCost: number;
  optimizationItems: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  isLoadingCost: boolean;
  setContentOptimizationPrompt: (prompt: string) => void;
  loadOptimizationCost: (taskId: string) => Promise<void>;
  optimizeSiteContent: (taskId: string, prompt: string) => Promise<any>;
  downloadOptimizedSite: (taskId: string) => Promise<void>;
}

const OptimizationContext = createContext<OptimizationContextType>({
  optimizationCost: 0,
  optimizationItems: [],
  isOptimized: false,
  contentPrompt: '',
  isLoadingCost: false,
  setContentOptimizationPrompt: () => {},
  loadOptimizationCost: async () => {},
  optimizeSiteContent: async () => null,
  downloadOptimizedSite: async () => {}
});

export const OptimizationProvider: React.FC<{ 
  children: ReactNode; 
  taskId: string | null;
}> = ({ children, taskId }) => {
  const [optimizationCost, setOptimizationCost] = useState<number>(0);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [contentPrompt, setContentPrompt] = useState<string>('');
  const loadedTaskIdsRef = useRef<Set<string>>(new Set());
  const isLoadingRef = useRef<boolean>(false);
  
  const {
    isLoadingCost,
    loadOptimizationCost: apiLoadOptimizationCost,
    optimizeSiteContent: apiOptimizeSiteContent,
    startOptimization
  } = useOptimizationAPI(taskId || '');
  
  // Add implementation for downloadOptimizedSite
  const downloadOptimizedSite = useCallback(async (taskId: string): Promise<void> => {
    if (!taskId) return;
    
    try {
      // Implementation for downloading optimized site
      console.log("Downloading optimized site for task ID:", taskId);
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error downloading optimized site:", error);
    }
  }, []);
  
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
    loadedTaskIdsRef.current.add(taskId);
    
    try {
      await apiLoadOptimizationCost(
        taskId,
        (cost: number) => setOptimizationCost(cost),
        (items: OptimizationItem[]) => setOptimizationItems(items)
      );
    } finally {
      isLoadingRef.current = false;
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
  
  // Auto-load optimization cost when taskId changes
  // Only load if we haven't tried this taskId yet
  React.useEffect(() => {
    if (taskId && !loadedTaskIdsRef.current.has(taskId)) {
      console.log('[OptimizationContext] Auto-loading optimization cost for task:', taskId);
      // Add a 5-second delay to ensure audit results are saved to database
      // The backend process needs time to save results after task status changes to "completed"
      const timer = setTimeout(() => {
        loadOptimizationCost(taskId);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [taskId, loadOptimizationCost]);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    isLoadingCost,
    setContentOptimizationPrompt,
    loadOptimizationCost,
    optimizeSiteContent,
    downloadOptimizedSite
  }), [
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    isLoadingCost,
    setContentOptimizationPrompt,
    loadOptimizationCost,
    optimizeSiteContent,
    downloadOptimizedSite
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
