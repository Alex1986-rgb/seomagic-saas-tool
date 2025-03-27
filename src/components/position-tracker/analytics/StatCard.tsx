
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  footer?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export function StatCard({ title, value, icon, footer, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-full bg-primary/10">
            {icon}
          </div>
          
          {trend && (
            <div className={`flex items-center ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-1">
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
        
        {footer && (
          <p className="text-xs text-muted-foreground mt-1">{footer}</p>
        )}
      </CardContent>
    </Card>
  );
}
