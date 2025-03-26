
import React from 'react';
import StatCard from './StatCard';
import GrowthSummary from './GrowthSummary';
import { BeforeAfterData } from '../types';

interface GrowthMetricsProps {
  data: BeforeAfterData[];
  isAnimating: boolean;
  showAfter: boolean;
}

const GrowthMetrics: React.FC<GrowthMetricsProps> = ({ 
  data,
  isAnimating,
  showAfter
}) => {
  // Calculate average improvement
  const averageImprovement = data.reduce((acc, item) => {
    return acc + (item.after - item.before);
  }, 0) / data.length;

  const percentageImprovement = data.reduce((acc, item) => {
    const pct = item.before > 0 ? ((item.after - item.before) / item.before) * 100 : 0;
    return acc + pct;
  }, 0) / data.length;

  // Calculate average before and after values
  const averageBefore = data.reduce((sum, item) => sum + item.before, 0) / data.length;
  const averageAfter = data.reduce((sum, item) => sum + item.after, 0) / data.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StatCard 
          title="До оптимизации"
          value={averageBefore}
          isAnimating={isAnimating}
        />
        
        <StatCard 
          title="После оптимизации"
          value={averageAfter}
          isAnimating={isAnimating}
          showAfter={showAfter}
          improvement={percentageImprovement}
          delay={0.2}
        />
      </div>
      
      <GrowthSummary 
        averageImprovement={averageImprovement} 
        showAfter={showAfter} 
      />
    </>
  );
};

export default GrowthMetrics;
