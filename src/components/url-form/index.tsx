
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Имитация анализа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Перенаправление на страницу аудита с URL в параметрах
      navigate(`/audit?url=${encodeURIComponent(url)}`);
      
      toast({
        title: "Анализ запущен",
        description: "Переходим к результатам анализа",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось запустить анализ. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Введите URL вашего сайта (например: https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="h-12 px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Анализ...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Анализировать
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UrlForm;
