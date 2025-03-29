
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Loader2, DownloadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface OptimizeTabProps {
  seoPrompt: string;
  selectedPromptTemplate: string;
  promptTemplates: Array<{
    id: string;
    name: string;
    prompt: string;
  }>;
  isOptimizing: boolean;
  isCompleted: boolean;
  onSeoPromptChange: (prompt: string) => void;
  onPromptTemplateChange: (value: string) => void;
  onOptimize: () => void;
  onDownloadOptimized: () => void;
}

const OptimizeTab: React.FC<OptimizeTabProps> = ({
  seoPrompt,
  selectedPromptTemplate,
  promptTemplates,
  isOptimizing,
  isCompleted,
  onSeoPromptChange,
  onPromptTemplateChange,
  onOptimize,
  onDownloadOptimized
}) => {
  return (
    <motion.div
      className="mt-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        <div className="mb-2">
          <h3 className="text-sm font-medium mb-1">Выберите шаблон для SEO оптимизации</h3>
          <Select onValueChange={onPromptTemplateChange} value={selectedPromptTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите шаблон" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Выберите шаблон</SelectItem>
              {promptTemplates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-1">Опишите, как должен быть оптимизирован сайт</h3>
          <Textarea 
            placeholder="Например: Оптимизируй все тексты для SEO, добавь ключевые слова, улучши мета-теги и заголовки..."
            className="min-h-[100px]"
            value={seoPrompt}
            onChange={(e) => onSeoPromptChange(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={onOptimize}
          disabled={!seoPrompt.trim() || isOptimizing}
          className="w-full gap-2"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Оптимизация...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4" />
              Оптимизировать сайт с помощью ИИ
            </>
          )}
        </Button>
        
        {isOptimizing && (
          <div className="text-xs text-muted-foreground text-center animate-pulse">
            Оптимизация сайта с помощью ИИ. Это может занять несколько минут...
          </div>
        )}
        
        <Button 
          onClick={onDownloadOptimized}
          disabled={isOptimizing || !isCompleted}
          variant="outline"
          className="w-full gap-2"
        >
          <DownloadCloud className="h-4 w-4" />
          Скачать оптимизированную версию сайта
        </Button>
      </div>
    </motion.div>
  );
};

export default OptimizeTab;
