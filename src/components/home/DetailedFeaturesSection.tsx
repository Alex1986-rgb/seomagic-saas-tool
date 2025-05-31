
import React from 'react';
import FeatureSection from '../features';

const DetailedFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Подробные возможности</h2>
        <div className="neo-card p-8 rounded-lg">
          <FeatureSection />
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
