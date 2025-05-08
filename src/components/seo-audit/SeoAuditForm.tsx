
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { validationService } from "@/services/validation/validationService";

interface SeoAuditFormProps {
  onStartAudit: (url: string) => void;
  isLoading?: boolean;
}

const SeoAuditForm: React.FC<SeoAuditFormProps> = ({ onStartAudit, isLoading = false }) => {
  const [url, setUrl] = useState<string>('');
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
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
          title: "Запуск аудита",
          description: `Анализируем сайт: ${formattedUrl}`,
        });
        
        // Start the progress animation
        animateProgress();
        
        // Trigger the audit
        onStartAudit(formattedUrl);
      } catch (error) {
        console.error("Audit error:", error);
        toast({
          title: "Ошибка аудита",
          description: "Произошла ошибка при запуске аудита. Попробуйте еще раз.",
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
  
  // Animate progress for loading state
  const animateProgress = () => {
    if (!isLoading) return;
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 1;
      });
    }, 100);
    
    return () => clearInterval(interval);
  };
  
  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Начните SEO аудит</h2>
          <p className="text-muted-foreground">Введите URL вашего сайта для получения детального SEO анализа</p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center">
            <div className="absolute left-3">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <Input
              type="text"
              placeholder="Введите URL вашего сайта"
              value={url}
              onChange={handleInputChange}
              className={`pl-10 h-12 pr-24 text-base ${!isUrlValid ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
              aria-invalid={!isUrlValid}
              disabled={isLoading}
            />
            
            <Button 
              type="submit" 
              className="absolute right-1 h-10"
              aria-label="Начать аудит"
              disabled={isLoading}
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
        
        {isLoading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Анализ сайта...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Пожалуйста, подождите. Наша система анализирует структуру и содержимое вашего сайта для предоставления детального SEO аудита.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoAuditForm;
