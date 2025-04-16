
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { firecrawlService, MassiveCrawlOptions } from '@/services/api/firecrawlService';
import { useToast } from "@/hooks/use-toast";
import { Rocket, Settings, Globe } from 'lucide-react';

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

      // Проверяем наличие API ключа
      const existingApiKey = await firecrawlService.getApiKey();
      if (!existingApiKey && !apiKey) {
        setShowApiKeyInput(true);
        toast({
          title: "API ключ не найден",
          description: "Пожалуйста, введите ваш API ключ для сервиса сканирования",
        });
        setIsLoading(false);
        return;
      }

      // Если пользователь ввел новый ключ, сохраняем его
      if (apiKey && apiKey !== existingApiKey) {
        await firecrawlService.setApiKey(apiKey);
      }

      // Настройки сканирования
      const options: Partial<MassiveCrawlOptions> = {
        maxPages,
        maxDepth,
        followExternalLinks,
        crawlSpeed,
        includeMedia,
        respectRobotsTxt
      };

      // Запускаем сканирование
      const result = await firecrawlService.startMassiveCrawl(projectId, url, options);

      if (result.success) {
        toast({
          title: "Сканирование запущено",
          description: `Задача #${result.taskId} создана. Процесс сканирования может занять продолжительное время.`,
        });
        onStartCrawl(result.taskId);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось запустить сканирование",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Ошибка при запуске сканирования:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при запуске сканирования",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-sm bg-card">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Настройка масштабного сканирования</h2>
      </div>

      <div className="space-y-4">
        {showApiKeyInput && (
          <div className="space-y-2">
            <Label htmlFor="api-key">API Ключ для сервиса сканирования</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите ваш API ключ"
            />
            <p className="text-sm text-muted-foreground">
              Вам необходим действующий API ключ для масштабного сканирования
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Максимальное количество страниц: {maxPages.toLocaleString('ru-RU')}</Label>
          <Slider
            value={[maxPages]}
            min={1000}
            max={1000000}
            step={1000}
            onValueChange={(values) => setMaxPages(values[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>Максимальная глубина сканирования: {maxDepth}</Label>
          <Slider
            value={[maxDepth]}
            min={5}
            max={100}
            step={5}
            onValueChange={(values) => setMaxDepth(values[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>Скорость сканирования</Label>
          <Select value={crawlSpeed} onValueChange={(value: 'slow' | 'medium' | 'fast') => setCrawlSpeed(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите скорость сканирования" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Медленная (меньше нагрузки на сервер)</SelectItem>
              <SelectItem value="medium">Средняя (оптимальный баланс)</SelectItem>
              <SelectItem value="fast">Быстрая (может повысить нагрузку)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="follow-external">Следовать по внешним ссылкам</Label>
          <Switch
            id="follow-external"
            checked={followExternalLinks}
            onCheckedChange={setFollowExternalLinks}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="include-media">Включать медиафайлы</Label>
          <Switch
            id="include-media"
            checked={includeMedia}
            onCheckedChange={setIncludeMedia}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="respect-robots">Учитывать robots.txt</Label>
          <Switch
            id="respect-robots"
            checked={respectRobotsTxt}
            onCheckedChange={setRespectRobotsTxt}
          />
        </div>
      </div>

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
  );
};
