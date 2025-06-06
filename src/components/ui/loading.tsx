
import React from 'react';
import { Loader2 } from 'lucide-react';

interface FullscreenLoaderProps {
  text?: string;
}

export const FullscreenLoader: React.FC<FullscreenLoaderProps> = ({ 
  text = "Загрузка..." 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
};

// Re-export components from the loading directory
export { LoadingSpinner } from './loading/LoadingSpinner';
export { LoadingOverlay } from './loading/LoadingOverlay';
export { ContentLoader } from './loading/ContentLoader';
export { SectionLoader } from './loading/SectionLoader';
export { ButtonLoader } from './loading/ButtonLoader';
export { SkeletonTable } from './loading/SkeletonTable';
