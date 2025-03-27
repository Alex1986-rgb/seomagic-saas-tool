
import React from 'react';
import { SlideData } from './types';

interface SlideIndicatorsProps {
  slides: SlideData[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

const SlideIndicators: React.FC<SlideIndicatorsProps> = ({ 
  slides, 
  currentSlide, 
  setCurrentSlide 
}) => {
  return (
    <div className="flex justify-center gap-3 absolute bottom-12 left-0 right-0 z-20">
      {slides.map((slide, index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSlide === index 
              ? 'bg-primary scale-110' 
              : 'bg-white/30 hover:bg-white/50'
          }`}
          style={{
            backgroundColor: currentSlide === index ? slides[currentSlide].color : ''
          }}
        />
      ))}
    </div>
  );
};

export default SlideIndicators;
