
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreTrendProps {
  currentScore: number;
  previousScore?: number;
}

const ScoreTrend: React.FC<ScoreTrendProps> = ({ currentScore, previousScore }) => {
  if (previousScore === undefined) return null;
  
  const scoreDiff = currentScore - previousScore;
  
  const getTrendIcon = () => {
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-amber-500" />;
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={`absolute bottom-0 right-0 flex items-center gap-1 py-1 px-2 rounded-full ${
        scoreDiff > 0 ? 'bg-green-100 text-green-600' : 
        scoreDiff < 0 ? 'bg-red-100 text-red-600' : 
        'bg-amber-100 text-amber-600'
      }`}
    >
      {getTrendIcon()}
      <span className="text-sm font-medium">
        {scoreDiff > 0 ? '+' : ''}{scoreDiff}
      </span>
    </motion.div>
  );
};

export default ScoreTrend;
