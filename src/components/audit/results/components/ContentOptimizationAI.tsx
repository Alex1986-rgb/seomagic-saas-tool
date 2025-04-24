
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { openaiService } from '@/services/api/openaiService';
import { useToast } from '@/hooks/use-toast';
import ContentOptimizationPrompt from './ContentOptimizationPrompt';

interface ContentOptimizationAIProps {
  url: string;
  onOptimizationStart: () => void;
  onOptimizationComplete: (results: any) => void;
}

const ContentOptimizationAI: React.FC<ContentOptimizationAIProps> = ({
  url,
  onOptimizationStart,
  onOptimizationComplete
}) => {
  const [prompt, setPrompt] = useState<string>(
    "Оптимизировать мета-теги, заголовки и контент для повышения SEO рейтинга"
  );
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const checkApiKey = (): boolean => {
    const apiKey = openaiService.getApiKey();
    if (!apiKey) {
      toast({
        title: "API ключ OpenAI не настроен",
        description: "Пожалуйста, настройте API ключ в панели администратора",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  const handleOptimize = async () => {
    if (!checkApiKey()) return;
    
    setIsLoading(true);
    onOptimizationStart();
    
    try {
      toast({
        title: "Оптимизация начата",
        description: "Анализ и оптимизация контента с помощью OpenAI",
      });
      
      // Здесь будет вызов функции для оптимизации
      // Заглушка для демонстрации интерфейса
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        optimizedMetaTags: true,
        optimizedHeadings: true,
        optimizedContent: true,
        recommendations: [
          "Добавлены ключевые слова в мета-теги",
          "Улучшены заголовки H1 и H2",
          "Оптимизирован контент для лучшего SEO"
        ]
      };
      
      onOptimizationComplete(mockResults);
      
      toast({
        title: "Оптимизация завершена",
        description: "Контент успешно оптимизирован с помощью OpenAI",
      });
    } catch (error) {
      console.error("Ошибка при оптимизации:", error);
      toast({
        title: "Ошибка оптимизации",
        description: "Не удалось выполнить оптимизацию с помощью OpenAI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg overflow-hidden">
      <CardHeader className="bg-black/20 border-b border-white/10">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI оптимизация контента
        </CardTitle>
        <CardDescription>
          Используйте OpenAI для анализа и оптимизации контента вашего сайта
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {!openaiService.getApiKey() ? (
          <div className="flex items-start gap-3 p-4 bg-yellow-900/20 rounded-md border border-yellow-700/30">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-300 mb-1">API ключ OpenAI не настроен</h4>
              <p className="text-sm text-yellow-200/70">
                Для использования AI оптимизации необходимо настроить API ключ OpenAI в панели администратора.
              </p>
              <Button 
                variant="link" 
                className="p-0 h-auto text-yellow-400 mt-2"
                onClick={() => window.location.href = '/admin/settings/openai'}
              >
                Перейти к настройкам
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 bg-green-900/20 rounded-md border border-green-700/30">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-300 mb-1">API ключ OpenAI настроен</h4>
              <p className="text-sm text-green-200/70">
                Вы можете использовать AI для автоматической оптимизации контента
              </p>
            </div>
          </div>
        )}
        
        {isConfiguring ? (
          <ContentOptimizationPrompt 
            prompt={prompt}
            setPrompt={setPrompt}
            onOptimize={() => {
              setIsConfiguring(false);
              handleOptimize();
            }}
          />
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            <Button 
              className="flex-1"
              onClick={() => setIsConfiguring(true)}
              disabled={!openaiService.getApiKey() || isLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Настроить оптимизацию
            </Button>
            
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleOptimize}
              disabled={!openaiService.getApiKey() || isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Оптимизация...
                </span>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Оптимизировать контент
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentOptimizationAI;
