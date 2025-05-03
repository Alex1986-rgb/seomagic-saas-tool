
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { positionTrackerFormSchema, type FormData } from './schema';
import { useKeywordsManager } from './useKeywordsManager';
import { useKeywordsInput } from './useKeywordsInput';

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
      await new Promise(resolve => setTimeout(resolve, 2000));

      const results = {
        domain: values.domain,
        keywords: keywords,
        searchEngine: values.searchEngine,
        region: values.region,
        depth: values.depth,
        scanFrequency: values.scanFrequency,
        positions: keywords.map(keyword => ({
          keyword,
          position: Math.floor(Math.random() * 100) + 1,
          url: `https://${values.domain}/page-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
          previousPosition: Math.floor(Math.random() * 100) + 1,
        })),
      };

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
