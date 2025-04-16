
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Rocket } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { firecrawlService } from '@/services/api/firecrawlService';
import { ApiKeyInput } from './config/ApiKeyInput';
import { CrawlOptionsForm } from './config/CrawlOptionsForm';

interface MassiveCrawlConfigProps {
  projectId: string;
  url: string;
  onStartCrawl: (taskId: string) => void;
}

export const MassiveCrawlConfig: React.FC<MassiveCrawlConfigProps> = ({
  projectId,
  url,
  onStartCrawl
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [maxPages, setMaxPages] = useState(100000);
  const [maxDepth, setMaxDepth] = useState(50);
  const [followExternalLinks, setFollowExternalLinks] = useState(false);
  const [crawlSpeed, setCrawlSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [includeMedia, setIncludeMedia] = useState(false);
  const [respectRobotsTxt, setRespectRobotsTxt] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      const existingKey = await firecrawlService.getApiKey();
      if (!existingKey) {
        setShowApiKeyInput(true);
      }
    };
    
    checkApiKey();
  }, []);

  const handleStartCrawl = async () => {
    if (!projectId || !url) {
      toast({
        title: "Ошибка конфигурации",
        description: "Проект или URL не указаны",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const existingApiKey = await firecrawlService.getApiKey();
      if (!existingApiKey && !apiKey) {
        setShowApiKeyInput(true);
        toast({
          title: "API ключ не найден",
          description: "Пожалуйста, введите ваш API ключ для сервиса сканирования",
        });
        return;
      }

      if (apiKey && apiKey !== existingApiKey) {
        await firecrawlService.setApiKey(apiKey);
      }

      const options = {
        maxPages,
        maxDepth,
        followExternalLinks,
        crawlSpeed,
        includeMedia,
        respectRobotsTxt
      };

      const result = await firecrawlService.startMassiveCrawl(projectId, url, options);

      if (result.success) {
        toast({
          title: "Сканирование запущено",
          description: `Задача #${result.taskId} создана. Процесс сканирования может занять продолжительное время.`,
        });
        onStartCrawl(result.taskId);
      }
    } catch (error) {
      console.error('Ошибка при запуске сканирования:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось запустить сканирование",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Настройка масштабного сканирования</h2>
      </div>

      <div className="space-y-4">
        {showApiKeyInput && (
          <ApiKeyInput 
            apiKey={apiKey} 
            onChange={setApiKey}
          />
        )}

        <CrawlOptionsForm
          maxPages={maxPages}
          maxDepth={maxDepth}
          followExternalLinks={followExternalLinks}
          crawlSpeed={crawlSpeed}
          includeMedia={includeMedia}
          respectRobotsTxt={respectRobotsTxt}
          onMaxPagesChange={setMaxPages}
          onMaxDepthChange={setMaxDepth}
          onFollowExternalLinksChange={setFollowExternalLinks}
          onCrawlSpeedChange={setCrawlSpeed}
          onIncludeMediaChange={setIncludeMedia}
          onRespectRobotsTxtChange={setRespectRobotsTxt}
        />

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            {showApiKeyInput ? "Скрыть настройки API" : "Настройки API"}
          </Button>

          <Button
            onClick={handleStartCrawl}
            disabled={isLoading}
            className="gap-2"
          >
            <Rocket className="h-4 w-4" />
            {isLoading ? "Запуск..." : "Запустить масштабное сканирование"}
          </Button>
        </div>
      </div>
    </div>
  );
};
