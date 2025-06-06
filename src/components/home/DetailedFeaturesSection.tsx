
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Wrench, 
  Globe, 
  BarChart3, 
  Users,
  Zap,
  Lock,
  Layers,
  Star,
  ArrowRight
} from 'lucide-react';
import DetailedFeatureCard from '../features/DetailedFeatureCard';

const DetailedFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Полное сканирование сайта',
      description: 'Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем и возможностей для улучшения.',
      link: '/features/site-scanning'
    },
    {
      icon: FileText,
      title: 'Анализ метаданных',
      description: 'Проверка тегов title, description и других метаданных для максимальной оптимизации поисковой выдачи.',
      link: '/features/metadata-analysis'
    },
    {
      icon: Zap,
      title: 'Проверка скорости загрузки',
      description: 'Анализ времени загрузки страниц и детальные рекомендации по увеличению скорости сайта.',
      link: '/features/speed-analysis'
    },
    {
      icon: Globe,
      title: 'Проверка мобильной версии',
      description: 'Тестирование адаптивности и удобства использования на мобильных устройствах и планшетах.',
      link: '/features/mobile-optimization'
    },
    {
      icon: BarChart3,
      title: 'Отслеживание позиций',
      description: 'Ежедневный мониторинг позиций вашего сайта в поисковых системах по ключевым словам.',
      link: '/features/position-tracking'
    },
    {
      icon: Users,
      title: 'Анализ конкурентов',
      description: 'Сравнение ваших позиций с конкурентами для определения оптимальной SEO-стратегии.',
      link: '/features/competitor-analysis'
    },
    {
      icon: Wrench,
      title: 'Автоматическое исправление',
      description: 'ИИ-powered автоматическое исправление найденных SEO-ошибок и оптимизация контента.',
      link: '/features/auto-fix'
    },
    {
      icon: Lock,
      title: 'Безопасность данных',
      description: 'Полная конфиденциальность и безопасность ваших данных с соблюдением GDPR.',
      link: '/features/security'
    },
    {
      icon: Layers,
      title: 'Интеграция с CMS',
      description: 'Совместимость с популярными CMS-системами: WordPress, Joomla, Drupal и другими.',
      link: '/features/cms-integration'
    },
    {
      icon: Star,
      title: 'Отчеты о производительности',
      description: 'Детальные отчеты о производительности и рейтинге вашего сайта с экспортом в PDF.',
      link: '/features/performance-reports'
    }
  ];

  return (
    <section className="py-20 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4 border border-primary/20">
            <Star className="w-4 h-4 mr-2 animate-pulse" />
            Возможности SeoMarket
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            <span className="relative inline-block">
              Подробные возможности
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Исследуйте полный набор функций, которые помогут вам проводить SEO-аудит, 
            отслеживать позиции и оптимизировать ваш сайт для поисковых систем.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <DetailedFeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
              index={index}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-4">
            Нужна помощь в выборе подходящих инструментов?
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Получить консультацию
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
