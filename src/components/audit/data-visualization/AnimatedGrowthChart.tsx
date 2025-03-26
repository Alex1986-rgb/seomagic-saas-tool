
import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { BeforeAfterData, AnimatedGrowthChartProps } from './types';
import AreaChart from './charts/AreaChart';
import BarChart from './charts/BarChart';
import StatCard from './components/StatCard';
import GrowthSummary from './components/GrowthSummary';

const AnimatedGrowthChart: React.FC<AnimatedGrowthChartProps> = ({ 
  title, 
  data,
  chartType = 'area'
}) => {
  const [showAfter, setShowAfter] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      const afterTimer = setTimeout(() => {
        setShowAfter(true);
      }, 1500);
      
      return () => clearTimeout(afterTimer);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
    <div className="neo-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="mb-6">
        {chartType === 'area' ? (
          <AreaChart data={data} showAfter={showAfter} />
        ) : (
          <BarChart data={data} showAfter={showAfter} />
        )}
      </div>
      
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
    </div>
  );
};

export default AnimatedGrowthChart;
