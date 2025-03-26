
import React from 'react';
import { CheckCircle2, FileText, Globe, RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureList: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle2 size={24} className="text-primary" />,
      title: "Полный SEO аудит",
      description: "Глубокий анализ мета-тегов, заголовков, изображений, ссылок и многого другого для выявления всех SEO-проблем."
    },
    {
      icon: <FileText size={24} className="text-primary" />,
      title: "Подробные отчеты",
      description: "Получите комплексные PDF-отчеты с практическими рекомендациями и приоритизированными рекомендациями."
    },
    {
      icon: <Globe size={24} className="text-primary" />,
      title: "Оптимизированная копия сайта",
      description: "Получите полностью оптимизированную версию вашего сайта с улучшенными SEO-элементами."
    },
    {
      icon: <RefreshCw size={24} className="text-primary" />,
      title: "Сравнение До/После",
      description: "Увидьте разницу между вашим оригинальным сайтом и оптимизированной версией."
    },
    {
      icon: <ShieldCheck size={24} className="text-primary" />,
      title: "Технические SEO исправления",
      description: "Автоматическая генерация sitemap.xml, robots.txt и структурированных данных."
    },
    {
      icon: <Zap size={24} className="text-primary" />,
      title: "ИИ-рекомендации",
      description: "Интеллектуальные рекомендации для мета-заголовков, описаний и оптимизации контента."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeatureList;
