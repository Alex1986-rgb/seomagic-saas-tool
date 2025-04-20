
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { formSchema, FormData } from './FormFields';
import { checkPositions } from '@/services/position/positionTracker';

export const usePositionTrackerForm = (onSearchComplete?: Function) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputKeyword, setInputKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      searchEngine: "all",
      region: "",
      keywords: [],
      depth: 30,
      useProxy: false,
      scanFrequency: "once",
    },
  });

  const addKeyword = () => {
    if (inputKeyword.trim()) {
      setKeywords([...keywords, inputKeyword.trim()]);
      form.setValue("keywords", [...keywords, inputKeyword.trim()]);
      setInputKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
    form.setValue("keywords", newKeywords);
  };

  const handleBulkKeywords = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text.trim()) return;
    
    const keywordList = text.split(/\r?\n/).filter(k => k.trim());
    setKeywords([...keywordList]);
    form.setValue("keywords", keywordList);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const keywordList = text.split(/\r?\n/).filter(k => k.trim());
        setKeywords([...new Set([...keywords, ...keywordList])]);
        form.setValue("keywords", [...new Set([...keywords, ...keywordList])]);
        toast({
          title: "Файл загружен",
          description: `Добавлено ${keywordList.length} ключевых слов`,
        });
      } catch (error) {
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось прочитать файл",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const onSubmit = async (values: FormData) => {
    if (keywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы один ключевой запрос для проверки",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const searchData = {
        domain: values.domain,
        keywords: keywords,
        searchEngine: values.searchEngine,
        region: values.region,
        depth: values.depth,
        scanFrequency: values.scanFrequency,
        useProxy: values.useProxy,
        timestamp: new Date().toISOString()
      };
      
      const results = await checkPositions(searchData);
      
      toast({
        title: "Проверка завершена",
        description: `Проверено ${keywords.length} ключевых запросов в ${values.searchEngine === 'all' ? 'нескольких поисковых системах' : values.searchEngine}`,
      });
      
      if (onSearchComplete) {
        onSearchComplete(results);
      }
    } catch (error) {
      toast({
        title: "Ошибка при проверке позиций",
        description: error.message || "Произошла неизвестная ошибка",
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
    removeKeyword,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit
  };
};
