
import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 120 }) => {
  // Определение цвета на основе оценки
  const getColor = () => {
    if (score >= 90) return '#10b981'; // зеленый
    if (score >= 70) return '#22c55e'; // светло-зеленый
    if (score >= 50) return '#f59e0b'; // желтый
    if (score >= 30) return '#f97316'; // оранжевый
    return '#ef4444'; // красный
  };

  // Вычисление параметров для SVG
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - score / 100);
  const color = getColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-muted/20"
        />
        
        {/* Прогресс */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Текст оценки */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ color }}
      >
        <span className="text-2xl font-bold">{score}</span>
        <span className="text-xs">из 100</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
