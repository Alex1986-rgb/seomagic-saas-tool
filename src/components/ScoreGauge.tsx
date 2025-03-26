
import React, { useEffect, useState } from 'react';
import { useMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  className?: string;
  showText?: boolean;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ 
  score, 
  size = 120, 
  className,
  showText = true 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const isMobile = useMobile();
  const actualSize = isMobile ? Math.min(size, 100) : size;
  
  // Определение цвета на основе оценки
  const getColor = (value: number) => {
    if (value >= 90) return '#10b981'; // зеленый
    if (value >= 70) return '#22c55e'; // светло-зеленый
    if (value >= 50) return '#f59e0b'; // желтый
    if (value >= 30) return '#f97316'; // оранжевый
    return '#ef4444'; // красный
  };

  // Анимация заполнения счетчика
  useEffect(() => {
    // Сбрасываем анимацию при изменении score
    setAnimatedScore(0);
    
    const duration = 1500; // Длительность анимации в мс
    const interval = 16; // Примерно 60fps
    const steps = duration / interval;
    const increment = score / steps;
    let currentScore = 0;
    
    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(currentScore));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [score]);

  // Вычисление параметров для SVG
  const radius = actualSize / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - animatedScore / 100);
  const color = getColor(score);
  
  // Вычисление градиента для кольца
  const getGradientId = () => `scoreGradient-${score}`;
  const gradientId = getGradientId();

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)} 
      style={{ width: actualSize, height: actualSize }}
    >
      <svg width={actualSize} height={actualSize} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        
        {/* Фоновый круг */}
        <circle
          cx={actualSize / 2}
          cy={actualSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-muted/20"
        />
        
        {/* Прогресс с анимацией */}
        <circle
          cx={actualSize / 2}
          cy={actualSize / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          filter="drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2))"
        />
      </svg>
      
      {/* Текст оценки с анимацией */}
      {showText && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300"
          style={{ color }}
        >
          <span className="text-2xl font-bold">{animatedScore}</span>
          <span className="text-xs">из 100</span>
          
          {animatedScore >= 80 && (
            <span className="absolute top-1/2 mt-8 text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full animate-pulse">
              Отлично
            </span>
          )}
          {animatedScore < 80 && animatedScore >= 60 && (
            <span className="absolute top-1/2 mt-8 text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Хорошо
            </span>
          )}
          {animatedScore < 60 && (
            <span className="absolute top-1/2 mt-8 text-xs font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
              Нужны улучшения
            </span>
          )}
        </div>
      )}
      
      {/* Альтернативный вид прогресса для маленьких размеров */}
      {size < 80 && (
        <div className="absolute -bottom-6 w-full">
          <Progress value={animatedScore} className="h-1" />
        </div>
      )}
    </div>
  );
};

export default ScoreGauge;
