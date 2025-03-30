
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureGridProps } from './types';
import FeatureCard from './FeatureCard';

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  // Animation for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        layout
        key="feature-grid-container"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={`feature-${feature.title}-${index}`}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            link={feature.link}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureGrid;
