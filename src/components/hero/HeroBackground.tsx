
import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
      
      {/* Основное свечение */}
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
      
      {/* Второе свечение */}
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
      
      {/* Добавляем светящиеся точки */}
      <motion.div 
        className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full -z-10"
        animate={{ 
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#8884d8] rounded-full -z-10"
        animate={{ 
          opacity: [0.2, 0.8, 0.2],
          scale: [0.8, 1.3, 0.8]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
      
      {/* Градиентные линии */}
      <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />
      <div className="absolute bottom-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
    </>
  );
};

export default HeroBackground;
