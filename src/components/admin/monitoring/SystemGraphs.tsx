
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";

interface GraphProps {
  cpuUsageData: any[];
  memoryUsageData: any[];
  trafficData: any[];
}

const SystemGraphs: React.FC<GraphProps> = ({
  cpuUsageData,
  memoryUsageData,
  trafficData,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <Card className="shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Нагрузка системы за сутки</CardTitle>
        <CardDescription>CPU и использование памяти</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                ...cpuUsageData.map(item => ({ ...item, category: 'cpu' })),
                ...memoryUsageData.map(item => ({ ...item, category: 'memory' }))
              ].map(item => ({
                time: item.time,
                [item.category]: item.value
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="memory" name="Память %" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    <Card className="shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Сетевой трафик</CardTitle>
        <CardDescription>Входящий и исходящий по дням недели</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trafficData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="входящий" name="Входящий (KB)" fill="#22c55e" />
              <Bar dataKey="исходящий" name="Исходящий (KB)" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default SystemGraphs;
