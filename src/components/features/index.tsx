
import React from 'react';
import FeatureBackground from './FeatureBackground';
import FeatureHeader from './FeatureHeader';
import FeatureList from './FeatureList';

const FeatureSection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <FeatureBackground />
      
      <div className="container mx-auto px-4 md:px-6">
        <FeatureHeader />
        <FeatureList />
      </div>
    </section>
  );
};

export default FeatureSection;
