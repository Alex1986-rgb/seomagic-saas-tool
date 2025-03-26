
import React, { useState } from 'react';
import { 
  PieChart, Pie, Sector, Cell, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface IssuesPieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const IssuesPieChart: React.FC<IssuesPieChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Рендер активного сектора для круговой диаграммы
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333">
          {`${value} проблем`}
        </text>
        <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-md font-medium mb-4 text-center">Распределение проблем</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            onMouseEnter={onPieEnter}
            isAnimationActive={true}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} проблем`, 'Количество']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssuesPieChart;
