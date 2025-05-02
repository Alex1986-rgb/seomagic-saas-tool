
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendValue,
  className 
}: StatCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-muted-foreground font-medium">{title}</div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-1">{description}</div>
        )}
        {trendValue && (
          <div className={`text-xs mt-1 ${getTrendColor()}`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
