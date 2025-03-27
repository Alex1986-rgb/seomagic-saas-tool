
import React from 'react';
import { 
  Search, BarChart2, Globe, Zap, 
  PieChart, LineChart, Settings, AlarmClock, 
  Check, Lock, ArrowUpRight, Award
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureList: React.FC = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "Глубокий SEO-аудит",
      description: "Автоматический анализ более 100 факторов ранжирования и выявление всех технических ошибок вашего сайта."
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-primary" />,
      title: "Мониторинг позиций",
      description: "Отслеживание позиций вашего сайта по ключевым запросам в поисковых системах в режиме реального времени."
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Автоматическая оптимизация",
      description: "Интеллектуальные алгоритмы автоматически исправляют обнаруженные проблемы и улучшают SEO-показатели сайта."
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Ускорение загрузки",
      description: "Анализ и оптимизация скорости загрузки страниц для улучшения пользовательского опыта и ранжирования."
    },
    {
      icon: <PieChart className="w-6 h-6 text-primary" />,
      title: "Анализ конкурентов",
      description: "Сравнение вашего сайта с конкурентами и выявление их сильных сторон для улучшения вашей стратегии."
    },
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: "Аналитика роста",
      description: "Наглядная визуализация роста трафика и улучшения позиций с течением времени."
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: "Настраиваемые отчеты",
      description: "Создание персонализированных отчетов для клиентов и руководства с фокусом на нужных метриках."
    },
    {
      icon: <AlarmClock className="w-6 h-6 text-primary" />,
      title: "Автоматические проверки",
      description: "Регулярные автоматические проверки сайта на появление новых ошибок и проблем с оповещениями."
    },
    {
      icon: <Check className="w-6 h-6 text-primary" />,
      title: "Валидация разметки",
      description: "Проверка корректности HTML, JSON-LD и микроразметки для правильного отображения в поиске."
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Безопасность сайта",
      description: "Проверка на наличие уязвимостей, вредоносного кода и проблем с SSL-сертификатами."
    },
    {
      icon: <ArrowUpRight className="w-6 h-6 text-primary" />,
      title: "Рекомендации по улучшению",
      description: "Детальные рекомендации по улучшению контента, структуры и технических аспектов сайта."
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Экспертная поддержка",
      description: "Доступ к команде SEO-экспертов, готовых помочь с интерпретацией данных и стратегией."
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
