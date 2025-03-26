
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const FloatingIndicators: React.FC = () => {
  return (
    <div className="hidden md:block">
      <motion.div 
        className="absolute top-20 left-20 opacity-30"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-full">
          <Check size={12} className="text-primary" />
          <span className="text-xs">PageSpeed 98/100</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-40 right-20 opacity-30"
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      >
        <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 rounded-full">
          <Check size={12} className="text-primary" />
          <span className="text-xs">SEO Score +45%</span>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingIndicators;
