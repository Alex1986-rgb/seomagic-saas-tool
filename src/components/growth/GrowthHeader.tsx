
import React from 'react';
import { motion } from 'framer-motion';

interface GrowthHeaderProps {
  isVisible: boolean;
}

const GrowthHeader: React.FC<GrowthHeaderProps> = ({ isVisible }) => {
  return (
    <div className="text-center mb-6 md:mb-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 font-playfair">Реальный рост позиций после оптимизации</h3>
        <p className="text-sm md:text-base text-muted-foreground">Клиенты отмечают значительное улучшение позиций в поисковой выдаче</p>
      </motion.div>
    </div>
  );
};

export default GrowthHeader;
