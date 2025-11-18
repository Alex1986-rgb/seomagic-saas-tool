import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, CartesianGrid, 
  Tooltip, XAxis, YAxis, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { CategoryData } from '@/types/audit';
import { getHistoricalTrends, HistoricalTrend } from '@/services/audit/historyService';

interface TrendsAreaChartProps {
  auditData: {
    seo: CategoryData;
    performance: CategoryData;
    content: CategoryData;
    technical: CategoryData;
  };
  url: string;
}

const TrendsAreaChart: React.FC<TrendsAreaChartProps> = ({ auditData, url }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistoricalData = async () => {
      setLoading(true);
      const trends = await getHistoricalTrends(url, 6);
      
      // Add current data as the last point if we have historical data
      if (trends.length > 0) {
        const currentPoint: HistoricalTrend = {
          date: 'Текущий',
          globalScore: 0,
          seoScore: auditData.seo.score,
          technicalScore: auditData.technical.score,
          contentScore: auditData.content.score,
          performanceScore: auditData.performance.score,
          pageCount: 0,
          auditId: 'current'
        };
        setHistoricalData([...trends, currentPoint]);
      } else {
        setHistoricalData([]);
      }
      
      setLoading(false);
    };

    loadHistoricalData();
  }, [url, auditData]);

  const trendData = historicalData.map(item => ({
    date: item.date,
    seo: item.seoScore,
    performance: item.performanceScore,
    content: item.contentScore,
    technical: item.technicalScore,
  }));

  if (loading) {
    return (
      <div className="p-4 border rounded-md">
        <h3 className="text-md font-medium mb-4 text-center">Динамика по категориям</h3>
        <p className="text-center text-muted-foreground text-sm py-8">
          Загрузка исторических данных...
        </p>
      </div>
    );
  }

  if (trendData.length === 0) {
    return (
      <div className="p-4 border rounded-md">
        <h3 className="text-md font-medium mb-4 text-center">Динамика по категориям</h3>
        <p className="text-center text-muted-foreground text-sm py-8">
          Недостаточно исторических данных. Проведите больше аудитов для отслеживания динамики.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-md font-medium mb-4 text-center">Динамика по категориям</h3>
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
