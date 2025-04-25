
import React, { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PingResult } from './PingResults';

interface PingResultsChartProps {
  results: PingResult[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const PingResultsChart: React.FC<PingResultsChartProps> = ({ results }) => {
  const chartData = useMemo(() => {
    if (results.length === 0) return [];
    
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.length - successCount;
    
    return [
      { name: 'Успешно', value: successCount, color: '#22c55e' },
      { name: 'Ошибки', value: failedCount, color: '#ef4444' }
    ];
  }, [results]);
  
  const rpcStatistics = useMemo(() => {
    if (results.length === 0) return [];
    
    const statByRpc = new Map<string, { total: number, success: number }>();
    
    results.forEach(result => {
      if (!statByRpc.has(result.rpc)) {
        statByRpc.set(result.rpc, { total: 0, success: 0 });
      }
      
      const stat = statByRpc.get(result.rpc)!;
      stat.total += 1;
      if (result.success) {
        stat.success += 1;
      }
    });
    
    return Array.from(statByRpc.entries())
      .map(([rpc, stats]) => ({
        rpc,
        successRate: (stats.success / stats.total) * 100,
        successCount: stats.success,
        totalCount: stats.total
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }, [results]);
  
  if (results.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Статистика результатов</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <h4 className="mb-2 text-sm font-medium">Распределение результатов</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} запросов`, 'Количество']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="mb-2 text-sm font-medium">Эффективность RPC-сервисов</h4>
              <div className="overflow-y-auto h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">RPC-сервис</th>
                      <th className="text-right p-2">Успешно</th>
                      <th className="text-right p-2">Всего</th>
                      <th className="text-right p-2">% успеха</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rpcStatistics.map((stat, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 truncate max-w-xs" title={stat.rpc}>
                          {new URL(stat.rpc).hostname}
                        </td>
                        <td className="text-right p-2">{stat.successCount}</td>
                        <td className="text-right p-2">{stat.totalCount}</td>
                        <td className="text-right p-2">{stat.successRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PingResultsChart;
