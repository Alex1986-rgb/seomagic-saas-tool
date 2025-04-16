
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { TrendingUp, Globe, FileText, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { useStatsCalculator } from './useStatsCalculator';

interface StatsOverviewProps {
  history: PositionData[];
}

export function StatsOverview({ history }: StatsOverviewProps) {
  const { calculateStats } = useStatsCalculator(history);
  const stats = calculateStats();
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        title="Среднее положение"
        value={stats.avgPosition || '-'}
        icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
        footer={`По ${stats.totalKeywords} ключевым словам`}
      />
      
      <StatCard
        title="Проверенные домены"
        value={stats.totalDomains.size}
        icon={<Globe className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />}
        footer="Уникальные сайты"
      />
      
      <StatCard
        title="Проверки позиций"
        value={stats.totalSearches}
        icon={<FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />}
        footer="Всего выполнено"
      />
      
      <StatCard
        title="Последняя проверка"
        value={formatDate(stats.lastCheck)}
        icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />}
        footer={`Время: ${formatTime(stats.lastCheck)}`}
      />
    </div>
  );
}
