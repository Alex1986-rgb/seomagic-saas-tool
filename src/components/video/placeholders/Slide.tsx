
import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from './types';

// Slide animation variants
const slideVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
};

const Slide: React.FC<SlideProps> = ({ slideData, currentSlide, slideIndex }) => {
  const isActive = currentSlide === slideIndex;
  const Icon = slideData.icon;
  
  if (!isActive) return null;
  
  return (
    <motion.div
      key={slideIndex}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideVariants}
      className="absolute inset-0 flex flex-col items-center justify-center p-8"
    >
      <div className="mb-4 transform hover:scale-110 transition-transform duration-300">
        <Icon className="w-14 h-14" style={{ color: slideData.color }} />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{slideData.title}</h3>
      <p className="text-white/80 mb-6 max-w-md">{slideData.content}</p>
      
      <div className="flex items-center justify-center gap-2 mt-8">
        <div 
          className="px-3 py-1 rounded-full text-xs text-white border border-white/20"
          style={{ backgroundColor: `${slideData.color}40` }}
        >
          Функция {slideIndex + 1}/{5}
        </div>
      </div>
    </motion.div>
  );
};

export default Slide;
