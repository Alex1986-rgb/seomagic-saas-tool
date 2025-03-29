
import React from 'react';
import { motion } from 'framer-motion';
import { getFeaturesByCategory } from './featuresData';
import FeatureCategorySection from './FeatureCategorySection';

const FeatureList: React.FC = () => {
  const categorizedFeatures = getFeaturesByCategory();
  const categories = Object.keys(categorizedFeatures);

  return (
    <motion.div 
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category) => (
        <FeatureCategorySection 
          key={`category-${category}`} 
          title={category}
          features={categorizedFeatures[category].map(feature => ({
            icon: <feature.icon className="w-6 h-6 text-primary" />,
            title: feature.title,
            description: feature.description,
            link: feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`
          }))}
        />
      ))}
    </motion.div>
  );
};

export default FeatureList;
