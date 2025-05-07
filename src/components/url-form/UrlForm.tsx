
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const UrlForm: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>('');
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  const { toast } = useToast();
  
  const validateUrl = (value: string): boolean => {
    if (!value.trim()) return false;
    
    // Simple URL validation (can be enhanced for more strict checking)
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return pattern.test(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateUrl(url);
    setIsUrlValid(isValid);
    
    if (isValid) {
      let formattedUrl = url;
      
      // Add https:// if the URL doesn't have a protocol
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      try {
        toast({
          title: "Переход к аудиту",
          description: `Анализируем сайт: ${formattedUrl}`,
        });
        navigate(`/audit?url=${encodeURIComponent(formattedUrl)}`);
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    // Reset validation state when user types
    if (!isUrlValid) {
      setIsUrlValid(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <Input
            type="text"
            placeholder="Введите URL вашего сайта"
            value={url}
            onChange={handleInputChange}
            className={`pl-10 h-12 text-base ${!isUrlValid ? 'border-destructive focus-visible:ring-destructive/30' : ''} pr-4 sm:pr-24`}
            aria-invalid={!isUrlValid}
          />
          
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-10 hidden sm:flex"
            aria-label="Начать аудит"
          >
            Начать аудит <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full sm:hidden h-10 mt-2"
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
