
import React from 'react';
import { motion } from 'framer-motion';
import FeatureCategory from './FeatureCategory';
import { getFeaturesByCategory, featuresData } from './featuresData';

const FeatureList: React.FC = () => {
  const categorizedFeatures = getFeaturesByCategory();
  const categories = Object.keys(categorizedFeatures);

  return (
    <div className="space-y-16">
      {categories.length > 0 ? (
        // Если есть категории, показываем их
        categories.map((category, index) => (
          <FeatureCategory 
            key={category} 
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
        // Если категорий нет, показываем все функции в одной сетке
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {React.createElement(FeatureCategory, {
                title: '',
                features: [{
                  icon: <feature.icon className="w-6 h-6 text-primary" />,
                  title: feature.title,
                  description: feature.description,
                  link: feature.link
                }]
              })}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureList;
