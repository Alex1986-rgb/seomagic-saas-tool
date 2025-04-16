
import { 
  Search, BarChart2, Globe, Zap
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

// Функция для получения всех функций без разделения на категории
export const getAllFeatures = () => {
  return featuresData;
};
