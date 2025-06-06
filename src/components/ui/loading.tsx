
import React from 'react';
import { Loader2 } from 'lucide-react';

interface FullscreenLoaderProps {
  text?: string;
}

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ 
  text = "Загрузка..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

// Re-export from individual files
export { SectionLoader } from './loading/SectionLoader';
export { SkeletonTable } from './loading/SkeletonTable';
export { LoadingSpinner } from './loading/LoadingSpinner';
