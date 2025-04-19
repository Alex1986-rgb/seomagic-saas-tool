
import React, { Suspense, lazy } from 'react';
const FeatureSection = lazy(() => import('../features'));

const LoadingFallback = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="spinner-gradient"></div>
  </div>
);

const DetailedFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Подробные возможности</h2>
        <div className="neo-card p-8 rounded-lg">
          <Suspense fallback={<LoadingFallback />}>
            <FeatureSection />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
