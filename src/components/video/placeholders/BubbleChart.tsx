
import React from 'react';
import { motion } from 'framer-motion';
import { SlideData } from './types';

interface BubbleChartProps {
  slideData: SlideData;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ slideData }) => {
  return (
    <div className="relative h-28 mt-6">
      {[...Array(12)].map((_, i) => {
        const size = Math.random() * 40 + 20;
        const posX = Math.random() * 80 + 10;
        const posY = Math.random() * 80;
        const delay = Math.random() * 0.5;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: i % 3 === 0 
                ? slideData.color 
                : `${slideData.color}80`,
              width: size,
              height: size,
              left: `${posX}%`,
              top: `${posY}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 0.8 - (size / 120)
            }}
            transition={{ duration: 0.7, delay }}
          />
        );
      })}
    </div>
  );
};

export default BubbleChart;
