
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Search, FileText, TrendingUp, Globe, Sparkles, Gauge, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      title: "Глубокий анализ", 
      description: "Комплексная проверка более 100 параметров SEO-оптимизации вашего сайта",
      icon: <Search className="w-6 h-6" />
    },
    {
      title: "Умные рекомендации", 
      description: "Автоматически генерируемые рекомендации на основе анализа вашего сайта",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Отслеживание прогресса", 
      description: "Мониторинг изменений и эффективности внедренных оптимизаций",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "Высокая скорость", 
      description: "Моментальный анализ и предоставление результатов без долгого ожидания",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "Международный сервис", 
      description: "Анализ сайтов на различных языках с учетом региональных особенностей",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Производительность", 
      description: "Оценка скорости загрузки страниц и рекомендации по улучшению",
      icon: <Gauge className="w-6 h-6" />
    },
    {
      title: "Экспертная поддержка", 
      description: "Помощь экспертов по SEO для решения сложных проблем оптимизации",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Качество сервиса", 
      description: "Высокий уровень обслуживания и постоянное улучшение функциональности",
      icon: <Award className="w-6 h-6" />
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-32"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
          <Award className="w-4 h-4 mr-2" />
          Преимущества
        </div>
        <h2 className="font-playfair text-4xl font-bold mb-6">Почему выбирают нас</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Наш сервис предоставляет комплексное решение для SEO-оптимизации
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title} 
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
