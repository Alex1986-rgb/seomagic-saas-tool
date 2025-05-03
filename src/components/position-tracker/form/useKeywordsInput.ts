
import { useToast } from '@/hooks/use-toast';

interface UseKeywordsInputProps {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

export const useKeywordsInput = ({ keywords, setKeywords }: UseKeywordsInputProps) => {
  const { toast } = useToast();

  const handleBulkKeywords = (text: string) => {
    if (!text) {
      toast({
        title: "Ошибка",
        description: "Введите ключевые слова",
        variant: "destructive",
      });
      return;
    }

    const lines = text.split('\n').filter(line => line.trim() !== '');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'txt' || fileExtension === 'csv') {
          const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
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

  return {
    handleBulkKeywords,
    handleFileUpload,
  };
};
