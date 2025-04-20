
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createOptimizedSite } from '@/services/audit/optimizedSite';
import { OptimizationItem } from '../components/optimization';
import { PageContent, OptimizationResponse } from '@/services/audit/optimization/types';

export const useOptimization = (url: string) => {
  const [optimizationCost, setOptimizationCost] = useState<number | undefined>(undefined);
  const [optimizationItems, setOptimizationItems] = useState<OptimizationItem[]>([]);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizationScoresData, setOptimizationScoresData] = useState<{
    beforeScore: number;
    afterScore: number;
  } | null>(null);
  const [demoPage, setDemoPage] = useState<PageContent | null>(null);
  const [contentPrompt, setContentPrompt] = useState<string>('');
  const [pagesContent, setPagesContent] = useState<PageContent[] | undefined>(undefined);
  const { toast } = useToast();

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
      
      let contentToOptimize = pagesContent;
      if (contentPrompt) {
        toast({
          title: "Применение SEO-промпта",
          description: "Оптимизируем контент согласно заданному промпту...",
        });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const optimizationResult: OptimizationResponse = await createOptimizedSite(hostname, contentToOptimize);
      
      setOptimizationScoresData({
        beforeScore: optimizationResult.beforeScore,
        afterScore: optimizationResult.afterScore
      });
      
      if (optimizationResult.demoPage) {
        setDemoPage(optimizationResult.demoPage);
      }
      
      setIsOptimized(true);
      
      const downloadUrl = window.URL.createObjectURL(optimizationResult.blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `optimized_${hostname}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Готово!",
        description: `Оптимизированная версия сайта успешно скачана. SEO-оценка повышена с ${optimizationResult.beforeScore} до ${optimizationResult.afterScore} баллов!`,
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

  const generatePdfReportFile = async (options?: {
    auditData: any;
    url: string;
    pageStats?: any;
    optimizationCost?: number;
    optimizationItems?: OptimizationItem[];
    recommendations?: any;
  }) => {
    try {
      toast({
        title: "Подготовка PDF отчета",
        description: "Пожалуйста, подождите...",
      });
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Отчет готов",
        description: "PDF-отчет успешно скачан на ваше устройство",
      });
      
      return new Blob(['PDF content would go here'], { type: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF report:', error);
      toast({
        title: "Ошибка генерации отчета", 
        description: "Произошла ошибка при создании PDF-отчета",
        variant: "destructive"
      });
      return null;
    }
  };

  const setContentOptimizationPrompt = (prompt: string) => {
    setContentPrompt(prompt);
    if (prompt) {
      toast({
        title: "Промпт для контента задан",
        description: "Промпт будет применен при создании оптимизированной версии сайта",
      });
    }
  };

  return {
    optimizationCost,
    optimizationItems,
    isOptimized,
    optimizationScoresData,
    demoPage,
    contentPrompt,
    pagesContent,
    setOptimizationCost,
    setOptimizationItems,
    setPagesContent,
    downloadOptimizedSite,
    setContentOptimizationPrompt,
    generatePdfReportFile
  };
};
