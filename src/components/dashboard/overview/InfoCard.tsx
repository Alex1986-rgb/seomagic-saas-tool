
import React from 'react';

interface InfoCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  isNegative?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, change, icon, isNegative = false }) => {
  return (
    <div className="neo-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-full bg-primary/10">{icon}</div>
        <div className={`text-sm font-medium ${isNegative ? 'text-destructive' : 'text-green-500'}`}>
          {change}
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground">{title}</h3>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
};
