
import React from 'react';
import { PositionData } from '@/services/position/positionTracker';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Globe, FileText, Clock } from 'lucide-react';
import { StatCard } from './StatCard';

interface StatsOverviewProps {
  history: PositionData[];
}

export function StatsOverview({ history }: StatsOverviewProps) {
  // Calculate statistics
  const getStats = () => {
    if (!history.length) return { 
      totalKeywords: 0, 
      totalSearches: 0, 
      positionsInTop10: 0, 
      avgPosition: 0,
      totalDomains: new Set(),
      lastCheck: ''
    };
    
    let totalKeywords = 0;
    let positionsInTop10 = 0;
    let positionSum = 0;
    let positionCount = 0;
    const domainsSet = new Set<string>();
    
    history.forEach(item => {
      domainsSet.add(item.domain);
      
      item.keywords.forEach(keyword => {
        totalKeywords++;
        
        if (keyword.position > 0 && keyword.position <= 10) {
          positionsInTop10++;
        }
        
        if (keyword.position > 0) {
          positionSum += keyword.position;
          positionCount++;
        }
      });
    });
    
    const avgPosition = positionCount > 0 ? Math.round(positionSum / positionCount) : 0;
    const lastCheck = history.length > 0 ? history[0].timestamp : '';
    
    return {
      totalKeywords,
      totalSearches: history.length,
      positionsInTop10,
      avgPosition,
      totalDomains: domainsSet,
      lastCheck
    };
  };
  
  const stats = getStats();
  const lastCheckDate = stats.lastCheck ? new Date(stats.lastCheck).toLocaleDateString() : '-';
  const lastCheckTime = stats.lastCheck ? new Date(stats.lastCheck).toLocaleTimeString() : '-';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Среднее положение"
        value={stats.avgPosition || '-'}
        icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        footer={`По ${stats.totalKeywords} ключевым словам`}
      />
      
      <StatCard
        title="Проверенные домены"
        value={stats.totalDomains.size}
        icon={<Globe className="h-5 w-5 text-emerald-500" />}
        footer="Уникальные сайты"
      />
      
      <StatCard
        title="Проверки позиций"
        value={stats.totalSearches}
        icon={<FileText className="h-5 w-5 text-amber-500" />}
        footer="Всего выполнено"
      />
      
      <StatCard
        title="Последняя проверка"
        value={lastCheckDate}
        icon={<Clock className="h-5 w-5 text-purple-500" />}
        footer={`Время: ${lastCheckTime}`}
      />
    </div>
  );
}
