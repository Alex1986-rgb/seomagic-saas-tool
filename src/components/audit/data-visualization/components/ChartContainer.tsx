
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  children 
}) => {
  return (
    <div className="neo-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      {children}
    </div>
  );
};

export default ChartContainer;
