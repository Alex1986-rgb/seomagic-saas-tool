
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useKeywordsManager = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputKeyword, setInputKeyword] = useState('');
  const { toast } = useToast();

  const addKeyword = () => {
    const trimmedKeyword = inputKeyword.trim();
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
        title: "Внимание",
        description: "Это ключевое слово уже добавлено",
        variant: "default",
      });
      return;
    }

    setKeywords([...keywords, trimmedKeyword]);
    setInputKeyword('');
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  return {
    keywords,
    inputKeyword,
    setInputKeyword,
    addKeyword,
    removeKeyword,
    setKeywords,
  };
};
