
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedVideoPlaceholderProps } from './types';
import { getSlideData } from './data';
import Slide from './Slide';
import SlideVisualization from './SlideVisualization';
import SlideIndicators from './SlideIndicators';
import PlayerControls from './PlayerControls';
import PlayerHeader from './PlayerHeader';
import Background from './Background';

const AnimatedVideoPlaceholder: React.FC<AnimatedVideoPlaceholderProps> = ({ isPlaying }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(!isPlaying);
  
  const slides = getSlideData();
  
  useEffect(() => {
    setIsPaused(!isPlaying);
  }, [isPlaying]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 3000);
    }
    
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="aspect-video bg-gradient-to-br from-black/90 via-[#1a1a2e] to-black/95 rounded-xl overflow-hidden relative flex flex-col items-center justify-center text-center p-8 shadow-inner">
      <PlayerHeader />
      <Background />
      
      <div className="flex-grow flex flex-col items-center justify-center w-full relative z-10 p-2">
        <AnimatePresence mode="wait">
          {slides.map((slideData, index) => (
            <Slide 
              key={index}
              slideData={slideData}
              currentSlide={currentSlide}
              slideIndex={index}
            />
          ))}
        </AnimatePresence>
        
        <SlideVisualization 
          currentSlide={currentSlide} 
          slideData={slides[currentSlide]} 
        />
      </div>
      
      <SlideIndicators 
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
      
      <PlayerControls 
        isPaused={isPaused}
        togglePause={togglePause}
        currentSlide={currentSlide}
        slides={slides}
      />
    </div>
  );
};

export default AnimatedVideoPlaceholder;
