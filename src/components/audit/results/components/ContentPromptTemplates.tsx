
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, Text, FileText, Image, List, Link as LinkIcon, Globe, ShoppingCart, MessageSquare } from 'lucide-react';

interface ContentPromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
  disabled?: boolean;
}

const ContentPromptTemplates: React.FC<ContentPromptTemplatesProps> = ({ onSelectPrompt, className, disabled = false }) => {
  const templates = {
    meta: [
      { 
        title: "Оптимизация мета-тегов", 
        icon: <Heading className="h-4 w-4" />,
        prompt: "Улучшить все мета-теги (title, description) на страницах сайта. Сделать их более привлекательными для пользователей, включить ключевые слова естественным образом, соблюдать оптимальную длину (50-60 символов для заголовков, 150-160 для описаний). Не использовать дубликаты мета-тегов на разных страницах."
      },
      { 
        title: "Региональная оптимизация", 
        icon: <Globe className="h-4 w-4" />,
        prompt: "Оптимизировать мета-теги и контент для локального SEO, добавив названия регионов/городов в заголовки, описания и текст страниц. Улучшить локальную релевантность без спама и с сохранением естественности текста."
      },
    ],
    content: [
      { 
        title: "Общая SEO-оптимизация", 
        icon: <FileText className="h-4 w-4" />,
        prompt: "Оптимизировать контент для поисковых систем, улучшая структуру текста (заголовки h1-h3), добавляя ключевые слова естественным образом, увеличивая релевантность, удаляя лишний текст и делая контент более информативным и полезным для пользователей. Сохранить основной смысл и информационную ценность."
      },
      { 
        title: "Коммерческая оптимизация", 
        icon: <ShoppingCart className="h-4 w-4" />,
        prompt: "Сделать тексты более продающими и убедительными, добавить призывы к действию, подчеркнуть выгоды и преимущества, сохраняя при этом ключевые слова для SEO. Добавить элементы доверия (гарантии, отзывы, сертификаты) и усилить коммерческие факторы."
      },
      { 
        title: "Информационная оптимизация", 
        icon: <Text className="h-4 w-4" />,
        prompt: "Улучшить информационные статьи, добавив больше полезной информации, создать логичную структуру с подзаголовками, добавить списки и таблицы для лучшего восприятия, включить ответы на частые вопросы пользователей, устранить воду и сделать текст максимально полезным."
      },
    ],
    elements: [
      { 
        title: "Оптимизация изображений", 
        icon: <Image className="h-4 w-4" />,
        prompt: "Создать информативные и релевантные alt-теги для всех изображений, содержащие ключевые слова, где это уместно. Исправить описания изображений, делая их более точными и полезными как для SEO, так и для доступности сайта."
      },
      { 
        title: "Списки и таблицы", 
        icon: <List className="h-4 w-4" />,
        prompt: "Преобразовать сплошные блоки текста в более структурированный формат с использованием маркированных и нумерованных списков, а также таблиц, где это уместно. Выделить ключевые пункты и сравнения для улучшения восприятия информации и SEO."
      },
      { 
        title: "Внутренняя перелинковка", 
        icon: <LinkIcon className="h-4 w-4" />,
        prompt: "Улучшить внутреннюю перелинковку, добавляя релевантные ссылки между страницами с использованием анкоров с ключевыми словами. Организовать логичную структуру ссылок, создать иерархию страниц и облегчить навигацию по сайту."
      },
    ],
    special: [
      { 
        title: "FAQ-блоки", 
        icon: <MessageSquare className="h-4 w-4" />,
        prompt: "Создать блоки FAQ (часто задаваемые вопросы) на основе контента страниц. Сформулировать вопросы, которые могут интересовать пользователей, и дать на них четкие, информативные ответы. Использовать разметку schema.org для FAQ-блоков."
      },
      { 
        title: "Комплексная оптимизация", 
        icon: <FileText className="h-4 w-4" />,
        prompt: "Выполнить комплексную SEO-оптимизацию всего контента: мета-теги, заголовки, основной текст, изображения, списки, таблицы и внутренние ссылки. Сохранить уникальность и смысл текста, сделать его более структурированным, информативным и оптимизированным для поисковых систем. Добавить микроразметку schema.org где уместно."
      },
    ]
  };

  return (
    <div className={`border border-muted p-4 rounded-lg bg-muted/30 ${className || ''}`}>
      <h4 className="text-base font-medium mb-3">Готовые шаблоны промптов</h4>
      
      <Tabs defaultValue="meta">
        <TabsList className="mb-4">
          <TabsTrigger value="meta">Мета-теги</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="elements">Элементы</TabsTrigger>
          <TabsTrigger value="special">Специальные</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-64">
          <TabsContent value="meta" className="mt-0 space-y-3">
            {templates.meta.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSelectPrompt(template.prompt)}
                className="w-full justify-start text-left h-auto py-3 px-4"
                disabled={disabled}
              >
                <div className="mr-2">{template.icon}</div>
                <div>
                  <div className="font-medium">{template.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{template.prompt.substring(0, 90)}...</div>
                </div>
              </Button>
            ))}
          </TabsContent>
          
          <TabsContent value="content" className="mt-0 space-y-3">
            {templates.content.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSelectPrompt(template.prompt)}
                className="w-full justify-start text-left h-auto py-3 px-4"
                disabled={disabled}
              >
                <div className="mr-2">{template.icon}</div>
                <div>
                  <div className="font-medium">{template.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{template.prompt.substring(0, 90)}...</div>
                </div>
              </Button>
            ))}
          </TabsContent>
          
          <TabsContent value="elements" className="mt-0 space-y-3">
            {templates.elements.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSelectPrompt(template.prompt)}
                className="w-full justify-start text-left h-auto py-3 px-4"
                disabled={disabled}
              >
                <div className="mr-2">{template.icon}</div>
                <div>
                  <div className="font-medium">{template.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{template.prompt.substring(0, 90)}...</div>
                </div>
              </Button>
            ))}
          </TabsContent>
          
          <TabsContent value="special" className="mt-0 space-y-3">
            {templates.special.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSelectPrompt(template.prompt)}
                className="w-full justify-start text-left h-auto py-3 px-4"
                disabled={disabled}
              >
                <div className="mr-2">{template.icon}</div>
                <div>
                  <div className="font-medium">{template.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{template.prompt.substring(0, 90)}...</div>
                </div>
              </Button>
            ))}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ContentPromptTemplates;
