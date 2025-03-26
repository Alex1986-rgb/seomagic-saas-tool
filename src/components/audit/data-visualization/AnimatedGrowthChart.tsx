
import React from 'react';
import { AnimatedGrowthChartProps } from './types';
import AreaChart from './charts/AreaChart';
import BarChart from './charts/BarChart';
import ChartContainer from './components/ChartContainer';
import GrowthMetrics from './components/GrowthMetrics';
import { useChartAnimation } from './hooks/useChartAnimation';

const AnimatedGrowthChart: React.FC<AnimatedGrowthChartProps> = ({ 
  title, 
  data,
  chartType = 'area'
}) => {
  const { showAfter, isAnimating } = useChartAnimation();

  return (
    <ChartContainer title={title}>
      <div className="mb-6">
        {chartType === 'area' ? (
          <AreaChart data={data} showAfter={showAfter} />
        ) : (
          <BarChart data={data} showAfter={showAfter} />
        )}
      </div>
      
      <GrowthMetrics 
        data={data}
        isAnimating={isAnimating}
        showAfter={showAfter}
      />
    </ChartContainer>
  );
};

export default AnimatedGrowthChart;
