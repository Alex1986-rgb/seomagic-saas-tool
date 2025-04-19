
import React from 'react';
import { motion } from 'framer-motion';
import { featureCategories } from './featuresData';
import FeatureCategory from './FeatureCategory';

const FeatureCategorySection: React.FC = () => {
  return (
    <motion.div 
      className="py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {featureCategories.map((category, index) => (
        <FeatureCategory 
          key={`category-${index}`}
          title={category.title}
          features={category.features}
        />
      ))}
    </motion.div>
  );
};

export default FeatureCategorySection;
