
import React from 'react';
import { 
  BarChart, Bar, CartesianGrid, 
  Tooltip, XAxis, YAxis, Cell, 
  ResponsiveContainer 
} from 'recharts';

interface ScoresBarChartProps {
  data: Array<{
    name: string;
    score: number;
  }>;
}

const ScoresBarChart: React.FC<ScoresBarChartProps> = ({ data }) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-md font-medium mb-4 text-center">Оценки по категориям</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${value}`, 'Оценка']} />
          <Bar dataKey="score" isAnimationActive={true} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={
                entry.score >= 80 ? '#22c55e' : // зеленый
                entry.score >= 60 ? '#f59e0b' : // оранжевый
                '#ef4444' // красный
              } />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoresBarChart;
