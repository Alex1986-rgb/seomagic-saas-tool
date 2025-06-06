
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface ButtonLoaderProps {
  isLoading?: boolean;
  text?: string;
  loadingText?: string;
  className?: string;
  spinnerSize?: 'xs' | 'sm' | 'md';
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  isLoading = false,
  text = 'Кнопка',
  loadingText = 'Загрузка...',
  className,
  spinnerSize = 'sm'
}) => {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      {isLoading && <LoadingSpinner size={spinnerSize} />}
      {isLoading ? loadingText : text}
    </span>
  );
};

export default ButtonLoader;
