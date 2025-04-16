
import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, FileText, BarChart } from 'lucide-react';
import FeatureItem from './FeatureItem';

const features = [
  {
    name: 'SEO Аудит',
    description: 'Полный анализ вашего сайта с рекомендациями по улучшению',
    icon: Search,
  },
  {
    name: 'Отслеживание позиций',
    description: 'Мониторинг позиций вашего сайта в поисковых системах',
    icon: TrendingUp,
  },
  {
    name: 'Подробные отчеты',
    description: 'Детальные отчеты с анализом и рекомендациями',
    icon: FileText,
  },
  {
    name: 'Аналитика',
    description: 'Анализ трафика и поведения пользователей',
    icon: BarChart,
  },
];

const FeatureGrid = () => {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Быстрее и эффективнее
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Все необходимое для SEO
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Комплексное решение для анализа и улучшения поисковой оптимизации вашего сайта
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureItem 
                key={feature.name} 
                feature={feature} 
                index={index}
              />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
