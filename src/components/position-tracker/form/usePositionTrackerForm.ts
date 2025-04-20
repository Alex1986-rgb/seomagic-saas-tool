
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const formSchema = z.object({
  domain: z.string().min(1, { message: 'Доменное имя обязательно' }),
  searchEngine: z.enum(['google', 'yandex', 'mailru', 'all'], {
    required_error: 'Выберите поисковую систему',
  }),
  region: z.string().optional(),
  depth: z.coerce.number().min(10).max(1000).default(100),
  scanFrequency: z.enum(['once', 'daily', 'weekly', 'monthly']).default('once'),
  useProxy: z.boolean().default(false),
});

export const usePositionTrackerForm = (onSearchComplete?: Function) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputKeyword, setInputKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: '',
      searchEngine: 'all',
      region: 'Москва',
      depth: 100,
      scanFrequency: 'once',
      useProxy: false,
    },
  });

  // Add keyword to the list
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

  // Remove keyword from list
  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  // Handle bulk keywords input
  const handleBulkKeywords = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.trim();
    if (!text) {
      toast({
        title: "Ошибка",
        description: "Введите ключевые слова",
        variant: "destructive",
      });
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Filter out duplicates within the input and existing keywords
    const uniqueKeywords = lines.filter(
      (keyword, index, self) => 
        self.indexOf(keyword) === index && !keywords.includes(keyword)
    );

    if (uniqueKeywords.length > 0) {
      setKeywords([...keywords, ...uniqueKeywords]);
      toast({
        title: "Добавлено",
        description: `Добавлено ${uniqueKeywords.length} ключевых слов`,
      });
    } else {
      toast({
        title: "Внимание",
        description: "Нет новых ключевых слов для добавления",
        variant: "default",
      });
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'txt' || fileExtension === 'csv') {
          // Process as text file
          const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
          
          // Remove duplicates and existing keywords
          const uniqueKeywords = lines.filter(
            keyword => !keywords.includes(keyword.trim())
          );
          
          if (uniqueKeywords.length > 0) {
            setKeywords([...keywords, ...uniqueKeywords]);
            toast({
              title: "Файл загружен",
              description: `Добавлено ${uniqueKeywords.length} ключевых слов из файла`,
            });
          } else {
            toast({
              title: "Предупреждение",
              description: "В файле не найдено новых ключевых слов",
              variant: "default",
            });
          }
        } else {
          toast({
            title: "Ошибка",
            description: "Неподдерживаемый формат файла. Используйте .txt или .csv",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось обработать файл",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Example mock results
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
    removeKeyword,
    handleBulkKeywords,
    handleFileUpload,
    onSubmit
  };
};
