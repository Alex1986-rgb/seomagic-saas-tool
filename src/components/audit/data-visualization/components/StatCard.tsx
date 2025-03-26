
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  isAnimating: boolean;
  showAfter?: boolean;
  suffix?: string;
  delay?: number;
  additionalClasses?: string;
  icon?: React.ReactNode;
  improvement?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  isAnimating, 
  showAfter = false,
  suffix = "ср. баллов",
  delay = 0,
  additionalClasses = "",
  icon,
  improvement
}) => {
  return (
    <motion.div 
      className={`p-4 border rounded-md bg-muted/30 ${additionalClasses} relative`}
      initial={{ opacity: 0, x: showAfter ? 20 : -20 }}
      animate={isAnimating ? { opacity: 1, x: 0 } : { opacity: 0, x: showAfter ? 20 : -20 }}
      transition={{ duration: 0.5, delay: showAfter ? delay : 0 }}
    >
      <div className="text-lg font-medium text-center mb-2">{title}</div>
      <div className="flex items-center justify-center text-3xl font-bold">
        {value.toFixed(1)}
        <span className="text-sm ml-1 font-normal text-muted-foreground">{suffix}</span>
      </div>
      
      {improvement !== undefined && improvement > 0 && showAfter && (
        <motion.div 
          className="absolute -top-3 -right-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-sm font-medium flex items-center"
          initial={{ scale: 0 }}
          animate={showAfter ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {icon || <TrendingUp className="h-3 w-3 mr-1" />}
          +{improvement.toFixed(1)}%
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatCard;
