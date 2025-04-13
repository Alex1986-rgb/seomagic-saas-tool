
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureGridProps } from './types';
import FeatureCard from './FeatureCard';

const FeatureGrid: React.FC<FeatureGridProps> = ({ features }) => {
  // Animation for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      layout="position"
      key="feature-grid-container"
    >
      <AnimatePresence mode="wait">
        {features.map((feature, index) => {
          // Create a stable, unique identifier for each feature
          const featureId = `feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;
          
          return (
            <FeatureCard
              key={featureId}
              layoutId={featureId}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              link={feature.link}
            />
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeatureGrid;
