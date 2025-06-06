
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface SectionLoaderProps {
  text?: string;
  className?: string;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg';
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({
  text = 'Загрузка раздела...',
  className,
  spinnerSize = 'md'
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4",
      className
    )}>
      <LoadingSpinner size={spinnerSize} />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground text-center">{text}</p>
      )}
    </div>
  );
};

export default SectionLoader;
