
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className = "h-14 w-14", 
  size 
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div 
        className={`inline-block animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className} ${size || ''}`} 
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Загрузка...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
