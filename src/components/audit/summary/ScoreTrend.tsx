
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreTrendProps {
  currentScore: number;
  previousScore?: number;
  variant?: 'default' | 'compact';
  priceToFix?: number; // Added price to fix this item
}

const ScoreTrend: React.FC<ScoreTrendProps> = ({ 
  currentScore, 
  previousScore,
  variant = 'default',
  priceToFix
}) => {
  if (previousScore === undefined) return null;
  
  const scoreDiff = currentScore - previousScore;
  
  const getTrendIcon = () => {
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-amber-500" />;
  };

  const isCompact = variant === 'compact';
  
  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
  };

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5, type: 'spring', stiffness: 500 }}
      className={`${isCompact ? 'inline-flex ml-2' : 'absolute bottom-0 right-0'} flex items-center gap-1 py-1 px-2 rounded-full ${
        scoreDiff > 0 ? 'bg-green-100 text-green-600' : 
        scoreDiff < 0 ? 'bg-red-100 text-red-600' : 
        'bg-amber-100 text-amber-600'
      }`}
    >
      {getTrendIcon()}
      <motion.span 
        className="text-sm font-medium"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 'auto', opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        {scoreDiff > 0 ? '+' : ''}{scoreDiff}
      </motion.span>
      
      {priceToFix !== undefined && (
        <motion.span
          className="text-xs font-medium ml-1 px-1.5 py-0.5 bg-white/50 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          {formatPrice(priceToFix)}
        </motion.span>
      )}
    </motion.div>
  );
};

export default ScoreTrend;
