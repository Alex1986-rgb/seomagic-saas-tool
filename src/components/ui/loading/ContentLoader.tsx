
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface ContentLoaderProps {
  text?: string;
  className?: string;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg';
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  text = 'Загрузка контента...',
  className,
  spinnerSize = 'md'
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      className
    )}>
      <LoadingSpinner size={spinnerSize} />
      {text && (
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default ContentLoader;
