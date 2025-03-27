
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  footer?: string;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  } | string;
  trendType?: 'up' | 'down';
}

export function StatCard({ title, value, icon, footer, description, trend, trendType }: StatCardProps) {
  // Handle different trend formats
  const renderTrend = () => {
    if (!trend) return null;
    
    if (typeof trend === 'string') {
      // If trend is a simple string
      return (
        <div className={`flex items-center ${trendType === 'down' ? 'text-red-500' : 'text-green-500'}`}>
          {trendType === 'down' ? '↓' : '↑'} {trend}
        </div>
      );
    } else {
      // If trend is an object with value and isUp
      return (
        <div className={`flex items-center ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isUp ? '↑' : '↓'} {trend.value}%
        </div>
      );
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          {icon && (
            <div className="p-2 rounded-full bg-primary/10">
              {icon}
            </div>
          )}
          
          {trend && renderTrend()}
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-1">
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        
        {footer && (
          <p className="text-xs text-muted-foreground mt-1">{footer}</p>
        )}
      </CardContent>
    </Card>
  );
}
