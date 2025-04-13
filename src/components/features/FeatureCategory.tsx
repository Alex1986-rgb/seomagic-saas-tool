
import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { FeatureCategoryProps } from './types';

const FeatureCategory: React.FC<FeatureCategoryProps> = ({ title, features }) => {
  return (
    <div className="mb-12">
      {title && (
        <motion.h3 
          className="text-2xl font-semibold mb-6 text-foreground/90 relative inline-block"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}
          <span className="absolute -bottom-1 left-0 w-1/3 h-[2px] bg-primary/60 rounded-full"></span>
        </motion.h3>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <FeatureCard
              key={`${title || 'feature'}-${index}`}
              icon={<Icon className="h-6 w-6 text-primary" />}
              title={feature.title}
              description={feature.description}
              link={feature.link}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCategory;
