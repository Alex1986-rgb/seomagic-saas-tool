
import React from 'react';
import { motion } from 'framer-motion';
import { SlideData } from './types';

interface BarChartProps {
  slideData: SlideData;
  currentSlide: number;
}

const BarChart: React.FC<BarChartProps> = ({ slideData, currentSlide }) => {
  return (
    <div className="flex items-end justify-center h-28 gap-2 mt-6">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-gradient-to-t from-primary/40 to-primary w-6 rounded-t-md"
          initial={{ height: 20 }}
          animate={{ 
            height: Math.random() * 70 + 30,
            backgroundColor: i === currentSlide % 12 
              ? slideData.color 
              : `${slideData.color}80`
          }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
};

export default BarChart;
