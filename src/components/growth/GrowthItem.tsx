
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface GrowthItemProps {
  position: string;
  newPosition: string;
  keyword: string;
  index: number;
  step: number;
}

const GrowthItem: React.FC<GrowthItemProps> = ({ 
  position, 
  newPosition, 
  keyword, 
  index,
  step 
}) => {
  return (
    <motion.div
      className="relative p-6 border border-primary/20 rounded-lg"
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: step >= index ? 0 : 20, 
        opacity: step >= index ? 1 : 0 
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <div className="absolute top-0 left-0 w-[30px] h-[30px] border-t border-l border-primary/40 -mt-px -ml-px" />
      <div className="absolute top-0 right-0 w-[30px] h-[30px] border-t border-r border-primary/40 -mt-px -mr-px" />
      <div className="absolute bottom-0 left-0 w-[30px] h-[30px] border-b border-l border-primary/40 -mb-px -ml-px" />
      <div className="absolute bottom-0 right-0 w-[30px] h-[30px] border-b border-r border-primary/40 -mb-px -mr-px" />
      
      <p className="text-sm text-muted-foreground mb-2">Ключевая фраза</p>
      <h4 className="text-lg font-medium mb-4">{keyword}</h4>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mr-3">
            <span className="font-bold">{position}</span>
          </div>
          <ArrowRight className="mx-2 text-muted-foreground" size={16} />
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
            <span className="font-bold">{newPosition}</span>
          </div>
        </div>
        
        <motion.div 
          className="flex items-center text-green-600 dark:text-green-400"
          initial={{ x: -10, opacity: 0 }}
          animate={{ 
            x: step > index ? 0 : -10, 
            opacity: step > index ? 1 : 0 
          }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <TrendingUp className="mr-1" size={16} />
          <span className="font-bold">
            +{parseInt(position) - parseInt(newPosition)} позиций
          </span>
        </motion.div>
      </div>
      
      <motion.div
        className="h-2 bg-gray-200 dark:bg-gray-700 mt-4 rounded-full overflow-hidden"
        initial={{ width: "100%" }}
        animate={{ width: "100%" }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ 
            width: step > index ? `${((parseInt(position) - parseInt(newPosition)) / parseInt(position)) * 100}%` : "0%" 
          }}
          transition={{ duration: 1, delay: index * 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default GrowthItem;
