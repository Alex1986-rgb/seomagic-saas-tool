
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PromptSelectorProps {
  seoPrompt: string;
  selectedPromptTemplate: string;
  promptTemplates: Array<{
    id: string;
    name: string;
    prompt: string;
  }>;
  onSeoPromptChange: (prompt: string) => void;
  onPromptTemplateChange: (value: string) => void;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({
  seoPrompt,
  selectedPromptTemplate,
  promptTemplates,
  onSeoPromptChange,
  onPromptTemplateChange
}) => {
  return (
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
    </div>
  );
};

export default PromptSelector;
