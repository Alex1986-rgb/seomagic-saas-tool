
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { date: '01/05', score: 62 },
  { date: '05/05', score: 64 },
  { date: '10/05', score: 67 },
  { date: '15/05', score: 69 },
  { date: '20/05', score: 72 },
  { date: '25/05', score: 74 },
  { date: '01/06', score: 76.8 },
];

export const SparkAreaChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          domain={[55, 'dataMax + 5']} 
          tick={{ fontSize: 12 }} 
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="score" 
          stroke="#8b5cf6" 
          strokeWidth={2} 
          fillOpacity={1} 
          fill="url(#colorScore)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SparkAreaChart;
