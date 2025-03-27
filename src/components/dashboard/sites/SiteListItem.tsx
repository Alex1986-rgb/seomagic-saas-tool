
import React from 'react';

interface SiteListItemProps {
  url: string;
  score: number;
  status: 'optimized' | 'in-progress' | 'needs-attention';
}

export const SiteListItem: React.FC<SiteListItemProps> = ({ url, score, status }) => {
  const getStatusBadge = () => {
    switch(status) {
      case 'optimized':
        return <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">Оптимизирован</span>;
      case 'in-progress':
        return <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-0.5 rounded-full">В процессе</span>;
      case 'needs-attention':
        return <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full">Требует внимания</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-border-secondary last:border-0">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{url}</h4>
          {getStatusBadge()}
        </div>
      </div>
      <div className={`text-lg font-semibold ${
        score >= 80 ? 'text-green-500' : 
        score >= 60 ? 'text-amber-500' : 'text-destructive'
      }`}>
        {score}/100
      </div>
    </div>
  );
};
