
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { validationService } from "@/services/validation/validationService";

const UrlForm: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>('');
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    // Reset validation state when user types
    if (!isUrlValid) {
      setIsUrlValid(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validationService.validateUrl(url);
    setIsUrlValid(isValid);
    
    if (isValid) {
      const formattedUrl = validationService.formatUrl(url);
      
      try {
        toast({
          title: "Переход к аудиту",
          description: `Анализируем сайт: ${formattedUrl}`,
        });
        // Ведём на /site-audit: именно там аудит запускается. Страница /audit
        // только показывает готовые результаты, и человек с главной попадал на
        // пустой экран с заголовком «Результаты SEO аудита».
        navigate(`/site-audit?url=${encodeURIComponent(formattedUrl)}`);
      } catch (error) {
        console.error("Navigation error:", error);
        toast({
          title: "Ошибка перехода",
          description: "Произошла ошибка при переходе к аудиту. Попробуйте еще раз.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Некорректный URL",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* На телефоне кнопка лежала поверх поля и закрывала половину строки:
          «Введите URL ва…» — дальше текст уезжал под кнопку. На узком экране
          ставим кнопку под полем, на широком оставляем внутри. */}
      <div className="flex flex-col gap-2 sm:relative sm:flex-row sm:items-center sm:gap-0">
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>

          <Input
            type="text"
            placeholder="Введите URL вашего сайта"
            value={url}
            onChange={handleInputChange}
            className={`pl-10 h-12 text-base sm:pr-40 ${!isUrlValid ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
            aria-invalid={!isUrlValid}
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full sm:absolute sm:right-1 sm:h-10 sm:w-auto"
          aria-label="Начать аудит"
        >
          Начать аудит <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {!isUrlValid && (
        <p className="text-sm text-destructive mt-1">
          Пожалуйста, введите корректный URL сайта
        </p>
      )}
      
      <div className="text-xs text-muted-foreground mt-2">
        Например: example.com или https://example.com
      </div>
    </form>
  );
};

export default UrlForm;
