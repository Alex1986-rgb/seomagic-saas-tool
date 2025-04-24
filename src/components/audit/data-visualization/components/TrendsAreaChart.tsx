import React from 'react';
import { 
  AreaChart, Area, CartesianGrid, 
  Tooltip, XAxis, YAxis, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { CategoryData } from '@/types/audit';

interface TrendsAreaChartProps {
  auditData: {
    seo: CategoryData;
    performance: CategoryData;
    content: CategoryData;
    technical: CategoryData;
  };
}

const TrendsAreaChart: React.FC<TrendsAreaChartProps> = ({ auditData }) => {
  // Sample historical data with current data point
  const trendData = [
    { date: '01.01', seo: 50, performance: 40, content: 60, technical: 30 },
    { date: '01.15', seo: 55, performance: 45, content: 62, technical: 35 },
    { date: '02.01', seo: 60, performance: 55, content: 65, technical: 40 },
    { date: '02.15', seo: 70, performance: 65, content: 70, technical: 50 },
    { date: '03.01', seo: 75, performance: 75, content: 75, technical: 65 },
    { date: 'Текущий', seo: auditData.seo.score, performance: auditData.performance.score, content: auditData.content.score, technical: auditData.technical.score },
  ];

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-md font-medium mb-4 text-center">Динамика по категориям</h3>
      <p className="text-center text-muted-foreground text-sm mb-4">
        Этот график будет показывать изменения оценок со временем при наличии исторических данных.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={trendData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff8042" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="seo" stroke="#8884d8" fillOpacity={1} fill="url(#colorSeo)" name="SEO" />
          <Area type="monotone" dataKey="performance" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPerf)" name="Производительность" />
          <Area type="monotone" dataKey="content" stroke="#ffc658" fillOpacity={1} fill="url(#colorContent)" name="Контент" />
          <Area type="monotone" dataKey="technical" stroke="#ff8042" fillOpacity={1} fill="url(#colorTech)" name="Технические аспекты" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsAreaChart;
