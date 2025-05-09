
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, BookOpen, CheckCircle, ExternalLink, FileBadge, FileCheck, Link2, Lightbulb } from 'lucide-react';

interface OptimizationSummaryProps {
  auditData?: any;
}

const OptimizationSummary: React.FC<OptimizationSummaryProps> = ({ auditData }) => {
  // Извлекаем или устанавливаем значения по умолчанию
  const improvements = [
    {
      id: 1,
      title: 'Исправление мета-тегов',
      description: 'Оптимизация title, description и keywords на всех страницах для лучшего индексирования',
      icon: FileBadge,
      color: 'text-blue-500'
    },
    {
      id: 2,
      title: 'Структура контента',
      description: 'Улучшение заголовков (H1-H6) и структуры текста по SEO-требованиям',
      icon: FileCheck,
      color: 'text-green-500'
    },
    {
      id: 3,
      title: 'Внутренняя перелинковка',
      description: 'Оптимизация внутренних ссылок для улучшения индексирования и пользовательского опыта',
      icon: Link2,
      color: 'text-amber-500'
    },
    {
      id: 4,
      title: 'Исправление ошибок',
      description: 'Устранение критических SEO-ошибок, влияющих на ранжирование',
      icon: AlertTriangle,
      color: 'text-red-500'
    },
    {
      id: 5,
      title: 'Оптимизация текстов',
      description: 'Улучшение содержания для увеличения релевантности и конверсии',
      icon: BookOpen,
      color: 'text-purple-500'
    },
    {
      id: 6,
      title: 'Рекомендации',
      description: 'Рекомендации для дальнейшей оптимизации и продвижения',
      icon: Lightbulb,
      color: 'text-yellow-500'
    }
  ];

  return (
    <Card className="border-primary/10 bg-primary/5">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
          Что включено в оптимизацию
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvements.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={item.id}
                className="flex items-start p-3 rounded-lg bg-background/80 border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`${item.color} mr-3 p-2 rounded-full bg-primary/10`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-base">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <ExternalLink className="h-4 w-4 mr-1" />
          <span>Полная оптимизация обеспечивает улучшение позиций в поисковых системах</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationSummary;
