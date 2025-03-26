
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  previousScore?: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, previousScore }) => {
  // Calculate trend for overall score
  const getScoreTrend = () => {
    if (!previousScore) return undefined;
    
    const diff = score - previousScore;
    if (diff > 3) return 'up';
    if (diff < -3) return 'down';
    return 'neutral';
  };

  const scoreTrend = getScoreTrend();

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null;
    
    switch(trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'neutral': return <Minus className="h-3 w-3 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="text-2xl font-bold flex items-center gap-2">
      <span className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}>
        {score}
      </span>
      <span className="text-muted-foreground">/100</span>
      
      {scoreTrend && (
        <span className={`trend-indicator ${scoreTrend === 'up' ? 'trend-up' : scoreTrend === 'down' ? 'trend-down' : 'trend-neutral'} flex items-center gap-1`}>
          {getTrendIcon(scoreTrend)}
          <span className="text-xs">{scoreTrend === 'up' ? '+' : scoreTrend === 'down' ? '-' : ''}
            {Math.abs(score - (previousScore || 0))}
          </span>
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
