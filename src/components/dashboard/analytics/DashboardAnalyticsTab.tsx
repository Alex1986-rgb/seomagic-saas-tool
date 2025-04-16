
import React from 'react';
import { AnalyticsOverview } from './AnalyticsOverview';

const DashboardAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Аналитика</h2>
      </div>
      <AnalyticsOverview />
    </div>
  );
};

export default DashboardAnalyticsTab;
