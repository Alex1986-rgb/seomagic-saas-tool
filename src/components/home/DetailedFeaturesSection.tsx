
import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Wrench, Globe, BarChart, LineChart, Settings, Database } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-card border border-border p-6 rounded-lg transition-all hover:shadow-lg"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const DetailedFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Глубокий SEO анализ",
      description: "Анализируем все аспекты вашего сайта с точки зрения поисковых систем и выявляем проблемы"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Детальные отчеты",
      description: "Получайте подробные отчеты с рекомендациями и шагами по оптимизации вашего сайта"
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Отслеживание позиций",
      description: "Мониторинг позиций в поисковых системах по всем важным ключевым запросам"
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Анализ конкурентов",
      description: "Сравнение ваших SEO-показателей с конкурентами и выявление их стратегий"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Автоматизация исправлений",
      description: "Автоматическое исправление технических SEO-ошибок одним кликом"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Оптимизированная копия",
      description: "Создание полностью оптимизированной версии вашего сайта с исправленными ошибками"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Настраиваемые параметры",
      description: "Гибкая настройка глубины анализа и параметров сканирования под ваши нужды"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "История изменений",
      description: "Отслеживание динамики изменений SEO-показателей вашего сайта во времени"
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Подробные возможности</h2>
        <div className="neo-card p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
