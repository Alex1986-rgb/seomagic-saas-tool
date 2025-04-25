
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, X, Settings, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { checkPositions } from '@/services/position/positionTracker';
import { useMobile } from '@/hooks/use-mobile';
import { useProxyManager } from '@/hooks/use-proxy-manager';
import { PositionTrackerSettings } from './PositionTrackerSettings';

// Схема валидации формы
const formSchema = z.object({
  domain: z.string().min(1, 'Введите домен'),
  searchEngine: z.string(),
  region: z.string().optional(),
  depth: z.number().min(10).max(200),
  scanFrequency: z.string(),
});

// Типы для пропсов и формы
export type FormData = z.infer<typeof formSchema>;

interface PositionTrackerFormProps {
  onSearchComplete?: (results: any) => void;
  initialDomain?: string;
  initialKeywords?: string[];
  initialSearchEngine?: string;
}

export const PositionTrackerForm: React.FC<PositionTrackerFormProps> = ({
  onSearchComplete,
  initialDomain = '',
  initialKeywords = [],
  initialSearchEngine = 'google'
}) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [keywordInput, setKeywordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useProxies, setUseProxies] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMobile = useMobile();
  const { activeProxies, isLoading: proxyLoading } = useProxyManager();

  // Форма react-hook-form с валидацией zod
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: initialDomain,
      searchEngine: initialSearchEngine,
      region: 'ru',
      depth: 100,
      scanFrequency: 'once'
    },
  });

  // Загружаем настройки при монтировании компонента
  useEffect(() => {
    const savedSettings = localStorage.getItem('position_tracker_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setUseProxies(settings.useProxy !== undefined ? settings.useProxy : true);
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    }
  }, []);

  // Обработка добавления ключевого слова
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  // Обработка удаления ключевого слова
  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  // Обработка отправки формы
  const onSubmit = async (data: FormData) => {
    if (keywords.length === 0) {
      form.setError('domain', { message: 'Добавьте хотя бы одно ключевое слово' });
      return;
    }

    setIsSubmitting(true);

    try {
      const results = await checkPositions({
        domain: data.domain, // Ensure domain is explicitly passed
        keywords,
        searchEngine: data.searchEngine,
        region: data.region,
        depth: data.depth,
        scanFrequency: data.scanFrequency,
        useProxy: useProxies && activeProxies.length > 0
      });
      
      if (onSearchComplete) {
        onSearchComplete(results);
      }
    } catch (error) {
      console.error('Error checking positions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработка изменения статуса использования прокси
  const handleUseProxiesChange = (checked: boolean) => {
    setUseProxies(checked);
    // Сохраняем настройку в localStorage
    try {
      const savedSettings = localStorage.getItem('position_tracker_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings.useProxy = checked;
      localStorage.setItem('position_tracker_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  // Компонент настроек в зависимости от устройства
  const SettingsComponent = () => (
    isMobile ? (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4">
            <PositionTrackerSettings onClose={() => setSettingsOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <PositionTrackerSettings onClose={() => setSettingsOpen(false)} />
        </DialogContent>
      </Dialog>
    )
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Домен</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="searchEngine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Поисковая система</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Выберите поисковик" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="yandex">Яндекс</SelectItem>
                        <SelectItem value="all">Все системы</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <SettingsComponent />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Регион</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите регион" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ru">Россия</SelectItem>
                      <SelectItem value="ru_moscow">Москва</SelectItem>
                      <SelectItem value="ru_spb">Санкт-Петербург</SelectItem>
                      <SelectItem value="ua">Украина</SelectItem>
                      <SelectItem value="by">Беларусь</SelectItem>
                      <SelectItem value="kz">Казахстан</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Глубина проверки</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Глубина поиска" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="10">10 позиций</SelectItem>
                      <SelectItem value="30">30 позиций</SelectItem>
                      <SelectItem value="50">50 позиций</SelectItem>
                      <SelectItem value="100">100 позиций</SelectItem>
                      <SelectItem value="200">200 позиций</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Ключевые слова</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Введите ключевое слово"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button type="button" onClick={handleAddKeyword} variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center space-x-2">
                <Switch 
                  id="use-proxies-check" 
                  checked={useProxies}
                  onCheckedChange={handleUseProxiesChange}
                />
                <FormLabel htmlFor="use-proxies-check" className="text-sm cursor-pointer">
                  Использовать прокси
                </FormLabel>
              </div>
              
              {useProxies && (
                <Badge 
                  variant="outline" 
                  className={activeProxies.length > 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}
                >
                  {activeProxies.length > 0 
                    ? `${activeProxies.length} прокси` 
                    : "Нет активных прокси"}
                </Badge>
              )}
            </div>

            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {keywords.map(keyword => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <Card className="p-4 text-sm text-center text-muted-foreground mt-4">
                Добавьте хотя бы одно ключевое слово для проверки позиций
              </Card>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting || keywords.length === 0} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          {isSubmitting ? "Проверка позиций..." : "Проверить позиции"}
        </Button>
      </form>
    </Form>
  );
};
