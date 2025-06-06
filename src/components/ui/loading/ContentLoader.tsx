
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  lines?: number;
  className?: string;
  skeletonClassName?: string;
  variant?: 'default' | 'card' | 'table' | 'list';
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  isLoading,
  children,
  lines = 3,
  className,
  skeletonClassName,
  variant = 'default'
}) => {
  const renderSkeleton = () => {
    if (variant === 'card') {
      return (
        <div className={cn("space-y-2", skeletonClassName)}>
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      );
    }

    if (variant === 'table') {
      return (
        <div className={cn("space-y-4", skeletonClassName)}>
          <div className="flex gap-4 w-full">
            <Skeleton className="h-6 w-full" />
          </div>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex gap-2 w-full">
              <Skeleton className="h-6 w-[20%]" />
              <Skeleton className="h-6 w-[30%]" />
              <Skeleton className="h-6 w-[35%]" />
              <Skeleton className="h-6 w-[15%]" />
            </div>
          ))}
        </div>
      );
    }

    if (variant === 'list') {
      return (
        <div className={cn("space-y-2", skeletonClassName)}>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      );
    }

    // Default skeleton
    return (
      <div className={cn("space-y-2", skeletonClassName)}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={cn(
            "h-4 w-full",
            i === 0 ? "w-[90%]" : i === lines - 1 ? "w-[70%]" : "w-full"
          )} />
        ))}
      </div>
    );
  };

  return (
    <div className={className}>
      {isLoading ? renderSkeleton() : children}
    </div>
  );
};

export default ContentLoader;
