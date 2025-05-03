
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useKeywordsManager = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputKeyword, setInputKeyword] = useState('');
  const { toast } = useToast();

  const addKeyword = (keyword?: string) => {
    // Use provided keyword or fall back to the inputKeyword state
    const trimmedKeyword = (keyword || inputKeyword).trim();
    
    if (!trimmedKeyword) {
      toast({
        title: "Ошибка",
        description: "Введите ключевое слово",
        variant: "destructive",
      });
      return;
    }

    if (keywords.includes(trimmedKeyword)) {
      toast({
        title: "Предупреждение",
        description: "Это ключевое слово уже добавлено",
        variant: "default",
      });
      return;
    }

    setKeywords([...keywords, trimmedKeyword]);
    setInputKeyword('');
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const clearKeywords = () => {
    setKeywords([]);
  };

  return {
    keywords,
    inputKeyword,
    setInputKeyword,
    addKeyword,
    removeKeyword,
    clearKeywords,
    setKeywords
  };
};
