
import { 
  Search, BarChart2, Globe, Zap, Code, TrendingUp, Sparkles, FileText, Award
} from 'lucide-react';
import { FeatureData } from './types';

export const featuresData: FeatureData[] = [
  {
    icon: Search,
    title: "Глубокий SEO-аудит",
    description: "Автоматический анализ более 100 факторов ранжирования и выявление всех технических ошибок вашего сайта.",
    link: "/audit",
    category: "Аудит"
  },
  {
    icon: BarChart2,
    title: "Мониторинг позиций",
    description: "Отслеживание позиций вашего сайта по ключевым запросам в поисковых системах в режиме реального времени.",
    link: "/position-tracker",
    category: "Мониторинг"
  },
  {
    icon: Globe,
    title: "Автоматическая оптимизация",
    description: "Интеллектуальные алгоритмы автоматически исправляют обнаруженные проблемы и улучшают SEO-показатели сайта.",
    link: "/features/optimization",
    category: "Оптимизация"
  },
  {
    icon: Zap,
    title: "Ускорение загрузки",
    description: "Анализ и оптимизация скорости загрузки страниц для улучшения пользовательского опыта и ранжирования.",
    link: "/features/speed-optimization",
    category: "Оптимизация"
  },
  {
    icon: Code,
    title: "Технический SEO",
    description: "Глубокий анализ технических аспектов сайта, включая структуру, robots.txt, sitemap и семантическую разметку.",
    link: "/features/technical-seo",
    category: "Аудит"
  },
  {
    icon: TrendingUp,
    title: "Прогнозирование роста",
    description: "Аналитика и прогнозирование потенциального роста трафика и улучшения позиций в поисковой выдаче.",
    link: "/features/growth-prediction",
    category: "Аналитика"
  },
  {
    icon: Sparkles,
    title: "Контент-анализ",
    description: "Оценка качества и семантической relevatности контента, рекомендации по улучшению.",
    link: "/features/content-analysis",
    category: "Контент"
  },
  {
    icon: FileText,
    title: "Генерация отчетов",
    description: "Автоматическое создание подробных PDF и интерактивных отчетов с визуализацией результатов.",
    link: "/features/reporting",
    category: "Аналитика"
  }
];

export const getFeaturesByCategory = () => {
  const categorizedFeatures: Record<string, FeatureData[]> = {};
  
  featuresData.forEach(feature => {
    const category = feature.category || 'Другое';
    if (!categorizedFeatures[category]) {
      categorizedFeatures[category] = [];
    }
    categorizedFeatures[category].push(feature);
  });
  
  return categorizedFeatures;
};

export const getAllFeatures = () => {
  return featuresData;
};

