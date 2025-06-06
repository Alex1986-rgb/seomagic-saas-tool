
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { SectionLoader } from './SectionLoader';
import { SkeletonTable } from './SkeletonTable';

// Additional loading components for completeness
const LoadingOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative">
    {children}
    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  </div>
);

const ContentLoader: React.FC<{ text?: string }> = ({ text = "Загрузка контента..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-2">
      <LoadingSpinner />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

const ButtonLoader: React.FC = () => (
  <LoadingSpinner size="sm" />
);

export {
  LoadingSpinner,
  LoadingOverlay,
  ContentLoader,
  SectionLoader,
  ButtonLoader,
  SkeletonTable
};
