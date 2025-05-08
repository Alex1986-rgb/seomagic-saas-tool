
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp, FileDown, Copy } from 'lucide-react';
import ContentPromptTemplates from './ContentPromptTemplates';
import { useToast } from "@/hooks/use-toast";

interface ContentOptimizationPromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onOptimize?: () => void;
  className?: string;
  disabled?: boolean;
  isOptimizing?: boolean;
}

const ContentOptimizationPrompt: React.FC<ContentOptimizationPromptProps> = ({
  prompt,
  setPrompt,
  onOptimize,
  className,
  disabled = false,
  isOptimizing = false
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const { toast } = useToast();

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    // Scroll to the textarea
    setTimeout(() => {
      const textareaElement = document.getElementById('content-optimization-prompt');
      if (textareaElement) {
        textareaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        textareaElement.focus();
      }
    }, 100);
    
    toast({
      title: "Шаблон выбран",
      description: "Вы можете отредактировать промпт под свои нужды",
    });
  };
  
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Скопировано",
      description: "Промпт скопирован в буфер обмена",
      duration: 3000,
    });
  };
  
  const handleExportPrompt = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-optimization-prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Промпт экспортирован",
      description: "Файл сохранен на ваше устройство",
      duration: 3000,
    });
  };

  return (
    <div className={`border border-primary/20 rounded-lg p-4 ${className || ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Промпт для AI-оптимизации контента</h3>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopyPrompt} 
            disabled={!prompt.trim() || disabled}
            title="Копировать промпт"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleExportPrompt} 
            disabled={!prompt.trim() || disabled}
            title="Экспортировать промпт"
          >
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Textarea
        id="content-optimization-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Опишите желаемые улучшения для SEO-оптимизации вашего сайта... Например: 'Оптимизировать мета-теги для лучшего ранжирования, улучшить заголовки H1-H3, добавить alt-теги к изображениям, оптимизировать внутренние ссылки'"
        className="min-h-28 mb-3"
        disabled={disabled}
      />
      
      <div className="flex flex-wrap justify-between items-center mb-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1.5"
          disabled={disabled}
        >
          {showTemplates ? 'Скрыть шаблоны' : 'Показать готовые шаблоны'}
          {showTemplates ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {onOptimize && (
          <Button 
            onClick={onOptimize} 
            disabled={!prompt.trim() || disabled || isOptimizing} 
            className="gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Оптимизация...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Запустить оптимизацию
              </>
            )}
          </Button>
        )}
      </div>
      
      {showTemplates && (
        <ContentPromptTemplates 
          onSelectPrompt={handleSelectPrompt}
          className="mt-4"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default ContentOptimizationPrompt;
