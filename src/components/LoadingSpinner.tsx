
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className 
}) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div 
        className={cn(
          'animate-spin rounded-full border-t-2 border-b-2 border-primary',
          sizeClasses[size],
          className
        )}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
