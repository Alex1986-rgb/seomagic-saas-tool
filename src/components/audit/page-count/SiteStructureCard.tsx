
import React from 'react';
import { FolderTree } from 'lucide-react';
import { PageStatistics } from './types';

interface SiteStructureCardProps {
  pageStats: PageStatistics;
}

const SiteStructureCard: React.FC<SiteStructureCardProps> = ({ pageStats }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const getAverageDepth = () => {
    if (!pageStats.levels) return "N/A";
    
    const totalPages = Object.values(pageStats.levels).reduce((sum, count) => sum + count, 0);
    if (totalPages === 0) return "N/A";
    
    const weightedSum = Object.entries(pageStats.levels)
      .reduce((avg, [level, count]) => avg + parseInt(level) * count, 0);
    
    return (weightedSum / totalPages).toFixed(1);
  };

  const getMaxDepth = () => {
    if (!pageStats.levels) return "N/A";
    return Math.max(...Object.keys(pageStats.levels).map(k => parseInt(k)));
  };

  const getCategoryCount = () => {
    if (!pageStats.subpages || !pageStats.subpages['category']) return "N/A";
    return formatNumber(pageStats.subpages['category']);
  };

  return (
    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
      <div className="flex items-center mb-2">
        <FolderTree className="h-4 w-4 text-primary mr-2" />
        <h4 className="text-sm font-medium">Структура сайта</h4>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Средняя глубина:</span>
          <span className="font-medium">{getAverageDepth()}</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span>Количество разделов:</span>
          <span className="font-medium">{getCategoryCount()}</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span>Максимальная глубина:</span>
          <span className="font-medium">{getMaxDepth()}</span>
        </div>
      </div>
    </div>
  );
};

export default SiteStructureCard;
