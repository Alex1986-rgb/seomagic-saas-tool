import React from 'react';

interface FullscreenLoaderProps {
  text?: string;
}

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ 
  text = 'Загрузка...' 
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

interface SectionLoaderProps {
  text?: string;
  minHeight?: string;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({ 
  text = 'Загрузка...',
  minHeight = 'auto'
}) => {
  return (
    <div className="flex items-center justify-center py-8" style={{ minHeight }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 5,
  columns = 3 
}) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          {[...Array(columns)].map((_, j) => (
            <div 
              key={j} 
              className={`h-4 bg-muted rounded animate-pulse ${
                j === 0 ? 'flex-1' : j === 1 ? 'w-20' : 'w-16'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};