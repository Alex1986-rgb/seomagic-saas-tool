
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface SectionLoaderProps {
  text?: string;
  className?: string;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg';
  minHeight?: string;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({
  text = 'Загрузка раздела...',
  className,
  spinnerSize = 'md',
  minHeight
}) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      <LoadingSpinner size={spinnerSize} />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground text-center">{text}</p>
      )}
    </div>
  );
};

export default SectionLoader;
