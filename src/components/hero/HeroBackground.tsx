
import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      <motion.div 
        className="absolute top-1/3 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
    </>
  );
};

export default HeroBackground;
