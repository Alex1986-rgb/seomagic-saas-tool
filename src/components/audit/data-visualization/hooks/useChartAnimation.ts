
import { useState, useEffect } from 'react';

interface AnimationState {
  showAfter: boolean;
  isAnimating: boolean;
}

export const useChartAnimation = (): AnimationState => {
  const [showAfter, setShowAfter] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      const afterTimer = setTimeout(() => {
        setShowAfter(true);
      }, 1500);
      
      return () => clearTimeout(afterTimer);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return { showAfter, isAnimating };
};
