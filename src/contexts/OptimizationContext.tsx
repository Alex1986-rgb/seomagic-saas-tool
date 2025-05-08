
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  
  const {
    isLoadingCost,
    loadOptimizationCost: apiLoadOptimizationCost,
    optimizeSiteContent: apiOptimizeSiteContent,
    downloadOptimizedSite: apiDownloadOptimizedSite
  } = useOptimizationAPI(taskId || '');
  
  const loadOptimizationCost = async (taskId: string) => {
    if (!taskId) return;
    
    const result = await apiLoadOptimizationCost();
    if (result) {
      setOptimizationCost(result.cost || 0);
      setOptimizationItems(result.items || []);
    }
  };
  
  const optimizeSiteContent = async (taskId: string, prompt: string) => {
    if (!taskId) return null;
    
    const result = await apiOptimizeSiteContent(prompt);
    if (result && result.success) {
      setIsOptimized(true);
    }
    return result;
  };
  
  const downloadOptimizedSite = async (taskId: string) => {
    if (!taskId) return;
    
    await apiDownloadOptimizedSite();
  };
  
  return (
    <OptimizationContext.Provider value={{
      optimizationCost,
      optimizationItems,
      isOptimized,
      contentPrompt,
      isLoadingCost,
      setContentOptimizationPrompt: setContentPrompt,
      loadOptimizationCost,
      optimizeSiteContent,
      downloadOptimizedSite
    }}>
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
