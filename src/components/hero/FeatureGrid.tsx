
import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Wrench, Globe, Zap, TrendingUp } from 'lucide-react';
import FeatureItem from './FeatureItem';

const FeatureGrid: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Search size={24} />,
      text: "ИИ анализ сайта",
      description: "Глубокое сканирование"
    },
    {
      icon: <Zap size={24} />,
      text: "Мгновенные результаты",
      description: "Анализ за 30 секунд"
    },
    {
      icon: <FileText size={24} />,
      text: "Детальный отчет",
      description: "PDF с рекомендациями"
    },
    {
      icon: <Wrench size={24} />,
      text: "Автофикс проблем",
      description: "Исправление ошибок"
    },
    {
      icon: <TrendingUp size={24} />,
      text: "Рост позиций",
      description: "Мониторинг в SERP"
    },
    {
      icon: <Globe size={24} />,
      text: "Готовая копия",
      description: "Оптимизированный сайт"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <FeatureItem 
          key={index}
          icon={feature.icon}
          text={feature.text}
          description={feature.description}
        />
      ))}
    </motion.div>
  );
};

export default FeatureGrid;
