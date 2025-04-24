
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className={cn(
        "animate-spin rounded-full border-t-2 border-b-2 border-primary",
        size === 'small' && "h-8 w-8",
        size === 'medium' && "h-12 w-12",
        size === 'large' && "h-16 w-16"
      )}></div>
    </div>
  );
};

export default LoadingSpinner;
