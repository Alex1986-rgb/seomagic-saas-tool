
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface GrowthSummaryProps {
  averageImprovement: number;
  showAfter: boolean;
}

const GrowthSummary: React.FC<GrowthSummaryProps> = ({ 
  averageImprovement, 
  showAfter 
}) => {
  if (!showAfter) return null;
  
  return (
    <motion.div 
      className="mt-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <p className="text-lg">
        <span className="font-medium">Средний рост: </span>
        <span className="text-green-600 dark:text-green-400 font-bold">+{averageImprovement.toFixed(1)}</span>
        <span> баллов по всем категориям</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Оптимизация привела к значительному улучшению во всех ключевых метриках
      </p>
    </motion.div>
  );
};

export default GrowthSummary;
