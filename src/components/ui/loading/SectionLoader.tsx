
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
  text = 'Загрузка...',
  className,
  spinnerSize = 'md',
  minHeight = 'min-h-[200px]'
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center w-full",
      minHeight,
      className
    )}>
      <LoadingSpinner size={spinnerSize} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
};

export default SectionLoader;
