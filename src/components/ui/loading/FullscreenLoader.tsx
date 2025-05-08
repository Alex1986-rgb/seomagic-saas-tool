
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface FullscreenLoaderProps {
  text?: string;
  isLoading?: boolean;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  spinnerClassName?: string;
  fixed?: boolean;
}

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({
  text = 'Загрузка...',
  isLoading = true,
  spinnerSize = 'lg',
  className,
  spinnerClassName,
  fixed = true
}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={cn(
        fixed ? "fixed" : "absolute",
        "inset-0 flex flex-col items-center justify-center bg-background/95 z-50",
        className
      )}
    >
      <LoadingSpinner size={spinnerSize} className={spinnerClassName} />
      {text && (
        <p className="mt-4 text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default FullscreenLoader;
