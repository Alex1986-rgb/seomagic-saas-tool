
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: 'xs' | 'sm' | 'md' | 'lg';
  overlayClassName?: string;
  spinnerClassName?: string;
  text?: string;
  transparent?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  spinnerSize = 'md',
  overlayClassName,
  spinnerClassName,
  text,
  transparent = false
}) => {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center z-10",
            transparent ? "bg-background/70" : "bg-background/90",
            overlayClassName
          )}
        >
          <LoadingSpinner size={spinnerSize} className={spinnerClassName} />
          {text && (
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
