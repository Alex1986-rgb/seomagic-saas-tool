
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureCategoryProps } from './types';
import FeatureGrid from './FeatureGrid';

const FeatureCategorySection: React.FC<FeatureCategoryProps> = ({ title, features }) => {
  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      layout
      key={`feature-category-${title || 'main'}`}
    >
      <AnimatePresence mode="wait">
        {title && (
          <motion.h3 
            className="text-2xl font-semibold mb-6 text-foreground/90 relative inline-block"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            key={`title-${title}`}
            layoutId={`category-title-${title.replace(/\s+/g, '-')}`}
          >
            {title}
            <span className="absolute -bottom-1 left-0 w-1/3 h-[2px] bg-primary/60 rounded-full"></span>
          </motion.h3>
        )}
      </AnimatePresence>
      
      <FeatureGrid features={features} />
    </motion.div>
  );
};

export default FeatureCategorySection;
