
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendType, 
  icon, 
  className 
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={`text-sm font-medium ${
              trendType === 'up' ? 'text-green-500' : 
              trendType === 'down' ? 'text-red-500' : 
              'text-muted-foreground'
            } flex items-center`}>
              {trendType === 'up' && <ArrowUp className="h-3 w-3 mr-1" />}
              {trendType === 'down' && <ArrowDown className="h-3 w-3 mr-1" />}
              {trend}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
