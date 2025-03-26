
import React, { useEffect, useState } from 'react';
import GrowthHeader from './GrowthHeader';
import GrowthItemsGrid from './GrowthItemsGrid';
import GrowthSummary from './GrowthSummary';

const GrowthAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      // Последовательная анимация шагов
      const stepInterval = setInterval(() => {
        setStep(prev => {
          if (prev >= 3) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      
      return () => clearInterval(stepInterval);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const growthItems = [
    { position: "10", newPosition: "3", keyword: "SEO оптимизация" },
    { position: "15", newPosition: "4", keyword: "Аудит сайта" },
    { position: "24", newPosition: "7", keyword: "Анализ конкурентов" },
    { position: "32", newPosition: "11", keyword: "Продвижение сайта" }
  ];

  return (
    <div className="my-12 py-8 max-w-4xl mx-auto">
      <GrowthHeader isVisible={isVisible} />
      <GrowthItemsGrid 
        items={growthItems} 
        isVisible={isVisible} 
        step={step} 
      />
      <GrowthSummary isVisible={step >= 3} />
    </div>
  );
};

export default GrowthAnimation;
