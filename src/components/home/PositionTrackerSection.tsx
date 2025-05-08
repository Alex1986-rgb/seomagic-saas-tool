
import React, { Suspense, lazy } from 'react';
import { SectionLoader } from '@/components/ui/loading';

const PositionTrackerFeature = lazy(() => import('../position-tracker/PositionTrackerFeature'));

const PositionTrackerSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Отслеживание позиций</h2>
        <div className="neo-card p-8 rounded-lg">
          <Suspense fallback={<SectionLoader text="Загрузка контента..." />}>
            <PositionTrackerFeature />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default PositionTrackerSection;
