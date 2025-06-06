
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Zap, 
  Smartphone, 
  TrendingUp, 
  Users, 
  Bot, 
  Shield, 
  Puzzle, 
  BarChart 
} from 'lucide-react';
import DetailedFeatureCard from '../features/DetailedFeatureCard';

const DetailedFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: "Полное сканирование сайта",
      description: "Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем и возможностей для улучшения.",
      slug: "polnoe-skanirovanie-sajta"
    },
    {
      icon: FileText,
      title: "Анализ метаданных",
      description: "Проверка тегов title, description и других метаданных для максимальной оптимизации поисковой выдачи.",
      slug: "analiz-metadannyh"
    },
    {
      icon: Zap,
      title: "Проверка скорости загрузки",
      description: "Анализ времени загрузки страниц и детальные рекомендации по увеличению скорости сайта.",
      slug: "proverka-skorosti-zagruzki"
    },
    {
      icon: Smartphone,
      title: "Проверка мобильной версии",
      description: "Тестирование адаптивности и удобства использования на мобильных устройствах и планшетах.",
      slug: "proverka-mobilnoj-versii"
    },
    {
      icon: TrendingUp,
      title: "Отслеживание позиций",
      description: "Ежедневный мониторинг позиций вашего сайта в поисковых системах по ключевым словам.",
      slug: "otslezhivanie-pozicij"
    },
    {
      icon: Users,
      title: "Анализ конкурентов",
      description: "Сравнение ваших позиций с конкурентами для определения оптимальной SEO-стратегии.",
      slug: "analiz-konkurentov"
    },
    {
      icon: Bot,
      title: "Автоматическое исправление",
      description: "ИИ-powered автоматическое исправление найденных SEO-ошибок и оптимизация контента.",
      slug: "avtomaticheskoe-ispravlenie"
    },
    {
      icon: Shield,
      title: "Безопасность данных",
      description: "Полная конфиденциальность и безопасность ваших данных с соблюдением GDPR.",
      slug: "bezopasnost-dannyh"
    },
    {
      icon: Puzzle,
      title: "Интеграция с CMS",
      description: "Совместимость с популярными CMS-системами: WordPress, Joomla, Drupal и другими.",
      slug: "integraciya-s-cms"
    },
    {
      icon: BarChart,
      title: "Отчеты о производительности",
      description: "Детальные отчеты о производительности и рейтинге вашего сайта с экспортом в PDF.",
      slug: "otchety-o-proizvoditelnosti"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Возможности SeoMarket
          </h2>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-muted-foreground">
            Подробные возможности
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Исследуйте полный набор функций, которые помогут вам проводить SEO-аудит, 
            отслеживать позиции и оптимизировать ваш сайт для поисковых систем.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <DetailedFeatureCard
              key={feature.slug}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              slug={feature.slug}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
