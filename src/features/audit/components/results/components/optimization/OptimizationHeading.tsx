
import React from 'react';

interface OptimizationHeadingProps {
  title?: string;
}

const OptimizationHeading: React.FC<OptimizationHeadingProps> = ({ 
  title = "Оптимизация сайта"
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">
        Стоимость оптимизации рассчитана на основе количества страниц и найденных проблем
      </p>
    </div>
  );
};

export default OptimizationHeading;
