
import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BeforeAfterData } from '../types';

interface AreaChartProps {
  data: BeforeAfterData[];
  showAfter: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({ data, showAfter }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="category" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip 
          formatter={(value: number) => [`${value}`, '']}
          labelFormatter={(label) => `Категория: ${label}`}
        />
        <Legend />
        
        <Area 
          type="monotone" 
          dataKey="before" 
          name="До" 
          stroke="#8884d8" 
          fillOpacity={1} 
          fill="url(#colorBefore)" 
          strokeWidth={2}
        />
        
        {showAfter && (
          <Area 
            type="monotone" 
            dataKey="after" 
            name="После" 
            stroke="#82ca9d" 
            fillOpacity={1} 
            fill="url(#colorAfter)" 
            strokeWidth={2}
          />
        )}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
