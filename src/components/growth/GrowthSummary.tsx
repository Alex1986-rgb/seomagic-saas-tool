
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface GrowthSummaryProps {
  isVisible: boolean;
}

const GrowthSummary: React.FC<GrowthSummaryProps> = ({ isVisible }) => {
  return (
    <motion.div 
      className="mt-6 md:mt-8 text-center px-4 md:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <p className="text-base md:text-lg font-medium mb-3 md:mb-4">Средний рост в ТОП-10 за 2-3 месяца работы</p>
      <a 
        href="/audit" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 md:px-6 py-2 md:py-3 rounded-md inline-flex items-center justify-center gap-1 md:gap-2 transition-colors shadow-lg hover:shadow-xl text-sm md:text-base"
      >
        Проверить мой сайт
        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
      </a>
    </motion.div>
  );
};

export default GrowthSummary;
