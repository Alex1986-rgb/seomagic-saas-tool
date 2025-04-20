
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Cpu, Server, HardDrive, Activity, TrendingDown, TrendingUp } from "lucide-react";

// Reuse the palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export interface StatCard {
  title: string;
  value: string;
  icon: string;
  description: string;
  color: string;
  trend: { value: number; icon: string };
}

interface StatCardsProps {
  statCards: StatCard[];
  cpuUsageData: any[];
  memoryUsageData: any[];
  diskUsageData: any[];
}

const StatCards: React.FC<StatCardsProps> = ({
  statCards,
  cpuUsageData,
  memoryUsageData,
  diskUsageData,
}) => {
  // Helper function to render the appropriate icon based on icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'cpu': return <Cpu className="h-6 w-6 text-blue-500" />;
      case 'server': return <Server className="h-6 w-6 text-purple-500" />;
      case 'hard-drive': return <HardDrive className="h-6 w-6 text-emerald-600" />;
      case 'activity': return <Activity className="h-6 w-6 text-emerald-600" />;
      default: return <Activity className="h-6 w-6" />;
    }
  };

  // Helper function to render trend icon
  const renderTrendIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up': return <TrendingUp className="h-4 w-4" />;
      case 'trending-down': return <TrendingDown className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, i) => (
        <Card key={card.title} className="shadow hover:shadow-md transition">
          <CardContent className={`p-6 ${card.color}`}>
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-white/80 p-3 shadow">
                {renderIcon(card.icon)}
              </div>
              <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 
                bg-opacity-20 font-medium
                ${card.trend.value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {renderTrendIcon(card.trend.icon)}
                <span>{card.trend.value > 0 ? '+' : ''}{card.trend.value}%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-muted-foreground">{card.title}</div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.description}</div>
            </div>
            <div className="h-20 mt-3">
              {i === 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cpuUsageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {i === 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memoryUsageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {i === 2 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diskUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {diskUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              {i === 3 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuUsageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;
