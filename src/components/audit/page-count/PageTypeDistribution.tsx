
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { PageStatistics } from './types';

// Переводы типов страниц
const pageTypeTranslations: Record<string, string> = {
  'product': 'Товары',
  'category': 'Категории',
  'blog': 'Блог',
  'contact': 'Контакты',
  'about': 'О нас',
  'faq': 'FAQ',
  'terms': 'Условия',
  'privacy': 'Политика',
  'other': 'Прочие'
};

interface PageTypeDistributionProps {
  pageStats: PageStatistics;
  pageCount: number;
}

const PageTypeDistribution: React.FC<PageTypeDistributionProps> = ({ pageStats, pageCount }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getPercentage = (part: number, total: number) => {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  };

  if (!pageStats.subpages || Object.keys(pageStats.subpages).length === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
      <div className="flex items-center mb-2">
        <BarChart3 className="h-4 w-4 text-primary mr-2" />
        <h4 className="text-sm font-medium">Распределение типов страниц</h4>
      </div>
      
      <div className="space-y-2">
        {Object.entries(pageStats.subpages)
          .filter(([, count]) => count > 0)
          .sort(([, a], [, b]) => b - a) // Сортировка по количеству страниц
          .map(([type, count]) => (
            <div key={type} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">{pageTypeTranslations[type] || type}</span>
                <span>{formatNumber(count)} стр. ({getPercentage(count, pageCount)}%)</span>
              </div>
              <Progress 
                value={getPercentage(count, pageCount)} 
                className={`h-1.5 ${
                  type === 'product' ? "bg-secondary [&>div]:bg-primary" : 
                  type === 'category' ? "bg-secondary [&>div]:bg-blue-500" :
                  type === 'blog' ? "bg-secondary [&>div]:bg-purple-500" :
                  "bg-secondary [&>div]:bg-secondary"
                }`}
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default PageTypeDistribution;
