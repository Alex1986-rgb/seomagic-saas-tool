
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { positionTrackerFormSchema, type FormData } from './schema';
import { useKeywordsManager } from './useKeywordsManager';
import { useKeywordsInput } from './useKeywordsInput';
import { checkPositions } from '@/services/position/positionTracker';
import { useProxyManager } from '@/hooks/use-proxy-manager';

export const usePositionTrackerForm = (onSearchComplete?: Function) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { activeProxies } = useProxyManager();

  const form = useForm<FormData>({
    resolver: zodResolver(positionTrackerFormSchema),
    defaultValues: {
      domain: '',
      searchEngine: 'all',
      region: 'Москва',
      depth: 100,
      scanFrequency: 'once',
      useProxy: true,
    },
  });

  const {
    keywords,
    inputKeyword,
    setInputKeyword,
    addKeyword,
    addMultipleKeywords,
    removeKeyword,
    setKeywords
  } = useKeywordsManager();

  const { handleBulkKeywords, handleFileUpload } = useKeywordsInput({
    keywords,
    setKeywords,
  });

  const onSubmit = async (values: FormData) => {
    if (keywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одно ключевое слово",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Фильтруем пустые ключевые слова
      const filteredKeywords = keywords.filter(k => k && k.trim() !== '');
      
      if (filteredKeywords.length === 0) {
        throw new Error("Все ключевые слова пусты");
      }
      
      // Проверяем наличие прокси
      const hasActiveProxies = activeProxies && activeProxies.length > 0;
      
      if (values.useProxy && !hasActiveProxies) {
        toast({
          title: "Внимание",
          description: "Нет активных прокси. Проверка может быть менее точной.",
          variant: "default",
        });
      }
      
      // Форматируем домен
      let formattedDomain = values.domain;
      if (!formattedDomain.match(/^https?:\/\//)) {
        formattedDomain = 'http://' + formattedDomain;
      }
      
      // Удаляем trailing slash если он есть
      formattedDomain = formattedDomain.replace(/\/$/, '');
      
      // Извлекаем только домен без протокола для проверки
      const domainForCheck = formattedDomain.replace(/^https?:\/\//, '');
      
      // Используем реальный сервис проверки позиций
      const results = await checkPositions({
        domain: domainForCheck,
        keywords: filteredKeywords,
        searchEngine: values.searchEngine,
        region: values.region,
        depth: values.depth,
        scanFrequency: values.scanFrequency,
        useProxy: values.useProxy && hasActiveProxies
      });
      
      // Выводим информацию по найденным позициям
      const inTop10 = results.keywords.filter(k => k.position > 0 && k.position <= 10).length;
      const inTop30 = results.keywords.filter(k => k.position > 0 && k.position <= 30).length;
      const notFound = results.keywords.filter(k => k.position === 0).length;
      
      console.log(`Статистика позиций: TOP-10: ${inTop10}, TOP-30: ${inTop30}, не найдено: ${notFound}`);

      toast({
        title: "Успешно",
        description: `Проверено ${filteredKeywords.length} ключевых слов для ${domainForCheck}`,
      });

      if (onSearchComplete) {
        onSearchComplete(results);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить проверку позиций",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    keywords,
    inputKeyword,
    isLoading,
    setInputKeyword,
    addKeyword,
    addMultipleKeywords,
    removeKeyword,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit
  };
};
