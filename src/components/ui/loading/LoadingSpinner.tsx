
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
  thickness?: 'thin' | 'regular' | 'thick';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  color,
  thickness = 'regular'
}) => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10'
  };

  const thicknessMap = {
    thin: 'stroke-[2px]',
    regular: 'stroke-[3px]',
    thick: 'stroke-[4px]'
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin", 
        sizeMap[size],
        thicknessMap[thickness],
        color || "text-primary",
        className
      )} 
    />
  );
};

export default LoadingSpinner;
