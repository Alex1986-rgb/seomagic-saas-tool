
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, BarChart2, Globe, Zap, 
  PieChart, LineChart, Settings, AlarmClock, 
  Check, Lock, ArrowUpRight, Award
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="border rounded-lg p-6 shadow-sm h-full relative overflow-hidden group"
    >
      <div className="mb-5 p-3 bg-primary/10 rounded-full inline-block">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-full -m-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const DemoFeatures: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "SEO-аудит сайта",
      description: "Комплексный анализ всех факторов, влияющих на ранжирование вашего сайта в поисковых системах."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-primary" />,
      title: "Мониторинг позиций",
      description: "Отслеживание позиций сайта по ключевым словам в Google, Яндекс и других поисковых системах."
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Анализ структуры",
      description: "Оценка и оптимизация структуры сайта для улучшения индексации и навигации."
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Скорость загрузки",
      description: "Анализ скорости загрузки страниц и рекомендации по её улучшению."
    },
    {
      icon: <PieChart className="w-6 h-6 text-primary" />,
      title: "Анализ конкурентов",
      description: "Сравнительный анализ вашего сайта с конкурентами и выявление их стратегий."
    },
    {
      icon: <Check className="w-6 h-6 text-primary" />,
      title: "Проверка контента",
      description: "Анализ качества, уникальности и оптимизации текстового содержимого."
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: "Автоматическая оптимизация",
      description: "Интеллектуальные алгоритмы для автоматического исправления SEO-ошибок на сайте."
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: "SEO-прогнозы",
      description: "Прогнозирование роста трафика и позиций на основе аналитических данных."
    },
    {
      icon: <AlarmClock className="w-6 h-6 text-primary" />,
      title: "Регулярные проверки",
      description: "Автоматические проверки сайта по расписанию с уведомлениями о проблемах."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Основные функции SeoMarket</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Познакомьтесь с ключевыми возможностями нашей платформы для комплексной оптимизации сайтов
        </p>
        <Button variant="outline" size="lg">Посмотреть все возможности</Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 p-6 border rounded-lg bg-primary/5 shadow-sm text-center"
      >
        <Award className="w-8 h-8 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Попробуйте все возможности SeoMarket</h3>
        <p className="text-muted-foreground max-w-xl mx-auto mb-6">
          Получите бесплатный пробный период и испытайте все функции платформы на своем сайте
        </p>
        <Button size="lg" className="gap-2">
          Начать бесплатно <ArrowUpRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default DemoFeatures;
