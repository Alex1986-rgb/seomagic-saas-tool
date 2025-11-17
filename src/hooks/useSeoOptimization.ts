import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoOptimizationController } from "@/services/api/seoOptimizationController";
import { openaiService } from "@/services/api/openaiService";

export interface AdvancedOptions {
  maxPages: number;
  followExternalLinks: boolean;
  analyzeMobile: boolean;
  optimizeImages: boolean;
  optimizeHeadings: boolean;
  optimizeMetaTags: boolean;
  optimizeContent: boolean;
  dynamicRendering: boolean;
}

export const useSeoOptimization = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [task, setTask] = useState<any>(null);
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({
    maxPages: 10000,
    followExternalLinks: false,
    analyzeMobile: true,
    optimizeImages: true,
    optimizeHeadings: true,
    optimizeMetaTags: true,
    optimizeContent: true,
    dynamicRendering: false,
  });

  const validateUrl = (input: string) => {
    try {
      const urlObject = new URL(input.startsWith('http') ? input : `https://${input}`);
      setIsValid(true);
      return urlObject.toString();
    } catch (e) {
      setIsValid(false);
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateUrl(value);
  };

  const toggleOption = (option: keyof AdvancedOptions) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const startOptimization = async () => {
    const formattedUrl = validateUrl(url);
    if (!formattedUrl) {
      toast({
        title: "Некорректный URL",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const aiSettings = openaiService.getSettings();

      const newTaskId = await seoOptimizationController.startOptimization(
        formattedUrl,
        {
          maxPages: advancedOptions.maxPages,
          maxDepth: 5,
          followExternalLinks: advancedOptions.followExternalLinks,
          userAgent: advancedOptions.analyzeMobile ? 
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' : 
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          checkPerformance: true
        },
        {
          optimizeMetaTags: advancedOptions.optimizeMetaTags,
          optimizeHeadings: advancedOptions.optimizeHeadings,
          optimizeContent: advancedOptions.optimizeContent,
          optimizeImages: advancedOptions.optimizeImages,
          temperature: aiSettings.temperature,
          max_tokens: aiSettings.max_tokens,
          contentQuality: aiSettings.content_quality,
          language: 'ru',
          model: openaiService.getModel() || 'gpt-4o'
        }
      );

      setTaskId(newTaskId);
      setTask({ status: 'started' });

      toast({
        title: "Оптимизация запущена",
        description: "Начинаем сканирование и оптимизацию сайта",
      });

      startPolling(newTaskId);
    } catch (error) {
      toast({
        title: "Ошибка запуска оптимизации",
        description: error instanceof Error ? error.message : "Не удалось запустить оптимизацию",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const taskStatus = await seoOptimizationController.getTaskStatus(taskId);
        
        if (taskStatus) {
          setTask(taskStatus);
          
          if (taskStatus.status === 'completed' || taskStatus.status === 'failed') {
            clearInterval(interval);
            
            if (taskStatus.status === 'completed') {
              toast({
                title: "Оптимизация завершена",
                description: "Сайт успешно оптимизирован и готов к публикации",
              });
            } else {
              toast({
                title: "Ошибка оптимизации",
                description: taskStatus.error || "Произошла ошибка при оптимизации сайта",
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error polling task status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  return {
    url,
    taskId,
    isLoading,
    isValid,
    task,
    advancedOptions,
    handleUrlChange,
    toggleOption,
    startOptimization,
    setAdvancedOptions,
  };
};
