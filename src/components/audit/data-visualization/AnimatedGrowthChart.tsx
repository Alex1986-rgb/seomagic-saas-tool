
import React from 'react';
import { motion } from 'framer-motion';
import { Area, Bar, AreaChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BeforeAfterData } from './types';
import { useChartAnimation } from './hooks/useChartAnimation';
import { useChartData } from './hooks/useChartData';
import GrowthMetrics from './components/GrowthMetrics';

interface AnimatedGrowthChartProps {
  title: string;
  data: BeforeAfterData[];
  chartType?: 'area' | 'bar';
}

const AnimatedGrowthChart: React.FC<AnimatedGrowthChartProps> = ({ 
  title, 
  data,
  chartType = 'area'
}) => {
  const { showAfter, isAnimating } = useChartAnimation();
  const { chartData } = useChartData({ data, isAnimating, showAfter });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-card border rounded-lg shadow-sm"
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="before" 
                stackId="1"
                stroke="#6b7280" 
                fill="#6b728050" 
              />
              {showAfter && (
                <Area 
                  type="monotone" 
                  dataKey="after" 
                  stackId="2"
                  stroke="#3b82f6" 
                  fill="#3b82f650" 
                />
              )}
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="before" 
                fill="#6b7280" 
                name="До"
              />
              {showAfter && (
                <Bar 
                  dataKey="after" 
                  fill="#3b82f6" 
                  name="После"
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <GrowthMetrics 
        data={data}
        isAnimating={isAnimating}
        showAfter={showAfter}
      />
    </motion.div>
  );
};

export default AnimatedGrowthChart;
