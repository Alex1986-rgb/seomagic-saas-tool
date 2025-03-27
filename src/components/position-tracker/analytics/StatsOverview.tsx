
import React from 'react';
import { StatCard } from './StatCard';
import { PositionData } from '@/services/position/positionTracker';

interface StatsOverviewProps {
  history: PositionData[];
}

export function StatsOverview({ history }: StatsOverviewProps) {
  // Calculate unique domains
  const uniqueDomains = new Set(history.map(item => item.domain)).size;
  
  // Calculate total keywords
  const totalKeywords = history.reduce((total, item) => total + item.keywords.length, 0);
  
  // Calculate keywords in top 10
  const topTenKeywords = history.reduce((total, item) => 
    total + item.keywords.filter(k => k.position > 0 && k.position <= 10).length, 0
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Всего проверок" 
        value={history.length} 
        description="За все время" 
      />
      <StatCard 
        title="Проверено URL" 
        value={uniqueDomains} 
        description="Уникальных доменов" 
      />
      <StatCard 
        title="Ключевых слов" 
        value={totalKeywords} 
        description="Всего проверено" 
      />
      <StatCard 
        title="В ТОП-10" 
        value={topTenKeywords} 
        description="Найдено позиций" 
        className="text-2xl font-bold text-green-500" 
      />
    </div>
  );
}
