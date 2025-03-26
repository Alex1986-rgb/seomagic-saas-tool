
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Search, FileText, TrendingUp } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
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
        <h2 className="text-4xl font-bold mb-6">Почему выбирают нас</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Наш сервис предоставляет комплексное решение для SEO-оптимизации
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Глубокий анализ" 
          description="Комплексная проверка более 100 параметров SEO-оптимизации вашего сайта"
          icon={<Search className="w-6 h-6" />}
        />
        <FeatureCard 
          title="Умные рекомендации" 
          description="Автоматически генерируемые рекомендации на основе анализа вашего сайта"
          icon={<FileText className="w-6 h-6" />}
        />
        <FeatureCard 
          title="Отслеживание прогресса" 
          description="Мониторинг изменений и эффективности внедренных оптимизаций"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
