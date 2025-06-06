
import React from 'react';
import { cn } from '@/lib/utils';

interface ContentLoaderProps {
  lines?: number;
  className?: string;
  animate?: boolean;
  height?: 'sm' | 'md' | 'lg';
  showAvatar?: boolean;
}

export const ContentLoader: React.FC<ContentLoaderProps> = ({
  lines = 3,
  className,
  animate = true,
  height = 'md',
  showAvatar = false
}) => {
  const lineHeights = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5'
  };

  const lineHeight = lineHeights[height];

  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="Загрузка контента">
      {showAvatar && (
        <div className="flex items-center space-x-4">
          <div className={cn(
            "rounded-full bg-slate-200 dark:bg-slate-700 w-12 h-12",
            animate && "animate-pulse"
          )} />
          <div className="space-y-2">
            <div className={cn(
              "bg-slate-200 dark:bg-slate-700 rounded w-24",
              lineHeight,
              animate && "animate-pulse"
            )} />
            <div className={cn(
              "bg-slate-200 dark:bg-slate-700 rounded w-32",
              lineHeight,
              animate && "animate-pulse"
            )} />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-slate-200 dark:bg-slate-700 rounded",
              lineHeight,
              // Варьируем ширину для реалистичности
              index === lines - 1 ? 'w-2/3' : 'w-full',
              animate && "animate-pulse"
            )}
            style={{
              animationDelay: animate ? `${index * 0.1}s` : undefined
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentLoader;
