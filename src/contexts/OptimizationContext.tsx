
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
    startOptimization
  } = useOptimizationAPI(taskId || '');
  
  // Add implementation for downloadOptimizedSite
  const downloadOptimizedSite = async (taskId: string): Promise<void> => {
    if (!taskId) return;
    
    try {
      // Implementation for downloading optimized site
      console.log("Downloading optimized site for task ID:", taskId);
      // In a real implementation, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error("Error downloading optimized site:", error);
    }
  };
  
  const loadOptimizationCost = async (taskId: string): Promise<void> => {
    if (!taskId) return;
    
    await apiLoadOptimizationCost(
      taskId,
      (cost: number) => setOptimizationCost(cost),
      (items: OptimizationItem[]) => setOptimizationItems(items)
    );
  };
  
  const optimizeSiteContent = async (taskId: string, prompt: string) => {
    if (!taskId) return null;
    
    const result = await apiOptimizeSiteContent(prompt);
    if (result) {
      setIsOptimized(true);
    }
    return result;
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
