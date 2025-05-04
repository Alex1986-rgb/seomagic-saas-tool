
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { positionTrackerFormSchema, type FormData } from './schema';
import { useKeywordsManager } from './useKeywordsManager';
import { useKeywordsInput } from './useKeywordsInput';
import { checkPositions } from '@/services/position/positionTracker';

export const usePositionTrackerForm = (onSearchComplete?: Function) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(positionTrackerFormSchema),
    defaultValues: {
      domain: '',
      searchEngine: 'all',
      region: 'Москва',
      depth: 100,
      scanFrequency: 'once',
      useProxy: false,
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
        useProxy: values.useProxy
      });

      toast({
        title: "Успешно",
        description: "Проверка позиций выполнена",
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
