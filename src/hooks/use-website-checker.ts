
import { useToast } from './use-toast';

export const useWebsiteChecker = () => {
  const { toast } = useToast();
  
  const checkWebsiteAccessibility = async (websiteUrl: string): Promise<boolean> => {
    // Имитируем проверку доступности сайта
    toast({
      title: "Проверка сайта",
      description: "Проверяем доступность сайта...",
    });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    const isAccessible = Math.random() > 0.1;
    
    if (!isAccessible) {
      toast({
        title: "Сайт недоступен",
        description: "Не удалось подключиться к сайту. Проверьте URL и попробуйте снова.",
        variant: "destructive",
      });
    }
    
    return isAccessible;
  };
  
  const runAnalysisStages = (
    onStageChange: (stage: number, description: string) => void,
    onComplete: () => void
  ) => {
    const stages = [
      "Проверка доступности сайта...",
      "Анализ структуры страницы...",
      "Проверка метаданных...",
      "Оценка мобильной версии...",
      "Формирование отчета..."
    ];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        onStageChange(currentStage, stages[currentStage]);
        currentStage++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 600);
    
    return () => clearInterval(interval);
  };

  return {
    checkWebsiteAccessibility,
    runAnalysisStages
  };
};

export default useWebsiteChecker;
