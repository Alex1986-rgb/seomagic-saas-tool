
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { Cpu, Memory, BarChart as BarChartIcon } from "lucide-react";

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
    <Card className="shadow border-0 bg-gradient-to-br from-[#191b2a]/90 via-[#23263B]/90 to-[#5B47BA]/20 glass-morphism">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <Cpu className="text-[#3B82F6] bg-blue-900/20 rounded-lg p-2 h-8 w-8" />
        <Memory className="text-[#8B5CF6] bg-purple-900/20 rounded-lg p-2 h-8 w-8" />
        <div>
          <CardTitle className="text-lg font-medium font-playfair">Нагрузка системы за сутки</CardTitle>
          <CardDescription>CPU и использование памяти</CardDescription>
        </div>
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
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#ffffff25" />
              <XAxis dataKey="time" stroke="#b2b6cf" />
              <YAxis stroke="#b2b6cf" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(26, 31, 44, 0.85)', 
                  borderColor: 'rgba(155, 135, 245, 0.2)',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="memory" name="Память %" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    <Card className="shadow border-0 bg-gradient-to-br from-[#23263B]/80 via-[#191B22]/90 to-[#F97316]/10 glass-morphism">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <BarChartIcon className="text-[#F97316] bg-orange-900/20 rounded-lg p-2 h-8 w-8" />
        <div>
          <CardTitle className="text-lg font-medium font-playfair">Сетевой трафик</CardTitle>
          <CardDescription>Входящий и исходящий по дням недели</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trafficData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#ffffff20" />
              <XAxis dataKey="day" stroke="#b2b6cf" />
              <YAxis stroke="#b2b6cf" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(26, 31, 44, 0.85)',
                  borderColor: 'rgba(155, 135, 245, 0.2)',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="входящий" name="Входящий (KB)" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="исходящий" name="Исходящий (KB)" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default SystemGraphs;
