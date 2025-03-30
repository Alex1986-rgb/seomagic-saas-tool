
import React from 'react';
import { motion } from 'framer-motion';
import { getAllFeatures } from './featuresData';
import FeatureGrid from './FeatureGrid';

const FeatureList: React.FC = () => {
  const allFeatures = getAllFeatures();

  return (
    <motion.div 
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      key="feature-list-container"
    >
      <FeatureGrid 
        features={allFeatures.map(feature => ({
          icon: <feature.icon className="w-6 h-6 text-primary" />,
          title: feature.title,
          description: feature.description,
          link: feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
        }))}
      />
    </motion.div>
  );
};

export default FeatureList;
