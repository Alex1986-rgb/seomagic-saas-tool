
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

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
  return (
    <div className={`border border-primary/20 rounded-lg p-4 ${className || ''}`}>
      <h3 className="text-lg font-medium mb-2">Промпт для AI-оптимизации контента</h3>
      
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Опишите желаемые улучшения для SEO-оптимизации вашего сайта... Например: 'Оптимизировать мета-теги для лучшего ранжирования, улучшить заголовки H1-H3, добавить alt-теги к изображениям, оптимизировать внутренние ссылки'"
        className="min-h-20 mb-3"
      />
      
      <div className="flex justify-end">
        {onOptimize && (
          <Button onClick={onOptimize} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Запустить оптимизацию
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentOptimizationPrompt;
