
import { useState, useEffect } from 'react';
import { BeforeAfterData } from '../types';

interface UseChartDataProps {
  data: BeforeAfterData[];
  isAnimating: boolean;
  showAfter: boolean;
}

interface ChartDataPoint {
  name: string;
  before: number;
  after?: number;
  amt: number;
}

export const useChartData = ({ data, isAnimating, showAfter }: UseChartDataProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  useEffect(() => {
    // Prepare initial data (before values)
    const initialData = data.map((item) => ({
      name: item.category, // Using 'category' property as the name for chart
      before: isAnimating ? item.before : 0,
      amt: item.before
    }));
    
    setChartData(initialData);
    
    // Add 'after' values when animation reaches that stage
    if (showAfter) {
      const completeData = data.map((item) => ({
        name: item.category, // Using 'category' property as the name for chart
        before: item.before,
        after: item.after,
        amt: Math.max(item.before, item.after)
      }));
      
      setChartData(completeData);
    }
  }, [data, isAnimating, showAfter]);
  
  return { chartData };
};
