import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from './types';

interface IssuesBreakdownChartProps {
  criticalCount: number;
  warningCount: number;
  passedCount: number;
  categoryData?: ChartDataPoint[];
}

const IssuesBreakdownChart: React.FC<IssuesBreakdownChartProps> = ({
  criticalCount,
  warningCount,
  passedCount,
  categoryData = []
}) => {
  const pieData = [
    { name: 'Критические', value: criticalCount, color: 'hsl(var(--destructive))' },
    { name: 'Предупреждения', value: warningCount, color: 'hsl(var(--warning))' },
    { name: 'Пройдено', value: passedCount, color: 'hsl(var(--success))' }
  ];

  const defaultCategoryData: ChartDataPoint[] = categoryData.length > 0 ? categoryData : [
    { name: 'SEO', value: criticalCount + warningCount, color: 'hsl(var(--primary))' },
    { name: 'Технические', value: Math.floor((criticalCount + warningCount) * 0.6), color: 'hsl(var(--chart-1))' },
    { name: 'Контент', value: Math.floor((criticalCount + warningCount) * 0.4), color: 'hsl(var(--chart-2))' },
    { name: 'Производительность', value: Math.floor((criticalCount + warningCount) * 0.3), color: 'hsl(var(--chart-3))' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Распределение проблем</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">По типам</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">По категориям</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={defaultCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {defaultCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IssuesBreakdownChart;
