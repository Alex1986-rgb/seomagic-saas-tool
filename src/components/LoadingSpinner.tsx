
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-primary`}></div>
    </div>
  );
};

export default LoadingSpinner;
