
import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Wrench, Globe } from 'lucide-react';
import FeatureItem from './FeatureItem';

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
      <FeatureItem 
        icon={<Search size={24} />}
        text="Глубокий SEO Анализ" 
      />
      <FeatureItem 
        icon={<FileText size={24} />}
        text="Детальный PDF Отчет" 
      />
      <FeatureItem 
        icon={<Wrench size={24} />}
        text="Автоматическое исправление" 
      />
      <FeatureItem 
        icon={<Globe size={24} />}
        text="Оптимизированная копия" 
      />
    </div>
  );
};

export default FeatureGrid;
