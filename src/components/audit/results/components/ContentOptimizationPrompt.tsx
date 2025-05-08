
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import ContentPromptTemplates from './ContentPromptTemplates';

interface ContentOptimizationPromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onOptimize?: () => void;
  className?: string;
}

const ContentOptimizationPrompt: React.FC<ContentOptimizationPromptProps> = ({
  prompt,
  setPrompt,
  onOptimize,
  className
}) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    // Scroll to the textarea
    setTimeout(() => {
      const textareaElement = document.getElementById('content-optimization-prompt');
      if (textareaElement) {
        textareaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className={`border border-primary/20 rounded-lg p-4 ${className || ''}`}>
      <h3 className="text-lg font-medium mb-2">Промпт для AI-оптимизации контента</h3>
      
      <Textarea
        id="content-optimization-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Опишите желаемые улучшения для SEO-оптимизации вашего сайта... Например: 'Оптимизировать мета-теги для лучшего ранжирования, улучшить заголовки H1-H3, добавить alt-теги к изображениям, оптимизировать внутренние ссылки'"
        className="min-h-20 mb-3"
      />
      
      <div className="flex flex-wrap justify-between items-center mb-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-1.5"
        >
          {showTemplates ? 'Скрыть шаблоны' : 'Показать готовые шаблоны'}
          {showTemplates ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {onOptimize && (
          <Button 
            onClick={onOptimize} 
            disabled={!prompt.trim()} 
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Запустить оптимизацию
          </Button>
        )}
      </div>
      
      {showTemplates && (
        <ContentPromptTemplates 
          onSelectPrompt={handleSelectPrompt}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default ContentOptimizationPrompt;
