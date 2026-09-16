import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoOptimizationController } from "@/services/api/seoOptimizationController";

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

      // Модель, температуру и длину ответа выбирает сервер (общий слой
      // supabase/functions/_shared/llm.ts, переменная LLM_PROVIDER). Раньше сюда
      // подставлялись настройки OpenAI из localStorage и «gpt-4o» по умолчанию —
      // контроллер их не читал, и выбор модели в браузере ни на что не влиял.
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
          language: 'ru',
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
              // Раньше здесь было «Сайт успешно оптимизирован и готов к
              // публикации», хотя сборки и выкладки исправленной копии сайта нет:
              // оптимизация готовит новые тексты и мета-теги страниц.
              toast({
                title: "Оптимизация завершена",
                description: "Новые тексты и мета-теги страниц готовы. Выгрузки исправленной копии сайта пока нет.",
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
