
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

  const addMultipleKeywords = (newKeywords: string[]) => {
    if (newKeywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Список ключевых слов пуст",
        variant: "destructive",
      });
      return;
    }

    const uniqueKeywords = newKeywords.filter(kw => !keywords.includes(kw));
    
    if (uniqueKeywords.length === 0) {
      toast({
        title: "Предупреждение",
        description: "Все указанные ключевые слова уже добавлены",
        variant: "default",
      });
      return;
    }

    setKeywords([...keywords, ...uniqueKeywords]);
    setInputKeyword('');
    
    toast({
      title: "Добавлено",
      description: `Добавлено ${uniqueKeywords.length} ключевых слов`,
    });
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
    addMultipleKeywords,
    removeKeyword,
    clearKeywords,
    setKeywords
  };
};
