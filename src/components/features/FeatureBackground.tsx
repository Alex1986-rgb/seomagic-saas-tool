
import React from 'react';
import { motion } from 'framer-motion';

const FeatureBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full filter blur-[140px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />
    </div>
  );
};

export default FeatureBackground;
