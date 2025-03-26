
import React from 'react';
import { CreditCard } from 'lucide-react';

interface OptimizationHeadingProps {
  title?: string;
}

const OptimizationHeading: React.FC<OptimizationHeadingProps> = ({ 
  title = "Стоимость оптимизации"
}) => {
  return (
    <h3 className="text-lg font-medium mb-2 flex items-center">
      <CreditCard className="h-5 w-5 mr-2 text-primary" />
      {title}
    </h3>
  );
};

export default OptimizationHeading;
