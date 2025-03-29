
import React from 'react';
import { motion } from 'framer-motion';
import { getFeaturesByCategory, featuresData } from './featuresData';
import FeatureCategorySection from './FeatureCategorySection';
import FeatureCard from './FeatureCard';

const FeatureList: React.FC = () => {
  const categorizedFeatures = getFeaturesByCategory();
  const categories = Object.keys(categorizedFeatures);

  return (
    <div className="space-y-16">
      {categories.length > 0 ? (
        categories.map((category) => (
          <FeatureCategorySection 
            key={`category-${category}`} 
            title={category}
            features={categorizedFeatures[category].map(feature => ({
              icon: <feature.icon className="w-6 h-6 text-primary" />,
              title: feature.title,
              description: feature.description,
              link: feature.link
            }))}
          />
        ))
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={`feature-${index}`}
              icon={<feature.icon className="w-6 h-6 text-primary" />}
              title={feature.title}
              description={feature.description}
              link={feature.link}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FeatureList;
