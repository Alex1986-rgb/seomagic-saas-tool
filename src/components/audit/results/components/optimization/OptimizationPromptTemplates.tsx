
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "general_seo",
    name: "Общая SEO оптимизация",
    description: "Улучшение мета-тегов, заголовков и контента для повышения рейтинга в поиске",
    prompt: "Оптимизируй все тексты для поисковых систем, добавь ключевые слова и улучши читаемость. Убедись, что все заголовки содержат ключевые слова, а описания привлекательны для пользователей."
  },
  {
    id: "meta_tags",
    name: "Оптимизация мета-тегов",
    description: "Улучшение title, description и keywords для лучшего ранжирования",
    prompt: "Улучши все мета-заголовки и мета-описания. Добавь ключевые слова в Title теги. Убедись, что длина Title не превышает 60 символов, а Description находится в пределах 150-160 символов."
  },
  {
    id: "content_enrichment",
    name: "Обогащение контента",
    description: "Расширение текста и улучшение его структуры",
    prompt: "Расширь и обогати текстовый контент на всех страницах. Добавь тематические ключевые слова, улучши структуру с помощью подзаголовков (H2, H3), добавь списки и таблицы где уместно."
  },
  {
    id: "technical_seo",
    name: "Техническая оптимизация",
    description: "Исправление технических SEO-проблем",
    prompt: "Исправь все технические проблемы: добавь атрибуты alt к изображениям, оптимизируй внутренние ссылки, исправь структуру URL, добавь микроразметку Schema.org для улучшения отображения в поиске."
  },
  {
    id: "keyword_density",
    name: "Плотность ключевых слов",
    description: "Оптимизация распределения ключевых слов в текстах",
    prompt: "Оптимизируй плотность ключевых слов в текстах. Добавь ключевые слова в первый и последний абзацы, в заголовки. Убедись, что плотность основных ключевых слов составляет 1-3%."
  },
  {
    id: "local_seo",
    name: "Локальная оптимизация",
    description: "Улучшение видимости сайта в местном поиске",
    prompt: "Оптимизируй контент для локального поиска. Добавь упоминания местоположения, района и региона. Убедись, что контактная информация представлена структурированно и легко доступна."
  },
  {
    id: "ecommerce_seo",
    name: "Оптимизация для интернет-магазина",
    description: "Специальная оптимизация для товаров и категорий",
    prompt: "Оптимизируй страницы товаров, добавь подробные описания, технические характеристики, отзывы. Улучши категории и навигацию. Добавь микроразметку для товаров и цен."
  },
  {
    id: "mobile_optimization",
    name: "Мобильная оптимизация",
    description: "Адаптация контента для мобильных устройств",
    prompt: "Оптимизируй контент для мобильных устройств. Сократи длинные абзацы, используй более короткие предложения, увеличь размер шрифта где необходимо."
  },
  {
    id: "readability",
    name: "Улучшение читаемости",
    description: "Повышение читабельности и понятности текстов",
    prompt: "Повысь читаемость всех текстов. Разбей длинные абзацы, используй подзаголовки, списки, выделение важных фраз. Упрости сложные предложения, избегай технического жаргона где это возможно."
  },
  {
    id: "social_optimization",
    name: "Оптимизация для соцсетей",
    description: "Улучшение представления сайта в социальных сетях",
    prompt: "Добавь метатеги для социальных сетей (Open Graph, Twitter Cards), оптимизируй заголовки и описания для шеринга в социальных сетях."
  }
];

interface OptimizationPromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
  disabled?: boolean;
}

const OptimizationPromptTemplates: React.FC<OptimizationPromptTemplatesProps> = ({ 
  onSelectPrompt,
  className = "",
  disabled = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template.id);
    onSelectPrompt(template.prompt);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium mb-2">Выберите шаблон для оптимизации:</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {promptTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="col-span-1"
          >
            <Card 
              className={`p-3 h-full cursor-pointer border transition-all ${
                selectedTemplate === template.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => !disabled && handleSelectTemplate(template)}
            >
              <div className="flex justify-between items-start mb-1">
                <h5 className="font-medium text-sm">{template.name}</h5>
                {selectedTemplate === template.id && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OptimizationPromptTemplates;
