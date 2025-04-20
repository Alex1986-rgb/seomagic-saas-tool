
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ErrorDistributionItem {
  name: string;
  value: number;
  color: string;
}
interface Props {
  errorDistributionData: ErrorDistributionItem[];
}
const ErrorDistributionChart: React.FC<Props> = ({ errorDistributionData }) => (
  <Card className="shadow">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Распределение ошибок</CardTitle>
      <CardDescription>За последние 24 часа</CardDescription>
    </CardHeader>
    <CardContent className="pt-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={errorDistributionData}
              cx="50%"
              cy="40%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {errorDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-4">
        <span className="font-medium">Всего ошибок:</span> {errorDistributionData.reduce((acc, curr) => acc + curr.value, 0)}
      </div>
    </CardContent>
  </Card>
);

export default ErrorDistributionChart;
