
import React from 'react';
import { LineChart, BarChart2, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { SlideData } from './types';

export const getSlideData = (): SlideData[] => {
  return [
    {
      title: "SEO Аудит сайта",
      icon: <LineChart className="w-14 h-14 text-primary" />,
      content: "Анализ более 100 SEO-факторов",
      color: "#9b87f5"
    },
    {
      title: "Отслеживание позиций",
      icon: <BarChart2 className="w-14 h-14 text-[#0EA5E9]" />,
      content: "Мониторинг ключевых слов в поисковых системах",
      color: "#0EA5E9"
    },
    {
      title: "Оптимизация контента",
      icon: <Star className="w-14 h-14 text-[#F97316]" />,
      content: "ИИ-рекомендации для улучшения контента",
      color: "#F97316"
    },
    {
      title: "Рост трафика",
      icon: <ArrowRight className="w-14 h-14 text-[#22c55e]" />,
      content: "Увеличение органического трафика до 150%",
      color: "#22c55e"
    },
    {
      title: "Проверено экспертами",
      icon: <CheckCircle className="w-14 h-14 text-primary" />,
      content: "Надежное решение для SEO-оптимизации",
      color: "#9b87f5"
    }
  ];
};
