
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface GrowthSummaryProps {
  isVisible: boolean;
}

const GrowthSummary: React.FC<GrowthSummaryProps> = ({ isVisible }) => {
  return (
    <motion.div 
      className="mt-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <p className="text-lg font-medium mb-4">Средний рост в ТОП-10 за 2-3 месяца работы</p>
      <a 
        href="/audit" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-md inline-flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
      >
        Проверить мой сайт
        <ArrowRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
};

export default GrowthSummary;
