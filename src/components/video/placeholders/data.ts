
import { LineChart, BarChart2, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { SlideData } from './types';

// Helper function to create slide data with properly typed icons
export const getSlideData = (): SlideData[] => {
  return [
    {
      title: "SEO Аудит сайта",
      icon: LineChart,
      content: "Анализ более 100 SEO-факторов",
      color: "#9b87f5"
    },
    {
      title: "Отслеживание позиций",
      icon: BarChart2,
      content: "Мониторинг ключевых слов в поисковых системах",
      color: "#0EA5E9"
    },
    {
      title: "Оптимизация контента",
      icon: Star,
      content: "ИИ-рекомендации для улучшения контента",
      color: "#F97316"
    },
    {
      title: "Рост трафика",
      icon: ArrowRight,
      content: "Увеличение органического трафика до 150%",
      color: "#22c55e"
    },
    {
      title: "Проверено экспертами",
      icon: CheckCircle,
      content: "Надежное решение для SEO-оптимизации",
      color: "#9b87f5"
    }
  ];
};
