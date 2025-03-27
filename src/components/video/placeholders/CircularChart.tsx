
import React from 'react';
import { motion } from 'framer-motion';
import { SlideData } from './types';

interface CircularChartProps {
  slideData: SlideData;
}

const CircularChart: React.FC<CircularChartProps> = ({ slideData }) => {
  const Icon = slideData.icon;

  return (
    <motion.div 
      className="h-28 mt-6 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2"
            style={{ 
              borderColor: slideData.color,
              width: 100 + i * 60, 
              height: 100 + i * 60,
              top: -(i * 30),
              left: -(i * 30)
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 - (i * 0.15) }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          />
        ))}
        <motion.div 
          className="h-16 w-16 rounded-full flex items-center justify-center"
          style={{ backgroundColor: slideData.color }}
        >
          <Icon className="w-14 h-14 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CircularChart;
