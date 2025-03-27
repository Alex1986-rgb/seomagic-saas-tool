
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Text, MessageSquare, Sparkles, Info, Gift, BookOpen, Lightbulb, PenSquare } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("editor");

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

  const advancedPrompts = [
    "Добавь ключевые фразы в первый и последний абзацы страниц. Убедись, что плотность ключевых слов составляет 2-3%. Используй LSI-ключи (латентно-семантические ключи) для обогащения содержания.",
    "Переработай все H1, H2 и H3 заголовки для повышения их релевантности. Добавь ключевые слова в начало заголовков. Сделай структуру контента более логичной и иерархичной.",
    "Оптимизируй содержание для ответов на вопросы. Добавь разделы FAQ на каждую страницу, используя наиболее часто задаваемые вопросы по теме. Форматируй ответы в соответствии с требованиями для rich snippets.",
    "Сделай контент более информативным, добавляя важные статистические данные, цитаты экспертов и практические примеры. Увеличь глубину раскрытия темы на 30% без размытия фокуса."
  ];

  const templatePrompts = {
    ecommerce: "Оптимизируй описания товаров: добавь особенности, преимущества и решаемые проблемы. Включи ключевые запросы покупателей и технические характеристики. Структурируй информацию в виде маркированных списков для лучшей читаемости.",
    blog: "Обогати контент актуальными статистическими данными и цитатами экспертов. Начинай каждый раздел с важного тезиса. Оптимизируй под пользовательские намерения: информационные, транзакционные или навигационные запросы.",
    services: "Выдели уникальные преимущества сервиса. Сделай акцент на выгодах для клиента, а не только на функциях. Добавь убедительные призывы к действию и социальные доказательства (отзывы, кейсы, результаты).",
    local: "Добавь локационные ключевые слова в заголовки и текст. Включи местные особенности и релевантную для региона информацию. Оптимизируй для локального поиска с упоминанием районов, достопримечательностей и географических маркеров."
  };

  const handleUseExample = (example: string) => {
    setLocalPrompt(example);
  };

  return (
    <motion.div
      className={`border border-primary/20 rounded-lg p-4 bg-card/70 ${className || ''}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Text className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Промпт для оптимизации контента</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent 
              className="max-w-md text-foreground bg-popover border border-border" 
              side="top" 
              align="center"
            >
              <p>
                Задайте инструкции для ИИ, который будет оптимизировать контент вашего сайта.
                Промпт будет применен ко всем текстам, мета-описаниям и альтернативным текстам изображений.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center gap-1">
            <PenSquare className="h-4 w-4" />
            <span>Редактор</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>Примеры</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            <span>Шаблоны</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-4">
          <Textarea
            placeholder="Введите инструкции для оптимизации контента, например: 'Оптимизируй тексты для SEO, исправь грамматические ошибки, добавь ключевые слова...'"
            value={localPrompt}
            onChange={handlePromptChange}
            className="min-h-32 mb-3 bg-background/50 text-foreground placeholder:text-muted-foreground"
          />
        </TabsContent>
        
        <TabsContent value="examples" className="mt-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Базовые промпты:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs text-foreground"
                  onClick={() => handleUseExample(example)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Пример {index + 1}
                </Button>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">Продвинутые стратегии:</p>
            <div className="flex flex-wrap gap-2">
              {advancedPrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs text-foreground"
                  onClick={() => handleUseExample(example)}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Стратегия {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border rounded p-3 hover:bg-secondary/10 cursor-pointer" onClick={() => handleUseExample(templatePrompts.ecommerce)}>
              <h4 className="text-sm font-medium mb-1">Интернет-магазин</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{templatePrompts.ecommerce}</p>
            </div>
            <div className="border rounded p-3 hover:bg-secondary/10 cursor-pointer" onClick={() => handleUseExample(templatePrompts.blog)}>
              <h4 className="text-sm font-medium mb-1">Блог и контент-сайты</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{templatePrompts.blog}</p>
            </div>
            <div className="border rounded p-3 hover:bg-secondary/10 cursor-pointer" onClick={() => handleUseExample(templatePrompts.services)}>
              <h4 className="text-sm font-medium mb-1">Сайт услуг</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{templatePrompts.services}</p>
            </div>
            <div className="border rounded p-3 hover:bg-secondary/10 cursor-pointer" onClick={() => handleUseExample(templatePrompts.local)}>
              <h4 className="text-sm font-medium mb-1">Локальный бизнес</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{templatePrompts.local}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

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
