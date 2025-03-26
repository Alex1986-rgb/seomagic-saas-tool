
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Text, MessageSquare, Sparkles, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContentOptimizationPromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  className?: string;
}

const ContentOptimizationPrompt: React.FC<ContentOptimizationPromptProps> = ({
  prompt,
  setPrompt,
  className
}) => {
  const [localPrompt, setLocalPrompt] = useState(prompt);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalPrompt(e.target.value);
  };

  const handleApplyPrompt = () => {
    setPrompt(localPrompt);
  };

  const examplePrompts = [
    "Оптимизируй текст для SEO, используя ключевые слова из meta keywords. Сохрани основной смысл, но сделай содержание более релевантным для поисковых систем.",
    "Исправь все орфографические и грамматические ошибки. Сделай текст более читабельным, разбив длинные предложения на короткие.",
    "Добавь призывы к действию в конце каждой страницы. Сделай текст более убедительным для потенциальных клиентов.",
    "Оптимизируй альтернативные описания изображений, используя ключевые слова из контекста страницы."
  ];

  const handleUseExample = (example: string) => {
    setLocalPrompt(example);
  };

  return (
    <motion.div
      className={`border border-primary/20 rounded-lg p-4 bg-card/50 ${className || ''}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Text className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Промпт для оптимизации контента</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <p>
                Задайте инструкции для ИИ, который будет оптимизировать контент вашего сайта.
                Промпт будет применен ко всем текстам, мета-описаниям и альтернативным текстам изображений.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Textarea
        placeholder="Введите инструкции для оптимизации контента, например: 'Оптимизируй тексты для SEO, исправь грамматические ошибки, добавь ключевые слова...'"
        value={localPrompt}
        onChange={handlePromptChange}
        className="min-h-32 mb-3"
      />

      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Примеры промптов:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleUseExample(example)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Пример {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleApplyPrompt}
          className="gap-2"
          disabled={!localPrompt.trim()}
        >
          <Sparkles className="h-4 w-4" />
          Применить промпт
        </Button>
      </div>
    </motion.div>
  );
};

export default ContentOptimizationPrompt;
