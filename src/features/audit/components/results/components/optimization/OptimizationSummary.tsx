
import React from 'react';

interface OptimizationSummaryProps {
  url: string;
}

const OptimizationSummary: React.FC<OptimizationSummaryProps> = ({ url }) => {
  return (
    <div className="text-sm text-muted-foreground max-w-md">
      <p>
        Оптимизация улучшит SEO-показатели сайта {url} и повысит его позиции в поисковых системах.
      </p>
    </div>
  );
};

export default OptimizationSummary;
