
import React from 'react';
import { motion } from 'framer-motion';

const FeatureHeader: React.FC = () => {
  return (
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Возможности SeoMarket
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Исследуйте полный набор функций, которые помогут вам проводить SEO-аудит,
        отслеживать позиции и оптимизировать ваш сайт для поисковых систем.
      </p>
    </motion.div>
  );
};

export default FeatureHeader;
