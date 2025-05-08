
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Lightbulb, Tag, Search, FileText, ArrowRight } from 'lucide-react';

interface ContentPromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'meta' | 'content' | 'seo' | 'readability' | 'conversion';
  icon?: React.ReactNode;
}

interface ContentPromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

const ContentPromptTemplates: React.FC<ContentPromptTemplatesProps> = ({ 
  onSelectPrompt,
  className = ''
}) => {
  const promptTemplates: ContentPromptTemplate[] = [
    {
      id: 'meta-1',
      title: 'Оптимизация мета-тегов для SEO',
      description: 'Улучшает мета-заголовки и описания для лучшего ранжирования в поиске',
      prompt: 'Оптимизируй все мета-теги title и description на страницах сайта для улучшения SEO. Используй ключевые слова естественным образом, учти длину тегов (до 60 символов для title и до 160 для description). Добавь призыв к действию в meta description где уместно.',
      category: 'meta',
      icon: <Tag className="h-4 w-4" />
    },
    {
      id: 'meta-2',
      title: 'Локализация мета-тегов',
      description: 'Адаптирует мета-теги под русскоязычную аудиторию',
      prompt: 'Оптимизируй мета-теги title и description для русскоязычной аудитории. Используй релевантные региональные ключевые слова, адаптируй описания под местные поисковые системы (Яндекс, Google.ru) и учитывай культурный контекст.',
      category: 'meta',
      icon: <Tag className="h-4 w-4" />
    },
    {
      id: 'content-1',
      title: 'Улучшение читабельности текста',
      description: 'Делает текст более простым для восприятия',
      prompt: 'Улучши читабельность всех текстов на сайте. Используй короткие абзацы (до 3-4 предложений), добавь подзаголовки H2 и H3 каждые 300-400 слов, используй маркированные списки для перечислений, упрости сложные предложения.',
      category: 'readability',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 'content-2',
      title: 'Оптимизация контента под SEO',
      description: 'Улучшает текст для лучшего ранжирования в поиске',
      prompt: 'Оптимизируй контент всех страниц для SEO. Добавь ключевые слова в заголовки H1-H3, первый и последний абзацы, увеличь плотность ключевых слов до 2-3%, добавь синонимы и LSI-ключи. Сохрани естественность текста для читателей.',
      category: 'seo',
      icon: <Search className="h-4 w-4" />
    },
    {
      id: 'seo-1',
      title: 'Оптимизация для голосового поиска',
      description: 'Адаптирует контент под вопросы голосового поиска',
      prompt: 'Оптимизируй контент сайта для голосового поиска. Добавь вопросно-ответные блоки (FAQ) с длинными хвостами запросов, используй естественный разговорный язык, отвечай на вопросы Кто? Что? Где? Когда? Почему? и Как?',
      category: 'seo',
      icon: <Search className="h-4 w-4" />
    },
    {
      id: 'conversion-1',
      title: 'Усиление конверсионных элементов',
      description: 'Улучшает тексты для увеличения конверсии',
      prompt: 'Улучши конверсионные элементы на всех страницах. Сделай заголовки более убедительными, добавь социальные доказательства (цифры, отзывы), усиль призывы к действию (CTA), подчеркни выгоды вместо характеристик, создай ощущение срочности где уместно.',
      category: 'conversion',
      icon: <ArrowRight className="h-4 w-4" />
    },
    {
      id: 'conversion-2',
      title: 'Оптимизация карточек товаров',
      description: 'Улучшает описания товаров для повышения продаж',
      prompt: 'Оптимизируй карточки товаров для повышения продаж. Сделай заголовки привлекательными, создай понятные и полные описания с акцентом на выгодах, добавь Уникальное торговое предложение (УТП), оптимизируй атрибуты товаров для фильтрации, добавь ответы на частые вопросы покупателей.',
      category: 'conversion',
      icon: <ArrowRight className="h-4 w-4" />
    },
    {
      id: 'seo-2',
      title: 'Оптимизация изображений',
      description: 'Улучшает alt-тексты и названия файлов изображений',
      prompt: 'Оптимизируй все изображения на сайте для SEO. Добавь alt-теги с ключевыми словами, переименуй файлы изображений с использованием ключевых слов через дефис, сожми изображения без потери качества, добавь атрибуты width и height для улучшения LCP.',
      category: 'seo',
      icon: <Search className="h-4 w-4" />
    },
    {
      id: 'readability-2',
      title: 'Адаптация для сканирующего чтения',
      description: 'Делает текст более удобным для беглого просмотра',
      prompt: 'Оптимизируй тексты для сканирующего чтения. Добавь информативные подзаголовки, выдели ключевые фразы жирным шрифтом, используй маркированные списки, добавь врезки с важной информацией, разбей длинные тексты на логические блоки с миниатюрами.',
      category: 'readability',
      icon: <FileText className="h-4 w-4" />
    },
  ];

  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Готовые шаблоны промтов для оптимизации
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-3">
            <TabsTrigger value="meta">Мета-теги</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="conversion">Конверсия</TabsTrigger>
          </TabsList>
          
          {['meta', 'content', 'seo', 'conversion'].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="space-y-3">
                {promptTemplates
                  .filter(template => template.category === category)
                  .map(template => (
                    <div 
                      key={template.id} 
                      className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onSelectPrompt(template.prompt)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium flex items-center gap-1.5">
                          {template.icon}
                          {template.title}
                        </h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPrompt(template.prompt);
                          }}
                        >
                          Использовать
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  ))
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentPromptTemplates;
