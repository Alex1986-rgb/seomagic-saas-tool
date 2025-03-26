
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BeforeAfterData } from '../types';

interface BarChartProps {
  data: BeforeAfterData[];
  showAfter: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ data, showAfter }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`${value}`, '']}
          labelFormatter={(label) => `Категория: ${label}`}
        />
        <Legend />
        <Bar dataKey="before" name="До" fill="#8884d8" />
        {showAfter && <Bar dataKey="after" name="После" fill="#82ca9d" />}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
