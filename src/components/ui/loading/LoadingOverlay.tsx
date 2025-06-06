
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible?: boolean;
  text?: string;
  className?: string;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible = true,
  text = 'Загрузка...',
  className,
  spinnerSize = 'lg'
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
      className
    )}>
      <div className="text-center">
        <LoadingSpinner size={spinnerSize} />
        {text && (
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
