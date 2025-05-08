
import React, { useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

interface LazyLoadContentProps {
  children: React.ReactNode;
  threshold?: number;
  loadingComponent?: React.ReactNode;
  className?: string;
  delay?: number;
  height?: number | string;
  animate?: boolean;
}

/**
 * Компонент для ленивой загрузки содержимого при прокрутке в область видимости
 */
const LazyLoadContent: React.FC<LazyLoadContentProps> = ({
  children,
  threshold = 0.1,
  loadingComponent,
  className = '',
  delay = 100,
  height = 'auto',
  animate = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  
  useEffect(() => {
    if (isInView && !isLoaded) {
      // Добавляем небольшую задержку, чтобы избежать рывков при прокрутке
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isInView, isLoaded, delay]);
  
  return (
    <div 
      ref={ref} 
      className={className}
      style={{ 
        minHeight: !isLoaded ? height : undefined,
        transition: 'all 0.3s ease'
      }}
    >
      {isLoaded ? (
        animate ? (
          <div
            style={{
              animation: 'fadeIn 0.5s ease forwards'
            }}
          >
            {children}
          </div>
        ) : (
          children
        )
      ) : (
        loadingComponent || (
          <div className="animate-pulse w-full h-full bg-slate-200/50 rounded flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default LazyLoadContent;
