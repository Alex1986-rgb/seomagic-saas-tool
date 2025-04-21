
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle } from "lucide-react";

interface ErrorDistributionItem {
  name: string;
  value: number;
  color: string;
}
interface Props {
  errorDistributionData: ErrorDistributionItem[];
}
const ErrorDistributionChart: React.FC<Props> = ({ errorDistributionData }) => (
  <Card className="shadow border-0 bg-gradient-to-br from-[#191b2a]/80 via-[#28213a]/80 to-[#F97316]/20 glass-morphism">
    <CardHeader className="pb-2 flex flex-row items-center gap-3">
      <AlertCircle className="text-[#F97316] rounded-lg p-2 h-8 w-8 bg-orange-900/20 mr-1" />
      <div>
        <CardTitle className="text-lg font-medium">Распределение ошибок</CardTitle>
        <CardDescription>За последние 24 часа</CardDescription>
      </div>
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
              fill="#F97316"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {errorDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(26,31,44,0.95)',
                border: 'none',
                color: '#fff'
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-4">
        <span className="font-medium text-white/90">Всего ошибок:</span>{" "}
        {errorDistributionData.reduce((acc, curr) => acc + curr.value, 0)}
      </div>
    </CardContent>
  </Card>
);

export default ErrorDistributionChart;
